/* ============================================
   Daily Oasis - Shared Utilities
   ============================================ */

const Utils = (() => {
    /**
     * Escape HTML special characters to prevent XSS.
     * @param {string} text - The text to escape.
     * @returns {string} - The escaped HTML string.
     */
    const escapeHtml = (text) => {
        if (typeof text !== 'string') return text;
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    /**
     * Validate if a URL is safe to open (starts with http:// or https://).
     * @param {string} url - The URL to validate.
     * @returns {boolean} - True if the URL is valid and safe.
     */
    const isValidUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        const lowerUrl = url.trim().toLowerCase();
        return lowerUrl.startsWith('http://') || lowerUrl.startsWith('https://');
    };

    return {
        escapeHtml,
        isValidUrl
    };
})();
