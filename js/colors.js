/* ============================================
   Daily Oasis - Color System & Selection
   ============================================ */

const Colors = (() => {
    const COLORS = [
        '#8B7355', // Warmes Taupe
        '#6B8E7F', // Gedämpftes Sage Green
        '#7A6B8F', // Soft Lavender
        '#8B7E6B', // Greyish Brown
        '#6B8B8F', // Dusty Teal
        '#8F7B6B', // Warm Taupe
        '#7B7B8F', // Muted Periwinkle
        '#6B8B7E', // Soft Moss Green
        '#8B7B6B', // Neutral Beige-Brown
        '#7B8B6B', // Muted Sage
    ];

    let selectedColor = null;

    // Initialize color system
    const init = () => {
        const settings = Storage.getSettings();
        setColor(settings.primaryColor);

        // Show color modal if first time
        if (!Storage.isInitialized() || !Storage.getSettings().primaryColor) {
            showColorModal();
        }
    };

    // Set the primary color
    const setColor = (color) => {
        if (!COLORS.includes(color)) {
            color = COLORS[0];
        }

        selectedColor = color;
        document.documentElement.style.setProperty('--primary-color', color);
        document.documentElement.style.setProperty('--primary-color-light', hexToRgbA(color, 0.1));
        document.documentElement.style.setProperty('--primary-color-hover', hexToRgbA(color, 0.2));

        // Update meta theme color for mobile
        document.querySelector('meta[name="theme-color"]').content = color;

        // Save to storage
        Storage.updateSetting('primaryColor', color);
    };

    // Get the current color
    const getColor = () => {
        return selectedColor || COLORS[0];
    };

    // Convert hex to rgba
    const hexToRgbA = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Show color selection modal
    const showColorModal = () => {
        const colorModal = document.getElementById('colorModal');
        const colorPalette = document.getElementById('colorPalette');
        const colorConfirmBtn = document.getElementById('colorConfirmBtn');

        // Create color options
        colorPalette.innerHTML = '';
        COLORS.forEach(color => {
            const colorOption = document.createElement('button');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = color;
            colorOption.setAttribute('data-color', color);
            colorOption.setAttribute('aria-label', `Select color ${color}`);
            colorOption.type = 'button';

            if (color === getColor()) {
                colorOption.classList.add('selected');
            }

            colorOption.addEventListener('click', (e) => {
                e.preventDefault();
                selectColor(color, colorPalette);
            });

            colorPalette.appendChild(colorOption);
        });

        colorModal.classList.add('active');

        colorConfirmBtn.onclick = () => {
            colorModal.classList.remove('active');
        };
    };

    // Handle color selection
    const selectColor = (color, container) => {
        // Remove previous selection
        container.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Add selection to new color
        container.querySelector(`[data-color="${color}"]`).classList.add('selected');

        // Update color
        setColor(color);
    };

    // Show color change modal (from settings)
    const showChangeColorModal = () => {
        showColorModal();
    };

    return {
        init,
        setColor,
        getColor,
        getColors: () => [...COLORS],
        showColorModal,
        showChangeColorModal,
    };
})();
