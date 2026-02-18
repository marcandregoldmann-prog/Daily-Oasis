/* ============================================
   Daily Oasis - Auto Icon Detection
   ============================================ */

const IconDetector = (() => {
    // Icon mapping based on app names
    const ICON_MAP = {
        // Social Media
        'whatsapp': 'fa-whatsapp',
        'instagram': 'fa-instagram',
        'facebook': 'fa-facebook',
        'twitter': 'fa-twitter',
        'snapchat': 'fa-snapchat',
        'telegram': 'fa-telegram',
        'signal': 'fa-comment',
        'linkedin': 'fa-linkedin',
        'tiktok': 'fa-tiktok',
        'youtube': 'fa-youtube',
        'twitch': 'fa-twitch',
        'discord': 'fa-discord',
        'slack': 'fa-slack',
        'viber': 'fa-phone',

        // Entertainment & Media
        'netflix': 'fa-play',
        'amazon': 'fa-amazon',
        'prime': 'fa-play',
        'spotify': 'fa-spotify',
        'youtube music': 'fa-music',
        'music': 'fa-music',
        'soundcloud': 'fa-cloud',
        'apple music': 'fa-music',
        'tidal': 'fa-music',
        'stremio': 'fa-tv',
        'plex': 'fa-tv',
        'kodi': 'fa-tv',
        'hulu': 'fa-play',
        'disney': 'fa-play',

        // Productivity & Work
        'gmail': 'fa-envelope',
        'mail': 'fa-envelope',
        'outlook': 'fa-envelope',
        'protonmail': 'fa-envelope',
        'thunderbird': 'fa-envelope',
        'slack': 'fa-slack',
        'teams': 'fa-microsoft',
        'zoom': 'fa-video',
        'jitsi': 'fa-video',
        'skype': 'fa-skype',
        'whatsapp': 'fa-whatsapp',
        'google drive': 'fa-cloud',
        'dropbox': 'fa-dropbox',
        'onedrive': 'fa-cloud',
        'icloud': 'fa-cloud',
        'notion': 'fa-database',
        'trello': 'fa-tasks',
        'asana': 'fa-tasks',
        'jira': 'fa-tasks',
        'confluence': 'fa-file',
        'github': 'fa-github',
        'gitlab': 'fa-gitlab',
        'bitbucket': 'fa-bitbucket',
        'google docs': 'fa-file-word',
        'word': 'fa-file-word',
        'excel': 'fa-file-excel',
        'powerpoint': 'fa-file-powerpoint',
        'sheets': 'fa-file-excel',
        'calendar': 'fa-calendar',
        'google calendar': 'fa-calendar',
        'todoist': 'fa-check',
        'things': 'fa-check',
        'reminders': 'fa-bell',

        // AI & Tools
        'claude': 'fa-brain',
        'chatgpt': 'fa-comments',
        'gemini': 'fa-sparkles',
        'copilot': 'fa-bot',
        'bard': 'fa-sparkles',
        'llama': 'fa-brain',
        'ollama': 'fa-brain',
        'stable diffusion': 'fa-image',
        'midjourney': 'fa-image',
        'dall-e': 'fa-image',
        'photoshop': 'fa-image',
        'figma': 'fa-pencil-ruler',
        'sketch': 'fa-pencil-ruler',
        'canva': 'fa-palette',
        'ai studio': 'fa-flask',
        'notebooklm': 'fa-notebook',
        'perplexity': 'fa-search',
        'you.com': 'fa-search',

        // Development
        'vscode': 'fa-code',
        'visual studio': 'fa-code',
        'sublime': 'fa-code',
        'atom': 'fa-code',
        'jetbrains': 'fa-code',
        'terminal': 'fa-terminal',
        'iterm': 'fa-terminal',
        'hyper': 'fa-terminal',

        // Browsers
        'chrome': 'fa-chrome',
        'firefox': 'fa-firefox',
        'safari': 'fa-safari',
        'edge': 'fa-edge',
        'brave': 'fa-shield',
        'opera': 'fa-opera',

        // VPN & Security
        'vpn': 'fa-shield',
        'protonvpn': 'fa-shield',
        'nordvpn': 'fa-shield',
        'expressvpn': 'fa-shield',
        '1password': 'fa-lock',
        'bitwarden': 'fa-lock',
        'lastpass': 'fa-lock',
        'keeper': 'fa-lock',

        // Maps & Navigation
        'maps': 'fa-map',
        'google maps': 'fa-map',
        'apple maps': 'fa-map',
        'waze': 'fa-map',
        'citymapper': 'fa-map',

        // Utilities
        'calculator': 'fa-calculator',
        'weather': 'fa-cloud-sun',
        'clock': 'fa-clock',
        'timer': 'fa-hourglass',
        'photos': 'fa-image',
        'gallery': 'fa-image',
        'files': 'fa-folder',
        'document': 'fa-file',
        'pdf': 'fa-file-pdf',
        'reader': 'fa-book',

        // Shopping & Finance
        'amazon': 'fa-shopping-bag',
        'ebay': 'fa-gavel',
        'paypal': 'fa-paypal',
        'stripe': 'fa-credit-card',
        'bank': 'fa-university',
        'wallet': 'fa-wallet',
        'crypto': 'fa-bitcoin',
        'trading': 'fa-chart-line',
    };

    // Get icon for app
    const getIcon = (appName) => {
        const nameLower = appName.toLowerCase();

        // Exact match first
        if (ICON_MAP[nameLower]) {
            return ICON_MAP[nameLower];
        }

        // Try to find a match in the name
        for (const [key, icon] of Object.entries(ICON_MAP)) {
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
        return 'fa-globe';
    };

    // Detect icon and update app
    const detectAndUpdateIcon = (app) => {
        if (!app.icon || app.icon === '' || app.icon === 'fa-globe') {
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
