/* ============================================
   Daily Oasis - Search & Filter Logic
   ============================================ */

const Search = (() => {
    let currentFilter = 'all';
    let searchQuery = '';

    // Initialize search
    const init = () => {
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');
        const filterBtns = document.querySelectorAll('.filter-btn');

        // Search input listener
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            updateSearchClear();
            performSearch();
        });

        // Clear search button
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            updateSearchClear();
            performSearch();
        });

        // Filter button listeners
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-category');
                performSearch();
            });
        });
    };

    // Update search clear button visibility
    const updateSearchClear = () => {
        const searchClear = document.getElementById('searchClear');
        if (searchQuery.length > 0) {
            searchClear.classList.add('visible');
        } else {
            searchClear.classList.remove('visible');
        }
    };

    // Perform search and filter
    const performSearch = () => {
        const apps = Storage.getApps();
        let filteredApps = apps;

        // Apply category filter
        if (currentFilter !== 'all') {
            filteredApps = filteredApps.filter(app =>
                app.category === currentFilter
            );
        }

        // Apply search filter
        if (searchQuery.length > 0) {
            filteredApps = filteredApps.filter(app => {
                const searchFields = [
                    app.name,
                    app.url,
                    app.category,
                ].join(' ').toLowerCase();

                return searchFields.includes(searchQuery);
            });
        }

        // Update UI
        UI.updateAppGrid(filteredApps);
        updateAppCounter(filteredApps.length, apps.length);
    };

    // Update app counter
    const updateAppCounter = (current, total) => {
        const counter = document.getElementById('appCount');
        if (current < total) {
            counter.textContent = current;
            document.querySelector('.app-counter').style.display = 'block';
        } else {
            counter.textContent = total;
        }
    };

    // Reset filters
    const resetFilters = () => {
        searchQuery = '';
        currentFilter = 'all';
        document.getElementById('searchInput').value = '';
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === 'all') {
                btn.classList.add('active');
            }
        });
        updateSearchClear();
        performSearch();
    };

    return {
        init,
        performSearch,
        resetFilters,
        getCurrentFilter: () => currentFilter,
        getSearchQuery: () => searchQuery,
    };
})();
