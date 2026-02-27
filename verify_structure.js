const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('css/styles.css', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

// Basic verification of structure
console.log('Verifying HTML Structure...');

const appGrid = document.getElementById('appGrid');
if (appGrid) {
    console.log('✅ App Grid exists');
} else {
    console.error('❌ App Grid missing');
}

const floatingHeader = document.querySelector('.floating-header');
if (floatingHeader) {
    console.log('✅ Floating Header exists');
} else {
    console.error('❌ Floating Header missing');
}

const categoryModal = document.getElementById('categoryModal');
if (categoryModal) {
    console.log('✅ Category Modal exists');
} else {
    console.error('❌ Category Modal missing');
}

const titleElement = document.querySelector('.title');
if (!titleElement) {
    console.log('✅ Title removed as requested');
} else {
    console.error('❌ Title still present');
}

const counterElement = document.querySelector('.app-counter');
if (!counterElement) {
    console.log('✅ Counter removed as requested');
} else {
    console.error('❌ Counter still present');
}

// Check CSS for 100vh
console.log('\nVerifying CSS...');
if (css.includes('height: 100vh') && css.includes('overflow: hidden')) {
    console.log('✅ CSS contains height: 100vh and overflow: hidden');
} else {
    console.error('❌ CSS missing critical layout properties');
}

if (css.includes('grid-template-columns: repeat(5, 1fr)')) {
     console.log('✅ Grid columns set to 5');
} else {
     console.error('❌ Grid columns incorrect');
}
