/**
 * Utility functions for the Ping Pong Tracker application
 */

const Utils = {
    /**
     * Generate a unique ID
     * @returns {string} A unique ID
     */
    generateId: function() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },

    /**
     * Format a date into a readable string
     * @param {Date|string} date - The date to format
     * @param {boolean} includeTime - Whether to include the time
     * @returns {string} The formatted date string
     */
    formatDate: function(date, includeTime = false) {
        const d = new Date(date);
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        };
        
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        
        return d.toLocaleDateString('en-US', options);
    },

    /**
     * Check if a date is today
     * @param {Date|string} date - The date to check
     * @returns {boolean} Whether the date is today
     */
    isToday: function(date) {
        const d = new Date(date);
        const today = new Date();
        return d.getDate() === today.getDate() && 
               d.getMonth() === today.getMonth() && 
               d.getFullYear() === today.getFullYear();
    },

    /**
     * Check if a date is within the current week
     * @param {Date|string} date - The date to check
     * @returns {boolean} Whether the date is within the current week
     */
    isThisWeek: function(date) {
        const d = new Date(date);
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        firstDayOfWeek.setHours(0, 0, 0, 0);
        
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
        lastDayOfWeek.setHours(23, 59, 59, 999);
        
        return d >= firstDayOfWeek && d <= lastDayOfWeek;
    },

    /**
     * Check if a date is within the current month
     * @param {Date|string} date - The date to check
     * @returns {boolean} Whether the date is within the current month
     */
    isThisMonth: function(date) {
        const d = new Date(date);
        const today = new Date();
        return d.getMonth() === today.getMonth() && 
               d.getFullYear() === today.getFullYear();
    },

    /**
     * Calculate win percentage
     * @param {number} wins - Number of wins
     * @param {number} total - Total number of games
     * @returns {number} Win percentage (0-100)
     */
    calculateWinPercentage: function(wins, total) {
        if (total === 0) return 0;
        return Math.round((wins / total) * 100);
    },

    /**
     * Show an element by removing the 'hidden' class
     * @param {HTMLElement|string} element - The element or element ID to show
     */
    showElement: function(element) {
        const el = typeof element === 'string' ? document.getElementById(element) : element;
        if (el) el.classList.remove('hidden');
    },

    /**
     * Hide an element by adding the 'hidden' class
     * @param {HTMLElement|string} element - The element or element ID to hide
     */
    hideElement: function(element) {
        const el = typeof element === 'string' ? document.getElementById(element) : element;
        if (el) el.classList.add('hidden');
    },

    /**
     * Toggle the visibility of an element
     * @param {HTMLElement|string} element - The element or element ID to toggle
     */
    toggleElement: function(element) {
        const el = typeof element === 'string' ? document.getElementById(element) : element;
        if (el) el.classList.toggle('hidden');
    },

    /**
     * Create an HTML element with attributes and content
     * @param {string} tag - The HTML tag name
     * @param {Object} attributes - Key-value pairs of attributes
     * @param {string|HTMLElement|Array} content - The content to append to the element
     * @returns {HTMLElement} The created element
     */
    createElement: function(tag, attributes = {}, content = null) {
        const element = document.createElement(tag);
        
        // Add attributes
        for (const [key, value] of Object.entries(attributes)) {
            if (key === 'className') {
                element.className = value;
            } else {
                element.setAttribute(key, value);
            }
        }
        
        // Add content
        if (content !== null) {
            if (typeof content === 'string') {
                element.textContent = content;
            } else if (content instanceof HTMLElement) {
                element.appendChild(content);
            } else if (Array.isArray(content)) {
                content.forEach(item => {
                    if (typeof item === 'string') {
                        element.appendChild(document.createTextNode(item));
                    } else if (item instanceof HTMLElement) {
                        element.appendChild(item);
                    }
                });
            }
        }
        
        return element;
    },

    /**
     * Clear all child elements from a parent element
     * @param {HTMLElement|string} element - The element or element ID to clear
     */
    clearElement: function(element) {
        const el = typeof element === 'string' ? document.getElementById(element) : element;
        if (el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        }
    }
};
