const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Load IconDetector from js/icon-detector.js
const code = fs.readFileSync(path.join(__dirname, '../js/icon-detector.js'), 'utf8');

// In Node.js vm, top-level const/let/class are not attached to the context object.
// We'll wrap the code in a function and return the IconDetector
const wrappedCode = `(function() { ${code}; return IconDetector; })()`;
const IconDetector = vm.runInNewContext(wrappedCode);

test('IconDetector.getIcon', async (t) => {
    await t.test('Exact match (case-insensitive)', () => {
        assert.strictEqual(IconDetector.getIcon('whatsapp'), 'fa-brands fa-whatsapp');
        assert.strictEqual(IconDetector.getIcon('WhatsApp'), 'fa-brands fa-whatsapp');
        assert.strictEqual(IconDetector.getIcon('GMAIL'), 'fa-solid fa-envelope');
    });

    await t.test('Partial match (app name in key)', () => {
        // 'github' includes 'git'
        assert.strictEqual(IconDetector.getIcon('git'), 'fa-brands fa-github');
    });

    await t.test('Partial match (key in app name)', () => {
        // 'google drive personal' includes 'google drive'
        assert.strictEqual(IconDetector.getIcon('google drive personal'), 'fa-brands fa-google-drive');
    });

    await t.test('Word-by-word match', () => {
        // 'My Word Document' -> ['my', 'word', 'document']. 'word' is a key.
        assert.strictEqual(IconDetector.getIcon('My Word Document'), 'fa-solid fa-file-word');
        // 'Some-Excel-Sheet' -> ['some', 'excel', 'sheet']. 'excel' is a key.
        assert.strictEqual(IconDetector.getIcon('Some-Excel-Sheet'), 'fa-solid fa-file-excel');
    });

    await t.test('Default fallback', () => {
        assert.strictEqual(IconDetector.getIcon('Unknown App Name'), 'fa-solid fa-globe');
    });
});

test('IconDetector.detectAndUpdateIcon', async (t) => {
    await t.test('Updates app with no icon', () => {
        const app = { name: 'whatsapp' };
        const updated = IconDetector.detectAndUpdateIcon(app);
        assert.strictEqual(updated.icon, 'fa-brands fa-whatsapp');
    });

    await t.test('Updates app with empty icon string', () => {
        const app = { name: 'whatsapp', icon: '' };
        const updated = IconDetector.detectAndUpdateIcon(app);
        assert.strictEqual(updated.icon, 'fa-brands fa-whatsapp');
    });

    await t.test('Updates app with default icon', () => {
        const app1 = { name: 'whatsapp', icon: 'fa-globe' };
        const updated1 = IconDetector.detectAndUpdateIcon(app1);
        assert.strictEqual(updated1.icon, 'fa-brands fa-whatsapp');

        const app2 = { name: 'whatsapp', icon: 'fa-solid fa-globe' };
        const updated2 = IconDetector.detectAndUpdateIcon(app2);
        assert.strictEqual(updated2.icon, 'fa-brands fa-whatsapp');
    });

    await t.test('Preserves existing custom icon', () => {
        const app = { name: 'whatsapp', icon: 'custom-icon' };
        const updated = IconDetector.detectAndUpdateIcon(app);
        assert.strictEqual(updated.icon, 'custom-icon');
    });
});
