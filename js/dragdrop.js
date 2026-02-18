/* ============================================
   Daily Oasis - Drag & Drop Implementation
   ============================================ */

const DragDrop = (() => {
    let draggedElement = null;
    let draggedAppId = null;

    // Initialize drag and drop
    const init = () => {
        const appGrid = document.getElementById('appGrid');

        appGrid.addEventListener('dragstart', handleDragStart);
        appGrid.addEventListener('dragend', handleDragEnd);
        appGrid.addEventListener('dragover', handleDragOver);
        appGrid.addEventListener('drop', handleDrop);
        appGrid.addEventListener('dragleave', handleDragLeave);

        // Touch support for mobile
        appGrid.addEventListener('touchstart', handleTouchStart, false);
        appGrid.addEventListener('touchmove', handleTouchMove, false);
        appGrid.addEventListener('touchend', handleTouchEnd, false);
    };

    // Mouse drag handlers
    const handleDragStart = (e) => {
        if (!e.target.classList.contains('app-card')) return;

        draggedElement = e.target;
        draggedAppId = e.target.getAttribute('data-app-id');

        draggedElement.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', draggedElement.innerHTML);
    };

    const handleDragEnd = (e) => {
        if (draggedElement) {
            draggedElement.classList.remove('dragging');
            draggedElement = null;
        }

        // Remove drag-over class from all cards
        document.querySelectorAll('.app-card.drag-over').forEach(card => {
            card.classList.remove('drag-over');
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (!e.target.classList.contains('app-card') || !draggedElement) return;
        if (e.target === draggedElement) return;

        e.target.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        if (e.target.classList.contains('app-card')) {
            e.target.classList.remove('drag-over');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!draggedElement || !e.target.classList.contains('app-card')) return;

        const targetCard = e.target.closest('.app-card');
        if (!targetCard || targetCard === draggedElement) return;

        // Swap positions
        const grid = document.getElementById('appGrid');
        const allCards = Array.from(grid.querySelectorAll('.app-card'));
        const draggedIndex = allCards.indexOf(draggedElement);
        const targetIndex = allCards.indexOf(targetCard);

        if (draggedIndex < targetIndex) {
            targetCard.parentNode.insertBefore(draggedElement, targetCard.nextSibling);
        } else {
            targetCard.parentNode.insertBefore(draggedElement, targetCard);
        }

        // Update storage
        updateAppOrder();

        // Remove drag-over class
        targetCard.classList.remove('drag-over');
    };

    // Touch handlers for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchElement = null;

    const handleTouchStart = (e) => {
        if (!e.target.classList.contains('app-card')) return;

        touchElement = e.target.closest('.app-card');
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;

        touchElement.classList.add('dragging');
    };

    const handleTouchMove = (e) => {
        // Prevent default scrolling to allow drag
        // This is a simple implementation - full touch support would be more complex
    };

    const handleTouchEnd = (e) => {
        if (touchElement) {
            touchElement.classList.remove('dragging');
            touchElement = null;
        }
    };

    // Update app order in storage
    const updateAppOrder = () => {
        const appGrid = document.getElementById('appGrid');
        const appCards = Array.from(appGrid.querySelectorAll('.app-card'));
        const appIds = appCards.map(card => card.getAttribute('data-app-id'));

        Storage.updateAppOrder(appIds);
    };

    return {
        init,
        updateAppOrder,
    };
})();
