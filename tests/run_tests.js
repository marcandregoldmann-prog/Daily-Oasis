const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Set up JSDOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
};

// Mock other globals that might be expected
global.alert = () => {};
global.confirm = () => true;

// Load UI.js into the global context
const uiPath = path.resolve(__dirname, '../js/ui.js');
const uiCode = fs.readFileSync(uiPath, 'utf8');

// The UI module is an IIFE that assigns to a global 'UI'
const script = new vm.Script(uiCode);
const context = vm.createContext(global);
script.runInContext(context);

// Load and run the tests
const { runTests } = require('./theme.test.js');

try {
    runTests();
} catch (error) {
    console.error('Test Suite Failed!');
    console.error(error.message);
    process.exit(1);
}
