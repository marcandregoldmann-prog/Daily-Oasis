const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const code = fs.readFileSync(path.resolve(__dirname, '../js/storage.js'), 'utf8');

/**
 * Creates a mock localStorage object.
 */
function createStorageMock() {
    const storageData = {};
    return {
        getItem: (key) => storageData.hasOwnProperty(key) ? storageData[key] : null,
        setItem: (key, value) => { storageData[key] = String(value); },
        removeItem: (key) => { delete storageData[key]; },
        clear: () => { for (let key in storageData) delete storageData[key]; },
        length: 0 // Minimal mock
    };
}

/**
 * Creates a fresh Storage instance in a new VM context.
 */
function getStorageInstance() {
    const localStorageMock = createStorageMock();
    const context = {
        localStorage: localStorageMock,
        console: {
            error: () => {}, // Mock console.error to keep test output clean
            log: () => {}
        },
        Date: Date,
        Math: Math,
        Set: Set,
        Map: Map,
        JSON: JSON,
        Array: Array,
        Object: Object,
        Error: Error,
        SyntaxError: SyntaxError,
        setTimeout: setTimeout,
        clearTimeout: clearTimeout,
        String: String
    };
    vm.createContext(context);
    // Wrap the code to return Storage
    const wrappedCode = `(function() { ${code}; return Storage; })()`;
    const Storage = vm.runInContext(wrappedCode, context);
    return { Storage, localStorage: localStorageMock };
}

test('Storage.importData', async (t) => {
    await t.test('Happy path: Valid JSON with apps and settings', () => {
        const { Storage, localStorage } = getStorageInstance();
        const data = {
            apps: [{ id: 'test-app', name: 'Test App', url: 'https://test.com', category: 'Test', icon: 'fa-test', visible: true, order: 0 }],
            settings: { theme: 'light', primaryColor: '#000000' }
        };
        const jsonString = JSON.stringify(data);

        const result = Storage.importData(jsonString);

        assert.strictEqual(result, true);
        assert.deepStrictEqual(JSON.parse(localStorage.getItem('dailyOasis_apps')), data.apps);
        assert.deepStrictEqual(JSON.parse(localStorage.getItem('dailyOasis_settings')), data.settings);
    });

    await t.test('Happy path: Valid JSON with only apps', () => {
        const { Storage, localStorage } = getStorageInstance();

        // Initialize first to have default settings
        Storage.init();

        const data = {
            apps: [{ id: 'test-app', name: 'Test App', url: 'https://test.com', category: 'Test', icon: 'fa-test', visible: true, order: 0 }]
        };
        const jsonString = JSON.stringify(data);

        const result = Storage.importData(jsonString);

        assert.strictEqual(result, true);
        assert.deepStrictEqual(JSON.parse(localStorage.getItem('dailyOasis_apps')), data.apps);
        // settings should remain as they were after init (DEFAULT_SETTINGS)
        const settings = JSON.parse(localStorage.getItem('dailyOasis_settings'));
        assert.strictEqual(settings.theme, 'dark'); // Default theme
    });

    await t.test('Error path: Invalid JSON string', () => {
        const { Storage } = getStorageInstance();
        const invalidJson = '{ invalid: json }';

        assert.throws(() => {
            Storage.importData(invalidJson);
        }, SyntaxError);
    });

    await t.test('Error path: Valid JSON but missing apps property', () => {
        const { Storage } = getStorageInstance();
        const data = {
            settings: { theme: 'light' }
        };
        const jsonString = JSON.stringify(data);

        assert.throws(() => {
            Storage.importData(jsonString);
        }, {
            message: 'Invalid apps data'
        });
    });

    await t.test('Error path: Valid JSON but apps property is not an array', () => {
        const { Storage } = getStorageInstance();
        const data = {
            apps: { not: 'an array' }
        };
        const jsonString = JSON.stringify(data);

        assert.throws(() => {
            Storage.importData(jsonString);
        }, {
            message: 'Invalid apps data'
        });
    });
});
