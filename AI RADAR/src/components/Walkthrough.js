import { el, icon } from '../utils/dom.js';

export function Walkthrough(onComplete) {
    const hasSeen = localStorage.getItem('aiRadar_walkthrough_v1');
    if (hasSeen) {
        if (onComplete) onComplete(); // Ensure flow continues even if seen
        return null;
    }

    let step = 0;
    const steps = [
        {
            title: 'Hoşgeldin! 👋',
            desc: 'AI Radar, sana her gün 1 yeni kazanç fırsatı sunar.'
        },
        {
            title: 'Kazanmaya Başla 🚀',
            desc: '"Günün Fırsatı" kartına tıkla ve ilk adımını 60 saniyede at.'
        },
        {
            title: 'Seviye Atla 🏆',
            desc: 'Aksiyon aldıkça XP kazan ve "Radar Kahini" ol!',
            action: 'Başlayalım'
        }
    ];

    const container = el('div', {
        className: 'walkthrough-overlay',
        style: 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(5px);'
    });

    function renderStep() {
        container.innerHTML = '';
        const data = steps[step];

        const card = el('div', {
            style: 'background:var(--bg-card); padding:32px; border-radius:24px; max-width:320px; text-align:center; border:1px solid rgba(255,255,255,0.1); box-shadow:0 20px 50px rgba(0,0,0,0.5); animation: content-in 0.3s ease-out;'
        }, [
            // Icon based on step
            el('div', { style: 'font-size:40px; margin-bottom:16px;' },
                step === 0 ? '👋' : step === 1 ? '🚀' : '🏆'
            ),
            el('h2', { style: 'font-size:20px; font-weight:800; margin-bottom:12px; color:white;' }, data.title),
            el('p', { style: 'font-size:15px; color:rgba(255,255,255,0.8); line-height:1.5; margin-bottom:24px;' }, data.desc),
            el('div', { style: 'display:flex; justify-content:center; gap:8px;' }, [
                // Indicators
                ...steps.map((_, i) => el('div', {
                    style: `width:8px; height:8px; border-radius:50%; background:${i === step ? 'white' : 'rgba(255,255,255,0.2)'};`
                }))
            ]),
            el('button', {
                style: 'width:100%; margin-top:24px; background:var(--accent-primary); color:white; border:none; padding:14px; border-radius:12px; font-weight:700; font-size:14px; cursor:pointer;',
                onclick: next
            }, data.action || 'Devam Et')
        ]);

        container.appendChild(card);
    }

    function next() {
        if (step < steps.length - 1) {
            step++;
            renderStep();
        } else {
            close();
        }
    }

    function close() {
        localStorage.setItem('aiRadar_walkthrough_v1', 'true');
        container.style.opacity = '0';
        setTimeout(() => {
            container.remove();
            if (onComplete) onComplete();
        }, 300);
    }

    renderStep();
    return container;
}
