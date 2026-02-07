
import { el, icon } from '../utils/dom.js';

export function CelebrationModal(item, navigate, recommendations) {
    const { scaleUp, similar } = recommendations || {};

    const overlay = el('div', {
        style: `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.9); z-index: 10000;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        opacity: 0; transition: opacity 0.5s ease; padding: 20px;
        `
    }, [
        el('div', { style: 'text-align: center; margin-bottom: 32px; transform: scale(0.8); transition: transform 0.5s;' }, [
            el('div', { style: 'font-size: 64px; margin-bottom: 16px;' }, '🎉'),
            el('h2', {
                style: 'font-size: 32px; font-weight: 800; color: white; margin-bottom: 8px;'
            }, 'Tebrikler!'),
            el('p', { style: 'color: white; font-size: 18px; opacity: 0.9;' }, 'İlk gelirini elde ettin. Bu sadece başlangıç.')
        ]),

        el('div', { style: 'width: 100%; max-width: 340px;' }, [
            el('div', {
                style: 'font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; text-align: center;'
            }, 'Sıradaki Adımın'),

            // Recommmendation Card (if exists)
            scaleUp ? el('div', {
                className: 'card interactive-card',
                style: 'background: rgba(255,255,255,0.05); border: 1px solid var(--accent-primary); padding: 20px; border-radius: 16px; margin-bottom: 12px; cursor: pointer;',
                onclick: () => {
                    overlay.remove();
                    navigate(`#/detail?id=${scaleUp.id}`);
                }
            }, [
                el('div', { style: 'display: flex; align-items: center; gap: 8px; margin-bottom: 8px;' }, [
                    icon('trending-up', { style: 'color: var(--accent-primary); width: 16px;' }),
                    el('span', { style: 'font-size: 12px; color: var(--accent-primary); font-weight: 700;' }, 'SEVİYE YÜKSELT')
                ]),
                el('h3', { style: 'font-size: 16px; font-weight: 700; color: white; margin-bottom: 4px;' }, scaleUp.title),
                el('div', { style: 'font-size: 13px; color: var(--text-secondary);' }, `${scaleUp.revenuePotential} • ${scaleUp.difficulty}`)
            ]) : null,

            // Home Button
            el('div', {
                className: 'card interactive-card',
                style: 'background: transparent; border: 1px solid rgba(255,255,255,0.2); padding: 16px; border-radius: 16px; cursor: pointer; text-align: center;',
                onclick: () => {
                    overlay.remove();
                    navigate('#/');
                }
            }, [
                el('span', { style: 'font-size: 14px; font-weight: 600; color: white;' }, 'Ana Sayfaya Dön')
            ])
        ])
    ]);

    document.body.appendChild(overlay);

    // Animation
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        overlay.firstChild.style.transform = 'scale(1)';
    });

    // Trigger Confetti (Assuming it's available or we port it too)
    // We will port confetti logic separately or inline it if small
}
