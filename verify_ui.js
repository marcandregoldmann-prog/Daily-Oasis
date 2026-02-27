const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    // Ensure verification directory exists
    const verificationDir = path.join(process.cwd(), 'verification');
    if (!fs.existsSync(verificationDir)) {
        fs.mkdirSync(verificationDir);
    }

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Set viewport to a typical smartphone size (e.g., iPhone 12 Pro)
    await page.setViewportSize({ width: 390, height: 844 });

    // Load the index.html file
    const indexPath = path.join(process.cwd(), 'index.html');
    await page.goto(`file://${indexPath}`);

    // Wait for the app grid to render
    await page.waitForSelector('.app-card');

    // Take a screenshot of the main screen
    await page.screenshot({ path: path.join(verificationDir, 'main_screen.png') });
    console.log('📸 Main screen screenshot taken');

    // Click the filter button to open the category modal
    await page.click('#filterBtn');
    await page.waitForSelector('#categoryModal.active');

    // Take a screenshot of the category modal
    await page.screenshot({ path: path.join(verificationDir, 'category_modal.png') });
    console.log('📸 Category modal screenshot taken');

    // Close category modal
    await page.click('#categoryClose');

    // Click the settings button to open settings
    await page.click('#settingsBtn');
    await page.waitForSelector('#settingsModal.active');

    // Click Browse All Apps to open App Management
    await page.click('#browseAppsBtn');
    await page.waitForSelector('#appBrowserModal.active');

    // Take a screenshot of the app management modal
    await page.screenshot({ path: path.join(verificationDir, 'app_management.png') });
    console.log('📸 App management screenshot taken');

    await browser.close();
})();
