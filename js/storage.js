/* ============================================
   Daily Oasis - LocalStorage Management
   ============================================ */

const Storage = (() => {
    const KEYS = {
        APPS: 'dailyOasis_apps',
        SETTINGS: 'dailyOasis_settings',
        INITIALIZED: 'dailyOasis_initialized',
    };

    const MAX_VISIBLE_APPS = 20;

    // Default apps data
    const DEFAULT_APPS = [
        // Soziales
        { id: 'wa', name: 'WhatsApp', url: 'https://web.whatsapp.com/', category: 'Soziales', icon: 'fa-whatsapp', visible: true, order: 0 },
        { id: 'ig', name: 'Instagram', url: 'https://www.instagram.com/', category: 'Soziales', icon: 'fa-instagram', visible: true, order: 1 },
        { id: 'sc', name: 'Snapchat', url: 'https://web.snapchat.com/', category: 'Soziales', icon: 'fa-snapchat', visible: true, order: 2 },

        // Entertainment
        { id: 'yt', name: 'YouTube', url: 'https://www.youtube.com/', category: 'Entertainment', icon: 'fa-youtube', visible: true, order: 3 },
        { id: 'ytm', name: 'YouTube Music', url: 'https://music.youtube.com/', category: 'Entertainment', icon: 'fa-music', visible: true, order: 4 },
        { id: 'sh', name: 'StreamHub', url: 'https://streamhub.example.com/', category: 'Entertainment', icon: 'fa-stream', visible: true, order: 5 },
        { id: 'stremio', name: 'Stremio', url: 'https://www.stremio.com/', category: 'Entertainment', icon: 'fa-tv', visible: true, order: 6 },

        // KI & Tools
        { id: 'claude', name: 'Claude', url: 'https://claude.ai/', category: 'KI & Tools', icon: 'fa-brain', visible: true, order: 7 },
        { id: 'claude-pwa', name: 'Claude (PWA)', url: 'https://claude.ai/', category: 'KI & Tools', icon: 'fa-window-maximize', visible: true, order: 8 },
        { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com/', category: 'KI & Tools', icon: 'fa-sparkles', visible: true, order: 9 },
        { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/', category: 'KI & Tools', icon: 'fa-comment', visible: true, order: 10 },
        { id: 'google-ai', name: 'Google AI Studio', url: 'https://aistudio.google.com/', category: 'KI & Tools', icon: 'fa-flask', visible: true, order: 11 },
        { id: 'notebooklm', name: 'NotebookLM', url: 'https://notebooklm.google.com/', category: 'KI & Tools', icon: 'fa-notebook', visible: true, order: 12 },

        // Produktives
        { id: 'firefox', name: 'Firefox', url: 'https://www.mozilla.org/firefox/', category: 'Produktives', icon: 'fa-firefox', visible: true, order: 13 },
        { id: 'chrome', name: 'Google Chrome', url: 'https://www.google.com/intl/de/chrome/', category: 'Produktives', icon: 'fa-chrome', visible: true, order: 14 },
        { id: 'gmail', name: 'Google Mail', url: 'https://mail.google.com/', category: 'Produktives', icon: 'fa-envelope', visible: true, order: 15 },
        { id: 'maps', name: 'Google Maps', url: 'https://maps.google.com/', category: 'Produktives', icon: 'fa-map', visible: true, order: 16 },
        { id: 'protonvpn', name: 'ProtonVPN', url: 'https://protonvpn.com/', category: 'Produktives', icon: 'fa-shield', visible: true, order: 17 },
        { id: 'protonmail', name: 'ProtonMail', url: 'https://mail.proton.me/', category: 'Produktives', icon: 'fa-lock', visible: true, order: 18 },
        { id: 'github', name: 'GitHub', url: 'https://github.com/', category: 'Produktives', icon: 'fa-github', visible: true, order: 19 },
    ];

    const DEFAULT_SETTINGS = {
        theme: 'dark',
        primaryColor: '#8B7355',
    };

    // Initialize storage if not already done
    const init = () => {
        if (!isInitialized()) {
            setApps(DEFAULT_APPS);
            setSettings(DEFAULT_SETTINGS);
            setInitialized(true);
        } else {
            // Ensure all apps have the 'visible' property
            const apps = getApps();
            let needsUpdate = false;

            apps.forEach(app => {
                if (!app.hasOwnProperty('visible')) {
                    app.visible = true;
                    needsUpdate = true;
                }
            });

            if (needsUpdate) {
                setApps(apps);
            }
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

    // Get only visible apps (max 20, sorted by order)
    const getVisibleApps = () => {
        const apps = getApps();
        return apps
            .filter(app => app.visible)
            .sort((a, b) => a.order - b.order)
            .slice(0, MAX_VISIBLE_APPS);
    };

    // Get all apps including hidden ones
    const getAllApps = () => {
        const apps = getApps();
        return apps.sort((a, b) => {
            if (a.visible === b.visible) {
                return a.order - b.order;
            }
            return a.visible ? -1 : 1;
        });
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

        const newApp = {
            id: generateId(),
            ...appData,
            visible: false, // New apps are hidden by default
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
        const appToDuplicate = apps.find(app => app.id === appId);

        if (!appToDuplicate) {
            throw new Error('App not found');
        }

        const newApp = {
            ...appToDuplicate,
            id: generateId(),
            visible: false, // Duplicated apps are hidden by default
            order: apps.length,
            dateAdded: new Date().toISOString(),
        };

        apps.push(newApp);
        setApps(apps);
        return newApp;
    };

    // Toggle app visibility
    const toggleAppVisibility = (appId, visible) => {
        const apps = getApps();
        const app = apps.find(a => a.id === appId);

        if (!app) throw new Error('App not found');

        // Check if we're trying to show more than MAX_VISIBLE_APPS
        if (visible) {
            const visibleCount = apps.filter(a => a.visible).length;
            if (visibleCount >= MAX_VISIBLE_APPS) {
                throw new Error(`Maximum ${MAX_VISIBLE_APPS} apps can be visible`);
            }
        }

        app.visible = visible;
        setApps(apps);
        return app;
    };

    // Set visible apps (array of app IDs)
    const setVisibleApps = (appIds) => {
        // Enforce STRICT limit: take first 20 if more are provided
        const finalAppIds = appIds.slice(0, MAX_VISIBLE_APPS);

        const apps = getApps();
        const visibleIdSet = new Set(finalAppIds);

        apps.forEach((app) => {
            app.visible = visibleIdSet.has(app.id);
            if (app.visible) {
                app.order = finalAppIds.indexOf(app.id);
            }
        });

        setApps(apps);
    };

    // Update app order (only for visible apps)
    const updateAppOrder = (orderedAppIds) => {
        const apps = getApps();
        const appsMap = new Map(apps.map(app => [app.id, app]));

        // Update order for visible apps
        orderedAppIds.forEach((id, index) => {
            const app = appsMap.get(id);
            if (app && app.visible) {
                app.order = index;
            }
        });

        setApps(apps);
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
        getVisibleApps,
        getAllApps,
        setApps,
        addApp,
        updateApp,
        deleteApp,
        duplicateApp,
        toggleAppVisibility,
        setVisibleApps,
        updateAppOrder,
        getSettings,
        setSettings,
        updateSetting,
        exportData,
        importData,
        reset,
        MAX_VISIBLE_APPS,
    };
})();

// Initialize storage on page load
Storage.init();
