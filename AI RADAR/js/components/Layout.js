
import { renderBottomNav } from './BottomNav.js';

export function renderLayout(contentElement, navigate, currentPath) {
    const container = document.createElement('div');
    container.className = 'app-layout';

    // Main Content Area
    const main = document.createElement('main');
    main.className = 'app-content';
    main.appendChild(contentElement);

    container.appendChild(main);

    // Bottom Navigation
    const nav = renderBottomNav(navigate, currentPath);
    container.appendChild(nav);

    return container;
}
