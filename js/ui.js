/* ============================================
   Daily Oasis - UI Rendering & Updates
   ============================================ */

const UI = (() => {
    // Initialize UI
    const init = () => {
        setupFloatingHeader();
        renderAppGrid();
        setupContextMenu();
        setupCategoryModal();
    };

    // Render the app grid
    const renderAppGrid = () => {
        // Always get visible apps which are now strictly managed to be max 20
        updateAppGrid(Storage.getVisibleApps());
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

        // Ensure we only render up to MAX_VISIBLE_APPS just in case
        const visibleApps = apps.slice(0, Storage.MAX_VISIBLE_APPS);

        appGrid.innerHTML = visibleApps.map(app => createAppCard(app)).join('');

        // Attach event listeners to cards
        attachCardListeners();
    };

    // Create an app card HTML
    const createAppCard = (app) => {
        let iconClass = app.icon || 'fa-solid fa-globe';

        // Intelligent prefix handling
        const hasPrefix = iconClass.includes('fa-brands') ||
                          iconClass.includes('fa-solid') ||
                          iconClass.includes('fa-regular') ||
                          iconClass.includes('fab ') ||
                          iconClass.includes('fas ') ||
                          iconClass.includes('far ');

        if (!hasPrefix) {
            // If no prefix found, check if it's likely a brand or default to solid
            // But since we are cleaning up data, safer to default to solid if missing
            if (!iconClass.startsWith('fa-')) {
                 iconClass = 'fa-' + iconClass;
            }
            iconClass = 'fa-solid ' + iconClass;
        }

        return `
            <div class="app-card" data-app-id="${app.id}" draggable="true" role="button" tabindex="0" aria-label="${app.name}">
                <div class="app-icon-circle">
                    <i class="${iconClass}"></i>
                </div>
                <div class="app-name">${Utils.escapeHtml(app.name)}</div>
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
                    if (app && Utils.isValidUrl(app.url)) {
                        window.open(app.url, '_blank');
                    } else if (app) {
                        console.warn(`Blocked attempt to open invalid URL: ${app.url}`);
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

        // Adjust position to keep it on screen
        let x = event.clientX;
        let y = event.clientY;

        // Simple boundary check (assuming menu width ~150px)
        if (x + 150 > window.innerWidth) {
            x = window.innerWidth - 160;
        }
        if (y + 100 > window.innerHeight) {
            y = window.innerHeight - 110;
        }

        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
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
                    renderAppGrid(); // Refresh grid
                } catch (e) {
                    alert(e.message);
                }
                break;
            case 'delete':
                if (confirm(`Delete "${app.name}"?`)) {
                    Storage.deleteApp(appId);
                    renderAppGrid(); // Refresh grid
                }
                break;
        }
    };

    // Update theme toggle button icon
    const updateThemeToggleIcon = () => {
        const themeToggle = document.getElementById('themeToggle');
        const isDarkMode = document.body.classList.contains('dark-mode');

        if (isDarkMode) {
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
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


    // Setup Category Modal
    const setupCategoryModal = () => {
        const filterBtn = document.getElementById('filterBtn');
        const categoryModal = document.getElementById('categoryModal');
        const categoryClose = document.getElementById('categoryClose');
        const categoryBtns = document.querySelectorAll('.category-btn');

        if(filterBtn) {
            filterBtn.addEventListener('click', () => {
                categoryModal.classList.add('active');
            });
        }

        if(categoryClose) {
            categoryClose.addEventListener('click', () => {
                categoryModal.classList.remove('active');
            });
        }

        categoryModal.addEventListener('click', (e) => {
            if (e.target === categoryModal) {
                categoryModal.classList.remove('active');
            }
        });

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                categoryBtns.forEach(b => b.classList.remove('active'));
                // Add to clicked
                btn.classList.add('active');

                const category = btn.getAttribute('data-category');

                // Since requirements say "strictly locked to 20 apps", filtering on the main screen
                // might contradict "20 apps always visible".
                // However, usually filtering means showing a subset.
                // If the user wants 20 apps fixed, filtering might be for finding apps to LAUNCH.
                // BUT, the requirement "Everything must be visible in viewport" suggests the main grid IS the view.

                // Let's implement filtering on the main grid for now.
                // If 'all', show the 20 visible apps.
                // If category, show only visible apps matching category.

                const visibleApps = Storage.getVisibleApps();
                let filteredApps = visibleApps;

                if (category !== 'all') {
                    filteredApps = visibleApps.filter(app => app.category === category);
                }

                updateAppGrid(filteredApps);
                categoryModal.classList.remove('active');
            });
        });
    };

    // Setup Floating Header logic (Search toggle mainly)
    const setupFloatingHeader = () => {
        const searchToggleBtn = document.getElementById('searchToggleBtn');
        const searchBarExpanded = document.getElementById('searchBarExpanded');
        const searchCloseBtn = document.getElementById('searchCloseBtn');
        const searchInput = document.getElementById('searchInput');

        searchToggleBtn.addEventListener('click', () => {
            searchBarExpanded.classList.toggle('active');
            if (searchBarExpanded.classList.contains('active')) {
                searchInput.focus();
            }
        });

        searchCloseBtn.addEventListener('click', () => {
            searchBarExpanded.classList.remove('active');
            searchInput.value = '';
            // Reset search filter
            Search.performSearch();
        });
    };

    return {
        init,
        renderAppGrid,
        updateAppGrid,
        toggleTheme,
        initTheme,
        updateThemeToggleIcon,
        showNotification: (message, type = 'info') => {
            console.log(`[${type}] ${message}`);
        },
    };
})();
