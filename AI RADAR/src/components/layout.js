
import { el, icon } from '../utils/dom.js';

// --- Bottom Navigation ---
export function renderBottomNav(navigate, currentPath) {
    const items = [
        { iconName: 'home', label: 'Ana Sayfa', path: '#/' },
        { iconName: 'dollar-sign', label: 'Para', path: '#/money' }, // Was Explore
        { iconName: 'trending-up', label: 'Trendler', path: '#/trends' }, // New
        { iconName: 'lightbulb', label: 'Fikirler', path: '#/opportunities' }, // Was Ideas
        { iconName: 'user', label: 'Profil', path: '#/profile' }
    ];

    const buttons = items.map(item => {
        // Normalize check for root
        const isRoot = (currentPath === '#/' || currentPath === '' || currentPath === '#') && item.path === '#/';
        const isActive = isRoot || currentPath === item.path;

        return el('button', {
            className: `nav-item ${isActive ? 'active' : ''}`,
            onclick: () => {
                if (navigator.vibrate) navigator.vibrate(5);
                navigate(item.path);
            }
        }, [
            icon(item.iconName),
            el('span', {}, item.label)
        ]);
    });

    return el('nav', { className: 'bottom-nav' }, buttons);
}

// --- Main Layout ---
export function renderLayout(contentNode, navigate, currentPath) {
    // Bottom Nav (Hide on detail)
    const children = [
        el('main', { className: 'app-content' }, [contentNode])
    ];

    // Footer Links (Only on Home or Profile - keeping it clean)
    if (currentPath === '#/' || currentPath === '#profile') {
        children[0].appendChild(el('div', {
            style: 'text-align:center; padding: 20px 0 80px 0; font-size: 10px; color: var(--text-muted); opacity: 0.5;'
        }, [
            el('a', { href: '#privacy', style: 'color: inherit; text-decoration: none; margin: 0 10px;' }, 'Gizlilik'),
            el('span', {}, '•'),
            el('a', { href: '#terms', style: 'color: inherit; text-decoration: none; margin: 0 10px;' }, 'Koşullar'),
            el('div', { style: 'margin-top: 5px;' }, '© 2025 AI Radar')
        ]));
    }

    if (!currentPath.includes('#detail')) {
        children.push(renderBottomNav(navigate, currentPath));
    }

    return el('div', { className: 'app-layout' }, children);
}
