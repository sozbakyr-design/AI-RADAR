
import { APP_STATE } from '../config/constants.js';
import { renderOpportunityList } from './Home.js';
import { el, icon } from '../utils/dom.js';

export function SavedPage(navigate) {
    // 1. Header
    const header = el('h1', {
        style: 'font-size: 28px; font-weight: 800; margin-bottom: 24px;',
        text: 'Kütüphane'
    });

    // 2. Filter Logic
    let currentFilter = 'all';
    const contentContainer = el('div');
    const filterButtons = [];

    const renderContent = () => {
        contentContainer.innerHTML = ''; // This is safe because we controlled contentContainer, but better to clear properly
        while (contentContainer.firstChild) contentContainer.removeChild(contentContainer.firstChild);

        let items = [];
        const savedIds = APP_STATE.saved.map(s => s.id);
        const inProgressIds = Object.keys(APP_STATE.progress || {});
        const completedIds = APP_STATE.completed;

        if (currentFilter === 'all') {
            const allIds = new Set([...savedIds, ...inProgressIds, ...completedIds]);
            items = APP_STATE.opportunities.filter(o => allIds.has(o.id));
        } else if (currentFilter === 'in-progress') {
            // Updated logic: Check status 'in_progress' and not completed
            items = APP_STATE.opportunities.filter(o => {
                const prog = APP_STATE.progress[o.id];
                return prog && prog.status === 'in_progress' && !completedIds.includes(o.id);
            });
        } else if (currentFilter === 'saved') {
            items = APP_STATE.saved;
        } else if (currentFilter === 'completed') {
            items = APP_STATE.opportunities.filter(o => completedIds.includes(o.id));
        }

        if (items.length === 0) {
            contentContainer.appendChild(el('div', { style: 'text-align: center; padding: 40px 0; color: var(--text-muted);' }, [
                icon('bookmark', { style: 'width: 48px; height: 48px; color: var(--text-muted); opacity: 0.5; margin-bottom: 16px;' }),
                el('p', {}, 'Henüz bir şey yok.'),
                el('button', {
                    style: 'margin-top:16px; padding:8px 16px; background:var(--bg-card); border:1px solid rgba(255,255,255,0.1); color:white; border-radius:8px; cursor:pointer;',
                    onclick: () => window.appNavigate('#/explore'),
                    text: 'Keşfetmeye Başla'
                })
            ]));
        } else {
            contentContainer.appendChild(renderOpportunityList(items, navigate));
        }
    };

    // 3. Filter Bar
    const filters = [
        { id: 'all', label: 'Tümü' },
        { id: 'in-progress', label: 'Sürüyor' },
        { id: 'saved', label: 'Kaydedilenler' },
        { id: 'completed', label: 'Tamamlanan' }
    ];

    const filterBar = el('div', { style: 'display:flex; gap:8px; overflow-x:auto; padding-bottom:12px; margin-bottom:12px; scrollbar-width:none;' },
        filters.map(f => {
            const btn = el('button', {
                style: `padding: 6px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.1); font-size:12px; font-weight:700; white-space:nowrap; cursor:pointer; transition: all 0.2s;`,
                onclick: () => {
                    currentFilter = f.id;
                    updateStyles();
                    renderContent();
                },
                text: f.label
            });
            filterButtons.push({ id: f.id, elem: btn });
            return btn;
        })
    );

    function updateStyles() {
        filterButtons.forEach(fb => {
            const isActive = currentFilter === fb.id;
            fb.elem.style.background = isActive ? 'white' : 'transparent';
            fb.elem.style.color = isActive ? 'black' : 'var(--text-secondary)';
        });
    }

    // Init
    updateStyles();
    renderContent();

    return el('div', {
        className: 'container page-saved',
        style: 'padding: 20px; max-width: 600px; margin: 0 auto;'
    }, [
        header,
        filterBar,
        contentContainer
    ]);
}
