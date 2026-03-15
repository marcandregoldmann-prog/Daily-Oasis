import os
import subprocess
import time
import http.server
import socketserver
import threading
from playwright.sync_api import sync_playwright, expect

# Configuration
PORT = 8087
URL = f"http://localhost:{PORT}"

def start_server():
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()

def test_theme_toggling():
    # Start the server in a separate thread
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()

    # Wait for server to start
    time.sleep(2)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Block external CDN requests to avoid timeouts in restricted environment
        def handle_route(route):
            url = route.request.url
            if any(domain in url for domain in ["cdnjs.cloudflare.com", "fonts.googleapis.com", "fonts.gstatic.com"]):
                route.abort()
            else:
                route.continue_()

        page.route("**", handle_route)

        try:
            print("Navigating to application...")
            page.goto(URL)

            # 1. Verify initial theme (Default is dark)
            print("Checking initial theme...")
            import re
            expect(page.locator("body")).to_have_class(re.compile(r"dark-mode"))
            theme_toggle = page.locator("#themeToggle")
            expect(theme_toggle.locator("i")).to_have_class(re.compile(r"fa-sun")) # updateThemeToggleIcon sets fa-sun when dark

            # Check localStorage
            theme_in_storage = page.evaluate("localStorage.getItem('dailyOasis_settings')")
            assert '"theme":"dark"' in theme_in_storage

            page.screenshot(path="tests/initial_dark.png", animations="disabled")
            print("✅ Initial dark theme verified.")

            # 2. Toggle to light mode
            print("Toggling to light mode...")
            theme_toggle.click()

            expect(page.locator("body")).not_to_have_class(re.compile(r"dark-mode"))
            expect(theme_toggle.locator("i")).to_have_class(re.compile(r"fa-moon")) # updateThemeToggleIcon sets fa-moon when light

            theme_in_storage = page.evaluate("localStorage.getItem('dailyOasis_settings')")
            assert '"theme":"light"' in theme_in_storage

            page.screenshot(path="tests/toggled_light.png", animations="disabled")
            print("✅ Toggled to light mode verified.")

            # 3. Toggle back to dark mode
            print("Toggling back to dark mode...")
            theme_toggle.click()

            expect(page.locator("body")).to_have_class(re.compile(r"dark-mode"))
            expect(theme_toggle.locator("i")).to_have_class(re.compile(r"fa-sun"))

            theme_in_storage = page.evaluate("localStorage.getItem('dailyOasis_settings')")
            assert '"theme":"dark"' in theme_in_storage

            page.screenshot(path="tests/toggled_dark.png", animations="disabled")
            print("✅ Toggled back to dark mode verified.")

            # 4. Verify persistence
            print("Verifying persistence after reload...")
            # Set to light mode first
            theme_toggle.click() # Back to light
            expect(page.locator("body")).not_to_have_class("dark-mode")

            page.reload(wait_until="commit")
            # Wait for initialization
            page.wait_for_timeout(2000)

            expect(page.locator("body")).not_to_have_class(re.compile(r"dark-mode"))
            expect(page.locator("#themeToggle i")).to_have_class(re.compile(r"fa-moon"))
            print("✅ Persistence verified.")

            print("\nAll Theme Toggling Tests Passed! 🎉")

        except Exception as e:
            print(f"\n❌ Test Failed: {e}")
            page.screenshot(path="tests/failure.png", animations="disabled")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    test_theme_toggling()
