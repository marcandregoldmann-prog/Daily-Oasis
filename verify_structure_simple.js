const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('css/styles.css', 'utf8');

console.log('Verifying HTML Structure via String Analysis...');

if (html.includes('id="appGrid"')) {
    console.log('✅ App Grid exists');
} else {
    console.error('❌ App Grid missing');
}

if (html.includes('class="floating-header"')) {
    console.log('✅ Floating Header exists');
} else {
    console.error('❌ Floating Header missing');
}

if (html.includes('id="categoryModal"')) {
    console.log('✅ Category Modal exists');
} else {
    console.error('❌ Category Modal missing');
}

if (!html.includes('Daily Oasis - App Launcher') && !html.includes('<span class="palm-emoji">🌴</span>')) {
     console.log('✅ Title removed (string check)');
} else {
    // Title is in <title> tag, check body
    if (!html.includes('<h1 class="title">')) {
         console.log('✅ Title H1 removed');
    } else {
         console.error('❌ Title H1 still present');
    }
}

if (!html.includes('class="app-counter"')) {
    console.log('✅ Counter removed');
} else {
    console.error('❌ Counter still present');
}

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
