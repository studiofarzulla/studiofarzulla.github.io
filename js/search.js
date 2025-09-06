// Search Functionality
(function() {
    'use strict';

    // Content database for searching
    const contentDatabase = [
        // Poetry
        {
            title: 'Digital Echoes',
            type: 'poetry',
            url: 'poetry.html#digital-echoes',
            content: 'Contemporary verses exploring technology and human connection',
            tags: ['poetry', 'technology', 'digital', 'contemporary']
        },
        {
            title: 'Urban Shadows',
            type: 'poetry',
            url: 'poetry.html#urban-shadows',
            content: 'Reflections on modern city life and isolation',
            tags: ['poetry', 'urban', 'city', 'modern']
        },
        {
            title: 'Code & Consciousness',
            type: 'poetry',
            url: 'poetry.html#code-consciousness',
            content: 'Where programming meets philosophy',
            tags: ['poetry', 'code', 'philosophy', 'technology']
        },
        
        // Essays
        {
            title: 'The Algorithmic Mind',
            type: 'essay',
            url: 'essays.html#algorithmic-mind',
            content: 'Exploring how algorithms shape modern thought',
            tags: ['essay', 'algorithms', 'philosophy', 'technology']
        },
        {
            title: 'Ethics in Digital Spaces',
            type: 'essay',
            url: 'essays.html#digital-ethics',
            content: 'Moral considerations in virtual environments',
            tags: ['essay', 'ethics', 'digital', 'philosophy']
        },
        {
            title: 'Financial Systems & Society',
            type: 'essay',
            url: 'essays.html#financial-systems',
            content: 'Critical analysis of modern economic structures',
            tags: ['essay', 'finance', 'economics', 'society']
        },
        
        // Projects
        {
            title: 'Particle System Visualization',
            type: 'project',
            url: 'projects.html#particle-system',
            content: 'Interactive canvas-based particle animation',
            tags: ['project', 'javascript', 'canvas', 'animation']
        },
        {
            title: 'Theme Switcher Implementation',
            type: 'project',
            url: 'projects.html#theme-switcher',
            content: 'Dynamic CSS theme switching system',
            tags: ['project', 'css', 'javascript', 'ui']
        },
        
        // Research
        {
            title: 'Anti-Money Laundering Efficacies',
            type: 'research',
            url: 'research.html#aml',
            content: 'Analysis of AML frameworks in modern finance',
            tags: ['research', 'finance', 'aml', 'regulation']
        },
        {
            title: 'Digital Privacy Concerns',
            type: 'research',
            url: 'research.html#privacy',
            content: 'Investigation into data privacy in the digital age',
            tags: ['research', 'privacy', 'digital', 'security']
        }
    ];

    // Fuzzy search function
    function fuzzySearch(query, text) {
        query = query.toLowerCase();
        text = text.toLowerCase();
        
        // Direct match
        if (text.includes(query)) return true;
        
        // Word match
        const queryWords = query.split(' ');
        return queryWords.every(word => text.includes(word));
    }

    // Perform search
    window.performSearch = function() {
        const input = document.getElementById('searchInput');
        const resultsContainer = document.getElementById('searchResults');
        const query = input.value.trim();

        if (query.length < 2) {
            resultsContainer.classList.remove('active');
            return;
        }

        const results = contentDatabase.filter(item => {
            const searchText = `${item.title} ${item.content} ${item.tags.join(' ')}`;
            return fuzzySearch(query, searchText);
        });

        displayResults(results, resultsContainer, query);
    };

    // Display search results
    function displayResults(results, container, query) {
        container.innerHTML = '';

        if (results.length === 0) {
            container.innerHTML = `
                <div class="search-result-item">
                    <p>No results found for "${query}"</p>
                </div>
            `;
        } else {
            results.forEach(result => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.innerHTML = `
                    <strong>${result.title}</strong>
                    <small style="display: block; color: #6b7280; margin-top: 4px;">
                        ${result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                    </small>
                    <p style="margin-top: 8px; font-size: 0.9rem;">${result.content}</p>
                `;
                item.onclick = () => {
                    window.location.href = result.url;
                };
                container.appendChild(item);
            });
        }

        container.classList.add('active');
    }

    // Initialize search
    document.addEventListener('DOMContentLoaded', function() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            // Real-time search as user types
            searchInput.addEventListener('input', debounce(performSearch, 300));

            // Handle Enter key
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });

            // Close results when clicking outside
            document.addEventListener('click', function(e) {
                const searchContainer = document.querySelector('.search-container');
                if (searchContainer && !searchContainer.contains(e.target)) {
                    const resultsContainer = document.getElementById('searchResults');
                    if (resultsContainer) {
                        resultsContainer.classList.remove('active');
                    }
                }
            });

            // Keyboard shortcut (Ctrl/Cmd + K)
            document.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    searchInput.focus();
                }
            });
        }
    });

    // Debounce helper
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

})();