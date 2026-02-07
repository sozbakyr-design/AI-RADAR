
import { APP_STATE, getDailyOpportunity } from '../config/constants.js';
import { el, icon } from '../utils/dom.js';

export const NotificationManager = {
    init() {
        this.checkInactivity();
        this.checkDailyDrop();
        this.checkSavedReminder();
        this.updateLastVisit();
    },

    updateLastVisit() {
        const now = new Date().toISOString();
        localStorage.setItem('aiRadar_lastVisit', now);
    },

    showToast(message, type = 'info', onClick = null) {
        const container = document.getElementById('toast-container') || this.createContainer();

        const toast = el('div', {
            style: `background: #1e1b4b; color: white; padding: 16px; border-radius: 12px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 12px; min-width: 300px; cursor: pointer; animation: slideInRight 0.3s ease; border-left: 4px solid ${type === 'alert' ? '#ef4444' : '#10b981'};`,
            onclick: () => {
                if (onClick) onClick();
                toast.remove();
            }
        }, [
            icon(type === 'alert' ? 'bell' : 'zap', { style: 'width: 20px; color: rgba(255,255,255,0.8);' }),
            el('span', { style: 'font-size: 13px; font-weight: 600; flex: 1;' }, message),
            icon('x', { style: 'width: 16px; opacity: 0.5;', onclick: (e) => { e.stopPropagation(); toast.remove(); } })
        ]);

        container.appendChild(toast);

        // Sound
        if (window.AudioContext) {
            // Simple beep placeholder or silence
        }

        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000); // 5s duration
    },

    createContainer() {
        const c = el('div', {
            id: 'toast-container',
            style: 'position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column;'
        });
        document.body.appendChild(c);
        return c;
    },

    checkInactivity() {
        const lastVisit = localStorage.getItem('aiRadar_lastVisit');
        if (lastVisit) {
            const daysSince = (new Date() - new Date(lastVisit)) / (1000 * 60 * 60 * 24);
            if (daysSince > 3) {
                setTimeout(() => {
                    this.showToast('👋 Seni özledik! 3 gündür yoksun.', 'info', () => window.location.hash = '#/');
                }, 2000);
            }
        }
    },

    checkDailyDrop() {
        const lastDailyCheck = localStorage.getItem('aiRadar_lastDailyCheck');
        const today = new Date().toDateString();

        if (lastDailyCheck !== today) {
            const dailyOp = getDailyOpportunity();
            setTimeout(() => {
                this.showToast(`🔥 Günün Fırsatı: ${dailyOp.title}`, 'success', () => window.location.hash = `#/detail?id=${dailyOp.id}`);
                localStorage.setItem('aiRadar_lastDailyCheck', today);
            }, 4000); // Show after a bit
        }
    },

    checkSavedReminder() {
        // 10% chance to remind about saved item
        if (Math.random() < 0.1 && APP_STATE.saved.length > 0) {
            const item = APP_STATE.saved[Math.floor(Math.random() * APP_STATE.saved.length)];
            setTimeout(() => {
                this.showToast(`📌 Kaydettiğin "${item.title}" seni bekliyor.`, 'info', () => window.location.hash = `#/detail?id=${item.id}`);
            }, 10000);
        }
    }
};
