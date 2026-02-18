/* ============================================
   Daily Oasis - Search & Filter Logic
   ============================================ */

const Search = (() => {
    let currentFilter = 'all';
    let searchQuery = '';

    // Initialize search
    const init = () => {
        const searchInput = document.getElementById('searchInput');
        const searchToggleBtn = document.getElementById('searchToggleBtn');
        const searchCloseBtn = document.getElementById('searchCloseBtn');
        const searchBarExpanded = document.getElementById('searchBarExpanded');
        const filterBtns = document.querySelectorAll('.filter-btn');

        // Search toggle button
        searchToggleBtn.addEventListener('click', () => {
            searchBarExpanded.classList.toggle('active');
            if (searchBarExpanded.classList.contains('active')) {
                searchInput.focus();
            }
        });

        // Close search button
        searchCloseBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            searchBarExpanded.classList.remove('active');
            performSearch();
        });

        // Search input listener
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            performSearch();
        });

        // Close search when pressing Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchBarExpanded.classList.remove('active');
            }
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

    // Perform search and filter
    const performSearch = () => {
        const visibleApps = Storage.getVisibleApps();
        let filteredApps = visibleApps;

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
        updateAppCounter(filteredApps.length, visibleApps.length);
    };

    // Update app counter
    const updateAppCounter = (current, total) => {
        const visibleCount = document.getElementById('visibleCount');
        const totalCount = document.getElementById('totalCount');

        visibleCount.textContent = current;
        totalCount.textContent = total;
    };

    // Reset filters
    const resetFilters = () => {
        searchQuery = '';
        currentFilter = 'all';
        const searchInput = document.getElementById('searchInput');
        const searchBarExpanded = document.getElementById('searchBarExpanded');
        searchInput.value = '';
        searchBarExpanded.classList.remove('active');
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === 'all') {
                btn.classList.add('active');
            }
        });
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
