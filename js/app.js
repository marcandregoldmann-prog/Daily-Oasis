/* ============================================
   Daily Oasis - Main App Initialization
   ============================================ */

const App = (() => {
    // Initialize the app
    const init = () => {
        // Initialize core systems
        Colors.init();
        UI.initTheme();
        UI.init();
        Search.init();
        DragDrop.init();
        Settings.init();

        // Setup theme toggle
        document.getElementById('themeToggle').addEventListener('click', UI.toggleTheme);

        // Render initial app grid
        Search.performSearch();

        console.log('🌴 Daily Oasis initialized successfully!');
    };

    // Initialize app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        init,
    };
})();
