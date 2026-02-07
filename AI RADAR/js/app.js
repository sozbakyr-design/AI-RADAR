
import { renderLayout } from './components/Layout.js';
import { HomePage } from './pages/Home.js';
import { MakeMoneyPage } from './pages/MakeMoney.js';
import { TrendsPage } from './pages/Trends.js';
import { IdeasPage } from './pages/BusinessIdeas.js';
import { ProfilePage } from './pages/Profile.js';
import { DetailPage } from './pages/Detail.js';

// Simple Router
const routes = {
    '/': HomePage,
    '/make-money': MakeMoneyPage,
    '/trends': TrendsPage,
    '/ideas': IdeasPage,
    '/profile': ProfilePage,
    '/detail': DetailPage
};

// State
let currentState = {
    path: '/',
};

function navigate(path) {
    // Check if path has params
    const url = new URL(path, window.location.origin);
    const routePath = url.pathname;

    currentState.path = routePath;

    // Update browser URL
    window.history.pushState({}, '', path);

    render();
    window.scrollTo(0, 0);
}

// Handle Browser Back
window.onpopstate = () => {
    currentState.path = window.location.pathname;
    render();
};

function render() {
    const app = document.getElementById('app');
    app.innerHTML = ''; // Clear

    // Handle initial root path quirks if any
    if (currentState.path === '/index.html') currentState.path = '/';

    const PageComponent = routes[currentState.path] || HomePage;

    // Pass 'navigate' to components so they can link internally
    const content = PageComponent(navigate);

    app.appendChild(renderLayout(content, navigate, currentState.path));

    // Re-initialize icons
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    currentState.path = window.location.pathname === '/index.html' ? '/' : window.location.pathname;
    render();
});
