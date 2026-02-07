
import { APP_STATE } from '../config/constants.js';
import { renderOpportunityList } from './Home.js';
import { el, icon } from '../utils/dom.js';

export function ExplorePage(navigate) {
    if (!APP_STATE.opportunities || APP_STATE.opportunities.length === 0) {
        return el('div', { style: 'padding:40px; text-align:center; color:white;' }, 'Fırsatlar Yükleniyor...');
    }

    // 1. Header
    const header = el('h1', {
        style: 'font-size: 28px; font-weight: 800; margin-bottom: 24px;',
        text: 'Keşfet'
    });

    // 2. Search Bar
    const search = el('div', {
        style: `background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 12px; display: flex; align-items: center; gap: 10px; margin-bottom: 24px; color: var(--text-muted);`
    }, [
        icon('search', { style: 'width: 20px;' }),
        el('span', { style: 'font-size: 14px;', text: 'Fırsat, trend veya iş fikri ara...' })
    ]);

    // 3. Categories
    const categories = [
        { id: 'money', label: 'Para Kazanma', icon: 'dollar-sign', color: '#10b981' },
        { id: 'trends', label: 'Trendler', icon: 'trending-up', color: '#f59e0b' },
        { id: 'business', label: 'İş Fikirleri', icon: 'briefcase', color: '#6366f1' }
    ];

    const catContainer = el('div', { style: 'display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 32px;' },
        categories.map(cat => el('div', {
            style: `background: rgba(255,255,255,0.05); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer;`,
            onclick: () => navigate(`#${cat.id === 'business' ? 'opportunities' : cat.id}`)
        }, [
            el('div', { style: `width: 40px; height: 40px; border-radius: 50%; background: ${cat.color}20; display: flex; align-items: center; justify-content: center;` }, [
                icon(cat.icon, { style: `color: ${cat.color}; width: 20px;` })
            ]),
            el('span', { style: 'font-size: 12px; font-weight: 600;', text: cat.label })
        ]))
    );

    // 4. All Items List
    const shuffled = [...APP_STATE.opportunities].sort(() => 0.5 - Math.random());

    return el('div', {
        className: 'container page-explore',
        style: 'padding: 20px; max-width: 600px; margin: 0 auto;'
    }, [
        header,
        search,
        catContainer,
        el('h3', { style: 'font-size: 18px; font-weight: 700; margin-bottom: 16px;', text: 'Tüm Fırsatlar' }),
        renderOpportunityList(shuffled, navigate)
    ]);
}
