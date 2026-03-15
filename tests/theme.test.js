
function runTests() {
    console.log('Running Theme Toggling Tests...');

    // Mock Storage
    const storageSettings = { theme: 'light' };
    global.Storage = {
        updateSetting: (key, value) => {
            storageSettings[key] = value;
        },
        getSettings: () => storageSettings,
        getVisibleApps: () => [], // UI.init calls this through renderAppGrid
        MAX_VISIBLE_APPS: 20
    };

    // Helper to reset DOM
    const resetDOM = () => {
        document.body.innerHTML = `
            <button id="themeToggle"></button>
            <div id="appGrid"></div>
            <div id="emptyState"></div>
        `;
        document.body.className = '';
    };

    // Test Case 1: Toggle from light to dark
    (() => {
        resetDOM();
        storageSettings.theme = 'light';

        UI.toggleTheme();

        if (!document.body.classList.contains('dark-mode')) {
            throw new Error('Test Case 1 Failed: body should have dark-mode class');
        }
        if (storageSettings.theme !== 'dark') {
            throw new Error('Test Case 1 Failed: storage should be updated to dark');
        }
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle.innerHTML.includes('fa-sun')) {
            throw new Error('Test Case 1 Failed: icon should be sun');
        }
        console.log('✅ Test Case 1 Passed: Toggle light to dark');
    })();

    // Test Case 2: Toggle from dark to light
    (() => {
        resetDOM();
        document.body.classList.add('dark-mode');
        storageSettings.theme = 'dark';

        UI.toggleTheme();

        if (document.body.classList.contains('dark-mode')) {
            throw new Error('Test Case 2 Failed: body should NOT have dark-mode class');
        }
        if (storageSettings.theme !== 'light') {
            throw new Error('Test Case 2 Failed: storage should be updated to light');
        }
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle.innerHTML.includes('fa-moon')) {
            throw new Error('Test Case 2 Failed: icon should be moon');
        }
        console.log('✅ Test Case 2 Passed: Toggle dark to light');
    })();

    // Test Case 3: Initializing theme from storage (dark)
    (() => {
        resetDOM();
        storageSettings.theme = 'dark';

        UI.initTheme();

        if (!document.body.classList.contains('dark-mode')) {
            throw new Error('Test Case 3 Failed: body should have dark-mode class on init');
        }
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle.innerHTML.includes('fa-sun')) {
            throw new Error('Test Case 3 Failed: icon should be sun on init');
        }
        console.log('✅ Test Case 3 Passed: Initialize dark theme');
    })();

    // Test Case 4: Initializing theme from storage (light)
    (() => {
        resetDOM();
        storageSettings.theme = 'light';

        UI.initTheme();

        if (document.body.classList.contains('dark-mode')) {
            throw new Error('Test Case 4 Failed: body should NOT have dark-mode class on init');
        }
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle.innerHTML.includes('fa-moon')) {
            throw new Error('Test Case 4 Failed: icon should be moon on init');
        }
        console.log('✅ Test Case 4 Passed: Initialize light theme');
    })();

    console.log('All Theme Toggling Tests Passed! 🎉');
}

module.exports = { runTests };
