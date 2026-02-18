/* ============================================
   Daily Oasis - UI Rendering & Updates
   ============================================ */

const UI = (() => {
    // Initialize UI
    const init = () => {
        renderAppGrid();
        setupContextMenu();
    };

    // Render the app grid
    const renderAppGrid = () => {
        updateAppGrid(Storage.getApps());
    };

    // Update app grid with given apps
    const updateAppGrid = (apps) => {
        const appGrid = document.getElementById('appGrid');
        const emptyState = document.getElementById('emptyState');

        if (apps.length === 0) {
            appGrid.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        // Sort apps by order
        apps.sort((a, b) => a.order - b.order);

        appGrid.innerHTML = apps.map(app => createAppCard(app)).join('');

        // Attach event listeners to cards
        attachCardListeners();
    };

    // Create an app card HTML
    const createAppCard = (app) => {
        let iconClass = app.icon || 'fa-globe';
        // Ensure icon has proper Font Awesome classes
        if (!iconClass.includes('fa-')) {
            iconClass = 'fa-' + iconClass;
        }
        if (!iconClass.startsWith('fas ')) {
            iconClass = 'fas ' + iconClass;
        }

        return `
            <div class="app-card" data-app-id="${app.id}" draggable="true" role="button" tabindex="0" aria-label="${app.name}">
                <div class="app-icon-circle">
                    <i class="${iconClass}"></i>
                </div>
                <div class="app-name">${escapeHtml(app.name)}</div>
            </div>
        `;
    };

    // Attach event listeners to app cards
    const attachCardListeners = () => {
        const appCards = document.querySelectorAll('.app-card');

        appCards.forEach(card => {
            // Click to open app
            card.addEventListener('click', (e) => {
                if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
                    const appId = card.getAttribute('data-app-id');
                    const app = Storage.getApps().find(a => a.id === appId);
                    if (app) {
                        window.open(app.url, '_blank');
                    }
                }
            });

            // Right-click context menu
            card.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const appId = card.getAttribute('data-app-id');
                showContextMenu(e, appId);
            });

            // Long-press for mobile
            let touchTimer;
            card.addEventListener('touchstart', () => {
                touchTimer = setTimeout(() => {
                    const appId = card.getAttribute('data-app-id');
                    const rect = card.getBoundingClientRect();
                    showContextMenu({ clientX: rect.left, clientY: rect.top }, appId);
                }, 500);
            });

            card.addEventListener('touchend', () => {
                clearTimeout(touchTimer);
            });
        });
    };

    // Setup context menu
    const setupContextMenu = () => {
        const contextMenu = document.getElementById('contextMenu');
        let currentAppId = null;

        document.addEventListener('click', () => {
            contextMenu.classList.remove('visible');
        });

        const contextMenuItems = contextMenu.querySelectorAll('.context-menu-item');
        contextMenuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.getAttribute('data-action');
                if (currentAppId) {
                    handleContextMenuAction(action, currentAppId);
                    contextMenu.classList.remove('visible');
                }
            });
        });

        // Store reference to app ID and functions
        window._contextMenuState = {
            setCurrentAppId: (id) => { currentAppId = id; },
            getCurrentAppId: () => currentAppId,
        };
    };

    // Show context menu
    const showContextMenu = (event, appId) => {
        const contextMenu = document.getElementById('contextMenu');
        window._contextMenuState.setCurrentAppId(appId);

        contextMenu.style.left = event.clientX + 'px';
        contextMenu.style.top = event.clientY + 'px';
        contextMenu.classList.add('visible');
    };

    // Handle context menu actions
    const handleContextMenuAction = (action, appId) => {
        const app = Storage.getApps().find(a => a.id === appId);
        if (!app) return;

        switch (action) {
            case 'edit':
                Settings.openEditAppModal(app);
                break;
            case 'duplicate':
                try {
                    Storage.duplicateApp(appId);
                    Search.performSearch();
                } catch (e) {
                    alert(e.message);
                }
                break;
            case 'delete':
                if (confirm(`Delete "${app.name}"?`)) {
                    Storage.deleteApp(appId);
                    Search.performSearch();
                }
                break;
        }
    };

    // Update theme toggle button icon
    const updateThemeToggleIcon = () => {
        const themeToggle = document.getElementById('themeToggle');
        const isDarkMode = document.body.classList.contains('dark-mode');

        if (isDarkMode) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    };

    // Toggle theme
    const toggleTheme = () => {
        const isDarkMode = document.body.classList.contains('dark-mode');

        if (isDarkMode) {
            document.body.classList.remove('dark-mode');
            Storage.updateSetting('theme', 'light');
        } else {
            document.body.classList.add('dark-mode');
            Storage.updateSetting('theme', 'dark');
        }

        updateThemeToggleIcon();
    };

    // Initialize theme on load
    const initTheme = () => {
        const settings = Storage.getSettings();
        if (settings.theme === 'dark') {
            document.body.classList.add('dark-mode');
        }
        updateThemeToggleIcon();
    };

    // Escape HTML special characters
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    return {
        init,
        renderAppGrid,
        updateAppGrid,
        toggleTheme,
        initTheme,
        updateThemeToggleIcon,
        showNotification: (message, type = 'info') => {
            // Simple notification - could be enhanced
            console.log(`[${type}] ${message}`);
        },
    };
})();
