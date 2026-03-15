/* ============================================
   Daily Oasis - Settings & App Management
   ============================================ */

const Settings = (() => {
    let editingAppId = null;

    // Initialize settings
    const init = () => {
        setupSettingsModal();
        setupAppModal();
        setupAppBrowserModal();
        setupDataManagement();
    };

    // Setup settings modal
    const setupSettingsModal = () => {
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        const settingsClose = document.getElementById('settingsClose');
        const changeColorBtn = document.getElementById('changeColorBtn');
        const addAppBtn = document.getElementById('addAppBtn');
        const resetBtn = document.getElementById('resetBtn');

        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('active');
        });

        settingsClose.addEventListener('click', () => {
            settingsModal.classList.remove('active');
        });

        // Close modal when clicking outside
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.remove('active');
            }
        });

        changeColorBtn.addEventListener('click', () => {
            Colors.showChangeColorModal();
        });

        addAppBtn.addEventListener('click', () => {
            openAddAppModal();
        });

        resetBtn.addEventListener('click', () => {
            if (confirm('This will reset all apps to default. Are you sure?')) {
                Storage.reset();
                Search.resetFilters();
                settingsModal.classList.remove('active');
                UI.renderAppGrid();
            }
        });
    };

    // Setup app modal (add/edit)
    const setupAppModal = () => {
        const appModal = document.getElementById('appModal');
        const appForm = document.getElementById('appForm');
        const appModalClose = document.getElementById('appModalClose');
        const appModalCancel = document.getElementById('appModalCancel');

        appModalClose.addEventListener('click', () => {
            appModal.classList.remove('active');
            resetAppForm();
        });

        appModalCancel.addEventListener('click', () => {
            appModal.classList.remove('active');
            resetAppForm();
        });

        appModal.addEventListener('click', (e) => {
            if (e.target === appModal) {
                appModal.classList.remove('active');
                resetAppForm();
            }
        });

        appForm.addEventListener('submit', handleAppFormSubmit);
    };

    // Open add app modal
    const openAddAppModal = () => {
        editingAppId = null;
        document.getElementById('appModalTitle').textContent = '➕ Add New App';
        resetAppForm();
        document.getElementById('appModal').classList.add('active');
    };

    // Open edit app modal
    const openEditAppModal = (app) => {
        editingAppId = app.id;
        document.getElementById('appModalTitle').textContent = '✏️ Edit App';

        document.getElementById('appName').value = app.name;
        document.getElementById('appUrl').value = app.url;
        document.getElementById('appCategory').value = app.category;
        document.getElementById('appIcon').value = app.icon;

        document.getElementById('appModal').classList.add('active');
    };

    // Handle app form submit
    const handleAppFormSubmit = (e) => {
        e.preventDefault();

        const name = document.getElementById('appName').value.trim();
        const url = document.getElementById('appUrl').value.trim();
        const category = document.getElementById('appCategory').value;
        let icon = document.getElementById('appIcon').value.trim();

        if (!name || !url || !category) {
            alert('Please fill Name, URL, and Category');
            return;
        }

        if (!Utils.isValidUrl(url)) {
            alert('Please enter a valid URL starting with http:// or https://');
            return;
        }

        // Auto-detect icon if not provided
        if (!icon) {
            icon = IconDetector.getIcon(name);
        }

        try {
            const appData = { name, url, category, icon };

            if (editingAppId) {
                Storage.updateApp(editingAppId, appData);
            } else {
                Storage.addApp(appData);
            }

            document.getElementById('appModal').classList.remove('active');
            resetAppForm();
            // Refreshes the grid
            UI.renderAppGrid();
        } catch (e) {
            alert(e.message);
        }
    };

    // Reset app form
    const resetAppForm = () => {
        document.getElementById('appForm').reset();
        editingAppId = null;
    };

    // Setup app browser modal
    const setupAppBrowserModal = () => {
        const browseAppsBtn = document.getElementById('browseAppsBtn');
        const appBrowserModal = document.getElementById('appBrowserModal');
        const appBrowserClose = document.getElementById('appBrowserClose');
        const appBrowserCancel = document.getElementById('appBrowserCancel');
        const appBrowserSave = document.getElementById('appBrowserSave');
        const appBrowserSearch = document.getElementById('appBrowserSearch');
        const appBrowserFilterBtns = appBrowserModal.querySelectorAll('.filter-btn');
        let selectedAppIds = new Set();

        browseAppsBtn.addEventListener('click', () => {
            // Get currently visible apps to pre-select
            selectedAppIds = new Set(Storage.getVisibleApps().map(app => app.id));
            renderAppBrowser();
            appBrowserModal.classList.add('active');
        });

        appBrowserClose.addEventListener('click', () => {
            appBrowserModal.classList.remove('active');
        });

        appBrowserCancel.addEventListener('click', () => {
            appBrowserModal.classList.remove('active');
        });

        appBrowserModal.addEventListener('click', (e) => {
            if (e.target === appBrowserModal) {
                appBrowserModal.classList.remove('active');
            }
        });

        appBrowserSave.addEventListener('click', () => {
            try {
                const appIds = Array.from(selectedAppIds);
                Storage.setVisibleApps(appIds);
                // Refresh main grid immediately
                UI.renderAppGrid();

                appBrowserModal.classList.remove('active');
                alert('Selection saved! Your dashboard has been updated.');
            } catch (e) {
                alert('Error: ' + e.message);
            }
        });

        // Filter buttons in app browser
        appBrowserFilterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                 appBrowserFilterBtns.forEach(b => b.classList.remove('active'));
                 e.target.classList.add('active');
                 renderAppBrowser();
            });
        });

        // Search in app browser
        appBrowserSearch.addEventListener('input', renderAppBrowser);

        function renderAppBrowser() {
            const searchQuery = appBrowserSearch.value.toLowerCase();
            const filterCategory = Array.from(appBrowserFilterBtns)
                .find(btn => btn.classList.contains('active'))
                ?.getAttribute('data-category') || 'all';

            let allApps = Storage.getAllApps();

            // Apply filter
            if (filterCategory !== 'all') {
                allApps = allApps.filter(app => app.category === filterCategory);
            }

            // Apply search
            if (searchQuery) {
                allApps = allApps.filter(app => {
                    const searchFields = [app.name, app.url, app.category].join(' ').toLowerCase();
                    return searchFields.includes(searchQuery);
                });
            }

            // Render apps
            const appBrowserList = document.getElementById('appBrowserList');
            appBrowserList.innerHTML = allApps.map(app => {
                const isSelected = selectedAppIds.has(app.id);
                let iconClass = app.icon || 'fa-globe';
                // Ensure icon has proper Font Awesome classes
                if (!iconClass.includes('fa-')) {
                    iconClass = 'fa-' + iconClass;
                }
                if (!iconClass.startsWith('fas ')) {
                    iconClass = 'fas ' + iconClass;
                }

                return `
                    <div class="app-browser-item ${isSelected ? 'selected' : ''}" data-app-id="${app.id}">
                        <div class="app-browser-item-icon">
                            <i class="${iconClass}"></i>
                        </div>
                        <div class="app-browser-item-name">${Utils.escapeHtml(app.name)}</div>
                    </div>
                `;
            }).join('');

            // Attach click handlers
            const appBrowserItems = appBrowserList.querySelectorAll('.app-browser-item');
            appBrowserItems.forEach(item => {
                item.addEventListener('click', () => {
                    const appId = item.getAttribute('data-app-id');
                    if (selectedAppIds.has(appId)) {
                        selectedAppIds.delete(appId);
                    } else {
                        if (selectedAppIds.size >= Storage.MAX_VISIBLE_APPS) {
                            alert(`Maximum ${Storage.MAX_VISIBLE_APPS} apps can be visible. Please deselect an app first.`);
                            return;
                        }
                        selectedAppIds.add(appId);
                    }
                    renderAppBrowser();
                });
            });
        };
    };


    // Setup data management
    const setupDataManagement = () => {
        const exportBtn = document.getElementById('exportBtn');
        const importBtn = document.getElementById('importBtn');
        const importFile = document.getElementById('importFile');

        exportBtn.addEventListener('click', () => {
            const data = Storage.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `daily-oasis-backup-${new Date().getTime()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        importBtn.addEventListener('click', () => {
            importFile.click();
        });

        importFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    Storage.importData(event.target.result);
                    document.getElementById('settingsModal').classList.remove('active');
                    Search.resetFilters();
                    UI.renderAppGrid();
                    alert('Data imported successfully!');
                } catch (err) {
                    alert('Error importing data: ' + err.message);
                }
            };
            reader.readAsText(file);

            // Reset input
            importFile.value = '';
        });
    };

    return {
        init,
        openAddAppModal,
        openEditAppModal,
    };
})();
