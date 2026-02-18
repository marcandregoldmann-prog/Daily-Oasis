/* ============================================
   Daily Oasis - LocalStorage Management
   ============================================ */

const Storage = (() => {
    const KEYS = {
        APPS: 'dailyOasis_apps',
        SETTINGS: 'dailyOasis_settings',
        INITIALIZED: 'dailyOasis_initialized',
    };

    // Default apps data
    const DEFAULT_APPS = [
        // Soziales
        { id: 'wa', name: 'WhatsApp', url: 'https://web.whatsapp.com/', category: 'Soziales', icon: 'fa-whatsapp', order: 0 },
        { id: 'ig', name: 'Instagram', url: 'https://www.instagram.com/', category: 'Soziales', icon: 'fa-instagram', order: 1 },
        { id: 'sc', name: 'Snapchat', url: 'https://web.snapchat.com/', category: 'Soziales', icon: 'fa-snapchat', order: 2 },

        // Entertainment
        { id: 'yt', name: 'YouTube', url: 'https://www.youtube.com/', category: 'Entertainment', icon: 'fa-youtube', order: 3 },
        { id: 'ytm', name: 'YouTube Music', url: 'https://music.youtube.com/', category: 'Entertainment', icon: 'fa-music', order: 4 },
        { id: 'sh', name: 'StreamHub', url: 'https://streamhub.example.com/', category: 'Entertainment', icon: 'fa-stream', order: 5 },
        { id: 'stremio', name: 'Stremio', url: 'https://www.stremio.com/', category: 'Entertainment', icon: 'fa-tv', order: 6 },

        // KI & Tools
        { id: 'claude', name: 'Claude', url: 'https://claude.ai/', category: 'KI & Tools', icon: 'fa-brain', order: 7 },
        { id: 'claude-pwa', name: 'Claude (PWA)', url: 'https://claude.ai/', category: 'KI & Tools', icon: 'fa-window-maximize', order: 8 },
        { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com/', category: 'KI & Tools', icon: 'fa-sparkles', order: 9 },
        { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/', category: 'KI & Tools', icon: 'fa-comment', order: 10 },
        { id: 'google-ai', name: 'Google AI Studio', url: 'https://aistudio.google.com/', category: 'KI & Tools', icon: 'fa-flask', order: 11 },
        { id: 'notebooklm', name: 'NotebookLM', url: 'https://notebooklm.google.com/', category: 'KI & Tools', icon: 'fa-notebook', order: 12 },

        // Produktives
        { id: 'firefox', name: 'Firefox', url: 'https://www.mozilla.org/firefox/', category: 'Produktives', icon: 'fa-firefox', order: 13 },
        { id: 'chrome', name: 'Google Chrome', url: 'https://www.google.com/intl/de/chrome/', category: 'Produktives', icon: 'fa-chrome', order: 14 },
        { id: 'gmail', name: 'Google Mail', url: 'https://mail.google.com/', category: 'Produktives', icon: 'fa-envelope', order: 15 },
        { id: 'maps', name: 'Google Maps', url: 'https://maps.google.com/', category: 'Produktives', icon: 'fa-map', order: 16 },
        { id: 'protonvpn', name: 'ProtonVPN', url: 'https://protonvpn.com/', category: 'Produktives', icon: 'fa-shield', order: 17 },
        { id: 'protonmail', name: 'ProtonMail', url: 'https://mail.proton.me/', category: 'Produktives', icon: 'fa-lock', order: 18 },
        { id: 'github', name: 'GitHub', url: 'https://github.com/', category: 'Produktives', icon: 'fa-github', order: 19 },
    ];

    const DEFAULT_SETTINGS = {
        theme: 'light',
        primaryColor: '#8B7355',
    };

    // Initialize storage if not already done
    const init = () => {
        if (!isInitialized()) {
            setApps(DEFAULT_APPS);
            setSettings(DEFAULT_SETTINGS);
            setInitialized(true);
        }
    };

    // Check if storage has been initialized
    const isInitialized = () => {
        return localStorage.getItem(KEYS.INITIALIZED) === 'true';
    };

    // Set initialized flag
    const setInitialized = (value) => {
        localStorage.setItem(KEYS.INITIALIZED, value ? 'true' : 'false');
    };

    // Get all apps
    const getApps = () => {
        try {
            const apps = localStorage.getItem(KEYS.APPS);
            return apps ? JSON.parse(apps) : DEFAULT_APPS;
        } catch (e) {
            console.error('Error retrieving apps:', e);
            return DEFAULT_APPS;
        }
    };

    // Set all apps
    const setApps = (apps) => {
        try {
            localStorage.setItem(KEYS.APPS, JSON.stringify(apps));
        } catch (e) {
            console.error('Error saving apps:', e);
        }
    };

    // Add a new app
    const addApp = (appData) => {
        const apps = getApps();
        if (apps.length >= 20) {
            throw new Error('Maximum 20 apps allowed');
        }

        const newApp = {
            id: generateId(),
            ...appData,
            order: apps.length,
            dateAdded: new Date().toISOString(),
        };

        apps.push(newApp);
        setApps(apps);
        return newApp;
    };

    // Update an app
    const updateApp = (appId, appData) => {
        const apps = getApps();
        const index = apps.findIndex(app => app.id === appId);

        if (index === -1) {
            throw new Error('App not found');
        }

        apps[index] = { ...apps[index], ...appData };
        setApps(apps);
        return apps[index];
    };

    // Delete an app
    const deleteApp = (appId) => {
        let apps = getApps();
        apps = apps.filter(app => app.id !== appId);

        // Re-order remaining apps
        apps.forEach((app, index) => {
            app.order = index;
        });

        setApps(apps);
    };

    // Duplicate an app
    const duplicateApp = (appId) => {
        const apps = getApps();
        if (apps.length >= 20) {
            throw new Error('Maximum 20 apps allowed');
        }

        const appToDuplicate = apps.find(app => app.id === appId);
        if (!appToDuplicate) {
            throw new Error('App not found');
        }

        const newApp = {
            ...appToDuplicate,
            id: generateId(),
            order: apps.length,
            dateAdded: new Date().toISOString(),
        };

        apps.push(newApp);
        setApps(apps);
        return newApp;
    };

    // Update app order
    const updateAppOrder = (orderedAppIds) => {
        const apps = getApps();
        const appsMap = new Map(apps.map(app => [app.id, app]));

        const orderedApps = orderedAppIds
            .map(id => appsMap.get(id))
            .filter(app => app !== undefined);

        orderedApps.forEach((app, index) => {
            app.order = index;
        });

        setApps(orderedApps);
    };

    // Get settings
    const getSettings = () => {
        try {
            const settings = localStorage.getItem(KEYS.SETTINGS);
            return settings ? JSON.parse(settings) : DEFAULT_SETTINGS;
        } catch (e) {
            console.error('Error retrieving settings:', e);
            return DEFAULT_SETTINGS;
        }
    };

    // Set settings
    const setSettings = (settings) => {
        try {
            localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    };

    // Update a specific setting
    const updateSetting = (key, value) => {
        const settings = getSettings();
        settings[key] = value;
        setSettings(settings);
    };

    // Export data as JSON
    const exportData = () => {
        const data = {
            apps: getApps(),
            settings: getSettings(),
            exportedAt: new Date().toISOString(),
        };
        return JSON.stringify(data, null, 2);
    };

    // Import data from JSON
    const importData = (jsonString) => {
        try {
            const data = JSON.parse(jsonString);

            if (!data.apps || !Array.isArray(data.apps)) {
                throw new Error('Invalid apps data');
            }

            if (data.apps.length > 20) {
                throw new Error('Cannot import more than 20 apps');
            }

            setApps(data.apps);
            if (data.settings) {
                setSettings(data.settings);
            }

            return true;
        } catch (e) {
            console.error('Error importing data:', e);
            throw e;
        }
    };

    // Reset to default
    const reset = () => {
        setApps(DEFAULT_APPS);
        setSettings(DEFAULT_SETTINGS);
    };

    // Generate unique ID
    const generateId = () => {
        return 'app_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };

    return {
        init,
        isInitialized,
        getApps,
        setApps,
        addApp,
        updateApp,
        deleteApp,
        duplicateApp,
        updateAppOrder,
        getSettings,
        setSettings,
        updateSetting,
        exportData,
        importData,
        reset,
    };
})();

// Initialize storage on page load
Storage.init();
