# 🌴 Daily Oasis - PWA App Launcher

A personal app launcher dashboard Progressive Web App (PWA) that helps you manage, search, organize, and launch all your important apps and links from one beautiful interface.

## Features

### 🎨 Personalization
- **Custom Color Palette**: Choose from 10 carefully selected matte, subtle colors to personalize your dashboard
- **Dark Mode**: Toggle between light and dark themes with persistent storage
- **Theme Persistence**: All preferences are automatically saved to your device

### 🔍 Smart Organization
- **Live Search**: Real-time search across app names, URLs, and categories
- **Category Filtering**: Filter apps by Soziales, Entertainment, KI & Tools, or Produktives
- **Drag & Drop Reordering**: Reorganize apps by dragging and dropping (works on mobile too!)
- **App Management**: Add, edit, duplicate, or delete apps (max 20)

### 📱 Responsive Design
- **Mobile First**: Optimized for phones (2-3 apps per row)
- **Tablet Support**: 4 apps per row on tablets
- **Desktop Optimized**: 5-6 apps per row on desktop
- **Touch Friendly**: Full touch support for drag and drop on mobile devices

### 🔒 Privacy & Data
- **100% Offline**: Works completely offline after first load
- **Local Storage**: All data stored locally on your device - no cloud sync
- **Data Import/Export**: Export your configuration as JSON or import from backup
- **Service Worker**: Seamless offline experience with intelligent caching

### ⚙️ PWA Features
- **Installable**: Add to home screen on any device
- **Standalone Mode**: Launches as a native app
- **App Updates**: Service Worker ensures you always have the latest version
- **Fast Loading**: Optimized performance with efficient caching strategies

## Getting Started

### Installation

1. **Via Web Browser**: Visit the app URL and bookmark it
2. **As PWA on Mobile**:
   - iOS: Open in Safari → Share → Add to Home Screen
   - Android: Open in Chrome → Menu → Install app
3. **As PWA on Desktop**:
   - Chrome/Edge: Click the install icon in the address bar
   - Firefox: Coming soon

### First Launch

1. Open the app in your browser or from home screen
2. Choose your preferred color from the palette (10 options)
3. Start customizing your dashboard!

## Default Apps (20 apps pre-loaded)

### Soziales (Social)
- WhatsApp - https://web.whatsapp.com/
- Instagram - https://www.instagram.com/
- Snapchat - https://web.snapchat.com/

### Entertainment
- YouTube - https://www.youtube.com/
- YouTube Music - https://music.youtube.com/
- StreamHub - https://streamhub.example.com/
- Stremio - https://www.stremio.com/

### KI & Tools
- Claude - https://claude.ai/
- Claude (PWA) - https://claude.ai/
- Gemini - https://gemini.google.com/
- ChatGPT - https://chatgpt.com/
- Google AI Studio - https://aistudio.google.com/
- NotebookLM - https://notebooklm.google.com/

### Produktives (Productivity)
- Firefox - https://www.mozilla.org/firefox/
- Google Chrome - https://www.google.com/intl/de/chrome/
- Google Mail - https://mail.google.com/
- Google Maps - https://maps.google.com/
- ProtonVPN - https://protonvpn.com/
- ProtonMail - https://mail.proton.me/
- GitHub - https://github.com/

## Usage Guide

### Adding a New App

1. Click the ⚙️ Settings button (bottom right)
2. Click "Add New App"
3. Fill in:
   - App Name (e.g., "Twitter")
   - URL (e.g., "https://twitter.com/")
   - Category (choose from dropdown)
   - Icon (Font Awesome class name, e.g., "fa-twitter")
4. Click "Save App"

### Editing an App

1. Right-click (desktop) or long-press (mobile) on an app card
2. Select "Edit"
3. Modify the details
4. Click "Save App"

### Deleting an App

1. Right-click (desktop) or long-press (mobile) on an app card
2. Select "Delete"
3. Confirm deletion

### Duplicating an App

1. Right-click (desktop) or long-press (mobile) on an app card
2. Select "Duplicate"
3. Edit the new app if needed

### Searching & Filtering

- **Search**: Type in the search bar to find apps by name, URL, or category
- **Filter**: Click category buttons to show only apps in that category
- **Combine**: Search and filter work together!
- **Clear**: Click the X button or delete the search text

### Reordering Apps

- **Mouse**: Click and drag an app card to a new position
- **Touch**: Touch and drag an app card on mobile devices
- Changes are automatically saved!

### Exporting Your Data

1. Click the ⚙️ Settings button
2. Click "Export" in the Data Management section
3. Your configuration downloads as a JSON file
4. Use this file to backup or transfer your setup

### Importing Configuration

1. Click the ⚙️ Settings button
2. Click "Import" in the Data Management section
3. Select your previously exported JSON file
4. Your apps and settings are restored!

### Reset to Default

1. Click the ⚙️ Settings button
2. Click "Reset to Default" in the Reset section
3. Confirm the action
4. All apps return to the default 20-app collection

## File Structure

```
daily-oasis/
├── index.html                 # Main HTML structure
├── css/
│   ├── styles.css            # Main styles (light mode)
│   ├── dark-mode.css         # Dark mode overrides
│   └── responsive.css        # Responsive design queries
├── js/
│   ├── app.js                # Main app initialization
│   ├── storage.js            # LocalStorage management
│   ├── colors.js             # Color system & modal
│   ├── search.js             # Search & filter logic
│   ├── dragdrop.js           # Drag & drop implementation
│   ├── ui.js                 # UI rendering & updates
│   └── settings.js           # Settings & app management
├── assets/
│   ├── icon.svg              # SVG icon source
│   ├── icon-192x192.png      # PWA icon (small)
│   └── icon-512x512.png      # PWA icon (large)
├── manifest.json             # PWA manifest
├── sw.js                     # Service Worker
└── README.md                 # This file
```

## Technology Stack

- **Frontend**: Vanilla JavaScript (no frameworks)
- **Styling**: CSS3 with CSS Custom Properties
- **Storage**: LocalStorage API
- **PWA**: Service Worker, Web Manifest
- **Icons**: Font Awesome (CDN)
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)

## LocalStorage Structure

The app uses the following keys in LocalStorage:

```javascript
// Apps array
dailyOasis_apps = [
  {
    id: "unique-id",
    name: "App Name",
    url: "https://...",
    category: "Category Name",
    icon: "fa-icon-name",
    order: 0,
    dateAdded: "2025-02-18T10:30:00Z"
  }
]

// Settings object
dailyOasis_settings = {
  theme: "light" | "dark",
  primaryColor: "#8B7355"
}

// Initialization flag
dailyOasis_initialized = "true" | "false"
```

## Color Palette

The app includes 10 carefully selected matte, subtle colors:

1. `#8B7355` - Warmes Taupe
2. `#6B8E7F` - Gedämpftes Sage Green
3. `#7A6B8F` - Soft Lavender
4. `#8B7E6B` - Greyish Brown
5. `#6B8B8F` - Dusty Teal
6. `#8F7B6B` - Warm Taupe
7. `#7B7B8F` - Muted Periwinkle
8. `#6B8B7E` - Soft Moss Green
9. `#8B7B6B` - Neutral Beige-Brown
10. `#7B8B6B` - Muted Sage

## Performance & Optimization

- **Lightweight**: ~50KB total (gzipped)
- **No Dependencies**: Pure vanilla JavaScript
- **Lazy Loading**: Icons load on demand via Font Awesome CDN
- **Caching Strategy**: Network-first for app files, cache-first for assets
- **Responsive**: Optimized for all screen sizes with CSS Grid

## Accessibility

- ♿ WCAG AA compliant color contrasts
- ⌨️ Full keyboard navigation support
- 📱 Touch-friendly interface for mobile users
- 🎯 ARIA labels for all interactive elements
- 🔊 Screen reader compatible

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome/Edge | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Mobile Browsers | ✅ Full |

## Troubleshooting

### Apps not saving?
- Check if LocalStorage is enabled in your browser
- Ensure you're not in private/incognito mode
- Try clearing browser cache and reloading

### Service Worker not working?
- The app requires HTTPS (or localhost for development)
- Check DevTools → Application → Service Workers
- Try uninstalling and reinstalling the PWA

### Search not finding apps?
- Search is case-insensitive and searches app names, URLs, and categories
- Make sure the search text isn't empty
- Clear the search to see all apps

### Dark mode not persisting?
- Dark mode preference is saved automatically
- Refresh the page to confirm it's saved
- Check that you clicked the theme toggle button

## Development

### Local Development

1. Clone the repository
2. Open `index.html` in a modern browser
3. For HTTPS testing, use: `python -m http.server --bind 127.0.0.1 8000`
4. Visit `https://localhost:8000`

### Browser DevTools

- **Application Tab**: View Service Worker and LocalStorage
- **Network Tab**: Monitor caching behavior
- **Console**: Check for any errors or warnings

## License

© 2025 Daily Oasis. All rights reserved.

## Contributing

Feedback and suggestions are welcome! Please report issues or feature requests through GitHub.

## Changelog

### v1.0.0 (Initial Release)
- ✅ 20 pre-loaded apps
- ✅ 10-color customization
- ✅ Search & filter functionality
- ✅ Drag & drop reordering
- ✅ Dark mode support
- ✅ App management (add/edit/delete)
- ✅ Data export/import
- ✅ Offline support via Service Worker
- ✅ PWA installation
- ✅ Responsive design

---

**Enjoy your Daily Oasis! 🌴☀️**
