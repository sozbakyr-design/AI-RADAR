
import { el, icon } from '../utils/dom.js';
import { APP_STATE } from '../config/constants.js';

export function OnboardingModal(onComplete) {
    const interests = [
        { id: 'business', label: 'İş Fikirleri', icon: 'briefcase', color: '#6366f1' },
        { id: 'money', label: 'Para Kazanma', icon: 'dollar-sign', color: '#10b981' },
        { id: 'trends', label: 'Gelecek Trendleri', icon: 'trending-up', color: '#f59e0b' },
        { id: 'creative', label: 'Yaratıcı AI', icon: 'palette', color: '#ec4899' },
        { id: 'tech', label: 'Teknik/Kodlama', icon: 'code', color: '#3b82f6' }
    ];

    const selected = new Set(APP_STATE.user.interests);

    function toggleInterest(id, btn) {
        if (selected.has(id)) {
            selected.delete(id);
            btn.style.background = 'rgba(255,255,255,0.05)';
            btn.style.borderColor = 'rgba(255,255,255,0.1)';
        } else {
            selected.add(id);
            btn.style.background = 'rgba(16, 185, 129, 0.2)';
            btn.style.borderColor = '#10b981';
        }
    }

    const grid = el('div', {
        style: 'display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 32px;'
    }, interests.map(item => {
        const isSelected = selected.has(item.id);
        const btn = el('div', {
            className: 'interest-card',
            style: `
                padding: 16px; 
                border-radius: 16px; 
                background: ${isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)'}; 
                border: 1px solid ${isSelected ? '#10b981' : 'rgba(255,255,255,0.1)'}; 
                cursor: pointer; 
                transition: all 0.2s;
                display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center;
            `,
            onclick: function () { toggleInterest(item.id, this); }
        }, [
            icon(item.icon, { style: `color: ${item.color}; width: 24px; height: 24px;` }),
            el('span', { style: 'font-size: 13px; font-weight: 600; color: white;' }, item.label)
        ]);
        return btn;
    }));

    return el('div', {
        style: 'position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 9999; padding: 24px; display: flex; flex-direction: column; justify-content: center; align-items: center;'
    }, [
        el('div', { style: 'width: 100%; max-width: 400px;' }, [
            el('h2', { style: 'font-size: 28px; font-weight: 800; margin-bottom: 8px; text-align: center;' }, 'İlgi Alanların?'),
            el('p', { style: 'color: var(--text-secondary); margin-bottom: 32px; text-align: center;' }, 'Sana en uygun fırsatları göstermek için seçim yap.'),
            grid,
            el('button', {
                style: 'width: 100%; padding: 16px; border-radius: 16px; background: var(--accent-primary); color: white; font-weight: 700; font-size: 16px; border: none; cursor: pointer;',
                onclick: () => {
                    if (selected.size === 0) {
                        alert('Lütfen en az 1 ilgi alanı seç!');
                        return;
                    }
                    // Save
                    const newInterests = Array.from(selected);
                    APP_STATE.user.interests = newInterests;
                    localStorage.setItem('aiRadar_interests', JSON.stringify(newInterests));

                    // Simple animation out
                    const modal = document.querySelector('.onboarding-modal'); // self reference trick if needed, or just let parent handle remove
                    onComplete();
                }
            }, 'Keşfetmeye Başla')
        ])
    ]);
}
