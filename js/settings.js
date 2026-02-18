/* ============================================
   Daily Oasis - Settings & App Management
   ============================================ */

const Settings = (() => {
    let editingAppId = null;

    // Initialize settings
    const init = () => {
        setupSettingsModal();
        setupAppModal();
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
        const apps = Storage.getApps();
        if (apps.length >= 20) {
            alert('Maximum 20 apps reached. Delete an app first.');
            return;
        }

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
        const icon = document.getElementById('appIcon').value.trim();

        if (!name || !url || !category || !icon) {
            alert('Please fill all fields');
            return;
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
            Search.performSearch();
        } catch (e) {
            alert(e.message);
        }
    };

    // Reset app form
    const resetAppForm = () => {
        document.getElementById('appForm').reset();
        editingAppId = null;
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
