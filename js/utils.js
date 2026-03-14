/* ============================================
   Daily Oasis - Utilities
   ============================================ */

const Utils = (() => {
    /**
     * Escape HTML special characters to prevent XSS
     * @param {string} text - The text to escape
     * @returns {string} - The escaped HTML string
     */
    const escapeHtml = (text) => {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    /**
     * Simple URL validation
     * @param {string} url - The URL to validate
     * @returns {boolean} - True if the URL is valid
     */
    const isValidUrl = (url) => {
        if (!url) return false;
        const lowerUrl = url.toLowerCase();
        return lowerUrl.startsWith('http://') || lowerUrl.startsWith('https://');
    };

    return {
        escapeHtml,
        isValidUrl,
    };
})();
