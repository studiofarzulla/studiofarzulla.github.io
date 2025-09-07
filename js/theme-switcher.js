// Theme Switcher System
(function() {
    'use strict';

    // Available themes
    const themes = {
        professional: {
            css: 'css/main.css',
            class: 'professional',
            name: 'Professional'
        },
        dystopia: {
            css: 'css/dystopia.css',
            class: 'dystopia',
            name: 'Dystopia'
        },
        baroque: {
            css: 'css/baroque.css',
            class: 'baroque',
            name: 'Baroque'
        }
    };

    // Get saved theme or default to professional
    function getSavedTheme() {
        return localStorage.getItem('selectedTheme') || 'professional';
    }

    // Save theme preference
    function saveTheme(themeName) {
        localStorage.setItem('selectedTheme', themeName);
    }

    // Apply theme
    function applyTheme(themeName) {
        const theme = themes[themeName];
        if (!theme) return;

        // Remove all theme classes
        Object.values(themes).forEach(t => {
            document.body.classList.remove(t.class);
        });

        // Add new theme class
        document.body.classList.add(theme.class);

        // Update or create theme stylesheet link
        let themeLink = document.getElementById('theme-stylesheet');
        if (!themeLink) {
            themeLink = document.createElement('link');
            themeLink.id = 'theme-stylesheet';
            themeLink.rel = 'stylesheet';
            document.head.appendChild(themeLink);
        }
        
        // Smooth transition
        document.body.style.opacity = '0.9';
        setTimeout(() => {
            themeLink.href = theme.css;
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        }, 100);

        // Update active button
        document.querySelectorAll('.theme-switcher button').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`.theme-${themeName}-btn`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Save preference
        saveTheme(themeName);
    }

    // Global function for theme switching
    window.setTheme = function(themeName) {
        applyTheme(themeName);
    };

    // Initialize theme on page load
    document.addEventListener('DOMContentLoaded', function() {
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);

        // Add keyboard shortcut for theme switching
        document.addEventListener('keydown', function(e) {
            // Alt + T to cycle through themes
            if (e.altKey && e.key === 't') {
                const themeNames = Object.keys(themes);
                const currentTheme = getSavedTheme();
                const currentIndex = themeNames.indexOf(currentTheme);
                const nextIndex = (currentIndex + 1) % themeNames.length;
                applyTheme(themeNames[nextIndex]);
            }
        });
    });

    // Add transition styles
    const style = document.createElement('style');
    style.textContent = `
        body {
            transition: opacity 0.3s ease;
        }
        .theme-switcher button.active {
            box-shadow: 0 0 0 2px currentColor;
        }
    `;
    document.head.appendChild(style);

})();