
export function renderBottomNav(navigate, currentPath) {
    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';

    // Config for nav items
    const items = [
        { icon: 'home', label: 'Home', path: '/' },
        { icon: 'dollar-sign', label: 'Money', path: '/make-money' },
        { icon: 'trending-up', label: 'Trends', path: '/trends' },
        { icon: 'lightbulb', label: 'Ideas', path: '/ideas' },
        { icon: 'user', label: 'Profile', path: '/profile' }
    ];

    items.forEach(item => {
        const isActive = currentPath === item.path;
        const btn = document.createElement('button');
        btn.className = `nav-item ${isActive ? 'active' : ''}`;
        btn.onclick = () => navigate(item.path);

        btn.innerHTML = `
            <i data-lucide="${item.icon}"></i>
            <span>${item.label}</span>
        `;

        nav.appendChild(btn);
    });

    return nav;
}
