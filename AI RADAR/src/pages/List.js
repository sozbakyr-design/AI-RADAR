
import { APP_STATE } from '../config/constants.js';
import { renderOpportunityList } from './Home.js';
import { el, icon } from '../utils/dom.js';

export function ListPage(navigate, categoryId) {
    const categoryTitles = {
        'business': 'İş Fikirleri',
        'money': 'Para Kazanma',
        'trends': 'Trendler'
    };

    const title = categoryTitles[categoryId] || 'Liste';
    let items = APP_STATE.opportunities.filter(o => o.category === (categoryId === 'business' ? 'business' : categoryId));

    // Intelligence: Auto-Sort Trends by Score
    if (categoryId === 'trends') {
        items = items.sort((a, b) => b.trendScore - a.trendScore);
    }

    // Header
    const header = el('div', { style: 'display:flex; align-items:center; gap:16px; margin-bottom:24px;' }, [
        el('button', {
            onclick: () => window.history.back(),
            style: `width:40px; height:40px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.05); border-radius:50%; border:none; color:white; cursor:pointer;`
        }, [icon('arrow-left')]),
        el('h1', { style: 'font-size:24px; font-weight:800;', text: title })
    ]);

    // Filters (Horizontal Scroll)
    const filters = [
        { id: 'all', label: 'Tümü' },
        { id: 'new', label: 'Yeni' },
        { id: 'popular', label: 'Popüler' },
        { id: 'easy', label: 'Kolay Başlangıç' }
    ];

    const filterBar = el('div', {
        style: `display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 12px; scrollbar-width: none;`
    }, filters.map(f => el('button', {
        style: `padding: 6px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.1); background: ${f.id === 'all' ? 'white' : 'transparent'}; color: ${f.id === 'all' ? 'black' : 'var(--text-secondary)'}; font-size:12px; font-weight:700; white-space:nowrap; cursor:pointer;`,
        text: f.label
    })));

    return el('div', {
        className: 'container page-list',
        style: 'padding:20px; max-width:600px; margin:0 auto;'
    }, [
        header,
        filterBar,
        renderOpportunityList(items, navigate)
    ]);
}
