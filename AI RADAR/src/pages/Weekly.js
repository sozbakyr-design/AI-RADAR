
import { APP_STATE } from '../config/constants.js';
import { el, icon } from '../utils/dom.js';

export function WeeklyPage(navigate) {
    const completedCount = APP_STATE.completed.length;
    // Mock Week Stats
    const xpChange = '+120 XP';
    const rank = APP_STATE.user.level;

    return el('div', {
        className: 'container page-weekly',
        style: 'padding: 20px; max-width: 600px; margin: 0 auto; min-height: 100vh; display:flex; flex-direction:column;'
    }, [
        // Header
        el('header', { style: 'display:flex; align-items:center; justify-content:space-between; margin-bottom:32px;' }, [
            el('h1', { style: 'font-size:28px; font-weight:800;' }, 'Haftalık Özet'),
            el('button', {
                onclick: () => navigate('#/home'),
                style: 'background:rgba(255,255,255,0.1); border:none; width:40px; height:40px; border-radius:50%; color:white; display:flex; align-items:center; justify-content:center; cursor:pointer;'
            }, [icon('x')])
        ]),

        // Main Card
        el('div', {
            style: 'background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px; border-radius: 24px; text-align:center; margin-bottom:32px; box-shadow:0 10px 40px rgba(124, 58, 237, 0.3); animation: slideUp 0.4s ease;'
        }, [
            el('div', { style: 'font-size:14px; color:rgba(255,255,255,0.8); margin-bottom:8px; text-transform:uppercase; letter-spacing:1px; font-weight:700;' }, 'BU HAFTA'),
            el('div', { style: 'font-size:48px; font-weight:800; margin-bottom:8px;' }, completedCount),
            el('div', { style: 'font-size:16px; margin-bottom:24px;' }, 'Fırsat Tamamlandı'),

            el('div', { style: 'display:flex; justify-content:center; gap:24px; border-top:1px solid rgba(255,255,255,0.2); padding-top:24px;' }, [
                el('div', {}, [
                    el('div', { style: 'font-size:20px; font-weight:700;' }, xpChange),
                    el('div', { style: 'font-size:12px; opacity:0.7;' }, 'Kazanılan XP')
                ]),
                el('div', {}, [
                    el('div', { style: 'font-size:20px; font-weight:700;' }, `Lvl ${rank}`),
                    el('div', { style: 'font-size:12px; opacity:0.7;' }, 'Mevcut Seviye')
                ])
            ])
        ]),

        // Insight / Motivation
        el('div', { style: 'margin-bottom:32px; text-align:center;' }, [
            el('h3', { style: 'margin-bottom:12px; font-size:18px;' }, '🚀 Harika gidiyorsun!'),
            el('p', { style: 'color:var(--text-muted); line-height:1.6;' }, 'Geçen haftaya göre aktiviten %20 arttı. Bu hızla gidersen "Radar Kahini" rozetini yakında alacaksın.')
        ]),

        // Premium CTA
        !APP_STATE.user.premium ? el('div', {
            style: 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:20px; padding:24px; text-align:center;'
        }, [
            icon('crown', { style: 'width:32px; color:#fbbf24; margin-bottom:12px;' }),
            el('h3', { style: 'font-size:16px; font-weight:700; margin-bottom:8px;' }, 'Daha Hızlı Büyü'),
            el('p', { style: 'font-size:13px; color:var(--text-muted); margin-bottom:16px;' }, 'Premium üyeler haftada 3 kat daha fazla fırsat yakalıyor.'),
            el('button', {
                onclick: () => navigate('#/profile'),
                style: 'background:#fbbf24; color:black; border:none; padding:12px 24px; border-radius:12px; font-weight:700; cursor:pointer;'
            }, 'Premium\'u İncele')
        ]) : null

    ]);
}
