/* ============================================
   Daily Oasis - Auto Icon Detection
   ============================================ */

const IconDetector = (() => {
    // Icon mapping based on app names
    const ICON_MAP = {
        // Social Media
        'whatsapp': 'fa-brands fa-whatsapp',
        'instagram': 'fa-brands fa-instagram',
        'facebook': 'fa-brands fa-facebook',
        'twitter': 'fa-brands fa-twitter',
        'snapchat': 'fa-brands fa-snapchat',
        'telegram': 'fa-brands fa-telegram',
        'signal': 'fa-solid fa-comment',
        'linkedin': 'fa-brands fa-linkedin',
        'tiktok': 'fa-brands fa-tiktok',
        'youtube': 'fa-brands fa-youtube',
        'twitch': 'fa-brands fa-twitch',
        'discord': 'fa-brands fa-discord',
        'slack': 'fa-brands fa-slack',
        'viber': 'fa-brands fa-viber',

        // Entertainment & Media
        'netflix': 'fa-solid fa-play',
        'amazon': 'fa-brands fa-amazon',
        'prime': 'fa-solid fa-play',
        'spotify': 'fa-brands fa-spotify',
        'youtube music': 'fa-solid fa-music',
        'music': 'fa-solid fa-music',
        'soundcloud': 'fa-brands fa-soundcloud',
        'apple music': 'fa-solid fa-music',
        'tidal': 'fa-solid fa-music',
        'stremio': 'fa-solid fa-tv',
        'plex': 'fa-solid fa-tv',
        'kodi': 'fa-solid fa-tv',
        'hulu': 'fa-solid fa-play',
        'disney': 'fa-solid fa-play',

        // Productivity & Work
        'gmail': 'fa-solid fa-envelope',
        'mail': 'fa-solid fa-envelope',
        'outlook': 'fa-solid fa-envelope',
        'protonmail': 'fa-solid fa-lock',
        'thunderbird': 'fa-solid fa-envelope',
        'teams': 'fa-brands fa-microsoft',
        'zoom': 'fa-solid fa-video',
        'jitsi': 'fa-solid fa-video',
        'skype': 'fa-brands fa-skype',
        'google drive': 'fa-brands fa-google-drive',
        'dropbox': 'fa-brands fa-dropbox',
        'onedrive': 'fa-solid fa-cloud',
        'icloud': 'fa-solid fa-cloud',
        'notion': 'fa-solid fa-database',
        'trello': 'fa-brands fa-trello',
        'asana': 'fa-solid fa-tasks',
        'jira': 'fa-brands fa-jira',
        'confluence': 'fa-solid fa-file',
        'github': 'fa-brands fa-github',
        'gitlab': 'fa-brands fa-gitlab',
        'bitbucket': 'fa-brands fa-bitbucket',
        'google docs': 'fa-solid fa-file-word',
        'word': 'fa-solid fa-file-word',
        'excel': 'fa-solid fa-file-excel',
        'powerpoint': 'fa-solid fa-file-powerpoint',
        'sheets': 'fa-solid fa-file-excel',
        'calendar': 'fa-solid fa-calendar',
        'google calendar': 'fa-solid fa-calendar',
        'todoist': 'fa-solid fa-check',
        'things': 'fa-solid fa-check',
        'reminders': 'fa-solid fa-bell',

        // AI & Tools
        'claude': 'fa-solid fa-brain',
        'chatgpt': 'fa-solid fa-comment',
        'gemini': 'fa-solid fa-sparkles',
        'copilot': 'fa-solid fa-robot',
        'bard': 'fa-solid fa-sparkles',
        'llama': 'fa-solid fa-brain',
        'ollama': 'fa-solid fa-brain',
        'stable diffusion': 'fa-solid fa-image',
        'midjourney': 'fa-solid fa-image',
        'dall-e': 'fa-solid fa-image',
        'photoshop': 'fa-solid fa-image',
        'figma': 'fa-brands fa-figma',
        'sketch': 'fa-brands fa-sketch',
        'canva': 'fa-solid fa-palette',
        'ai studio': 'fa-solid fa-flask',
        'notebooklm': 'fa-solid fa-book',
        'perplexity': 'fa-solid fa-search',
        'you.com': 'fa-solid fa-search',

        // Development
        'vscode': 'fa-solid fa-code',
        'visual studio': 'fa-solid fa-code',
        'sublime': 'fa-solid fa-code',
        'atom': 'fa-solid fa-code',
        'jetbrains': 'fa-solid fa-code',
        'terminal': 'fa-solid fa-terminal',
        'iterm': 'fa-solid fa-terminal',
        'hyper': 'fa-solid fa-terminal',

        // Browsers
        'chrome': 'fa-brands fa-chrome',
        'firefox': 'fa-brands fa-firefox',
        'safari': 'fa-brands fa-safari',
        'edge': 'fa-brands fa-edge',
        'brave': 'fa-solid fa-shield-halved',
        'opera': 'fa-brands fa-opera',

        // VPN & Security
        'vpn': 'fa-solid fa-shield-halved',
        'protonvpn': 'fa-solid fa-shield-halved',
        'nordvpn': 'fa-solid fa-shield-halved',
        'expressvpn': 'fa-solid fa-shield-halved',
        '1password': 'fa-solid fa-lock',
        'bitwarden': 'fa-solid fa-lock',
        'lastpass': 'fa-solid fa-lock',
        'keeper': 'fa-solid fa-lock',

        // Maps & Navigation
        'maps': 'fa-solid fa-map',
        'google maps': 'fa-solid fa-map',
        'apple maps': 'fa-solid fa-map',
        'waze': 'fa-brands fa-waze',
        'citymapper': 'fa-solid fa-map',

        // Utilities
        'calculator': 'fa-solid fa-calculator',
        'weather': 'fa-solid fa-cloud-sun',
        'clock': 'fa-solid fa-clock',
        'timer': 'fa-solid fa-hourglass',
        'photos': 'fa-solid fa-image',
        'gallery': 'fa-solid fa-image',
        'files': 'fa-solid fa-folder',
        'document': 'fa-solid fa-file',
        'pdf': 'fa-solid fa-file-pdf',
        'reader': 'fa-solid fa-book',

        // Shopping & Finance
        'amazon': 'fa-brands fa-amazon',
        'ebay': 'fa-brands fa-ebay',
        'paypal': 'fa-brands fa-paypal',
        'stripe': 'fa-brands fa-stripe',
        'bank': 'fa-solid fa-university',
        'wallet': 'fa-solid fa-wallet',
        'crypto': 'fa-brands fa-bitcoin',
        'trading': 'fa-solid fa-chart-line',
    };

    // Pre-compute entries for performance
    const ICON_ENTRIES = Object.entries(ICON_MAP);

    // Get icon for app
    const getIcon = (appName) => {
        const nameLower = appName.toLowerCase();

        // Exact match first
        if (ICON_MAP[nameLower]) {
            return ICON_MAP[nameLower];
        }

        // Try to find a match in the name
        for (const [key, icon] of ICON_ENTRIES) {
            if (nameLower.includes(key) || key.includes(nameLower)) {
                return icon;
            }
        }

        // Extract first meaningful word
        const words = nameLower.split(/[\s\-_()]/);
        for (const word of words) {
            if (word.length > 2 && ICON_MAP[word]) {
                return ICON_MAP[word];
            }
        }

        // Default icon
        return 'fa-solid fa-globe';
    };

    // Detect icon and update app
    const detectAndUpdateIcon = (app) => {
        if (!app.icon || app.icon === '' || app.icon === 'fa-globe' || app.icon === 'fa-solid fa-globe') {
            app.icon = getIcon(app.name);
        }
        return app;
    };

    return {
        getIcon,
        detectAndUpdateIcon,
        ICON_MAP,
    };
})();
