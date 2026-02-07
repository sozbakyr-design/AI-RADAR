
import { el, icon } from '../utils/dom.js';

export function ShareCard(item) {
    // A visual card intended to be screenshotted (not real image gen yet, but DOM layout)
    return el('div', {
        className: 'share-card-visual',
        style: 'background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); padding: 32px; border-radius: 24px; position:relative; overflow:hidden; border:2px solid rgba(255,255,255,0.1); width:100%; max-width:320px; margin:0 auto;'
    }, [
        // Background Deco
        el('div', { style: 'position:absolute; top:-50px; right:-50px; width:150px; height:150px; background:var(--accent-primary); filter:blur(80px); opacity:0.3;' }),

        el('div', { style: 'position:relative; z-index:2; text-align:center;' }, [
            el('div', { style: 'font-size:12px; font-weight:700; letter-spacing:2px; color:rgba(255,255,255,0.6); margin-bottom:16px; text-transform:uppercase;' }, 'AI RADAR FIRSATI'),

            // Icon
            el('div', { style: 'width:64px; height:64px; background:rgba(255,255,255,0.1); border-radius:16px; display:flex; align-items:center; justify-content:center; margin:0 auto 20px;' }, [
                icon('zap', { style: 'width:32px; color:#fbbf24;' })
            ]),

            el('h2', { style: 'font-size:24px; font-weight:800; line-height:1.2; margin-bottom:12px;' }, item.title),

            el('div', { style: 'display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.1); padding:8px 16px; border-radius:20px; margin-bottom:24px;' }, [
                el('span', {}, '🔥'),
                el('span', { style: 'font-weight:700;' }, `%${item.trendScore} Trend Skoru`)
            ]),

            el('div', { style: 'border-top:1px solid rgba(255,255,255,0.1); padding-top:20px; display:flex; justify-content:space-between; align-items:center;' }, [
                el('div', { style: 'text-align:left;' }, [
                    el('div', { style: 'font-size:11px; color:rgba(255,255,255,0.5);' }, 'POTANSİYEL'),
                    el('div', { style: 'font-weight:700; font-size:14px; color:#10b981;' }, item.revenuePotential)
                ]),
                el('div', { style: 'text-align:right;' }, [
                    el('div', { style: 'font-size:11px; color:rgba(255,255,255,0.5);' }, 'BAŞLAMA'),
                    el('div', { style: 'font-weight:700; font-size:14px;' }, item.timeToStart)
                ])
            ])
        ])
    ]);
}
