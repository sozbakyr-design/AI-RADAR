
import { APP_STATE } from '../config/constants.js';
import { el, icon } from './dom.js';
import { API } from '../supabase/api.js'; // Import API

// --- Streak Logic ---

export function checkLoginStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = localStorage.getItem('aiRadar_lastLogin');

    if (lastLogin === today) {
        return { isNewLogin: false };
    }

    // New Login Day!
    let currentStreak = parseInt(localStorage.getItem('aiRadar_streak') || 0);

    // Check if consecutive
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastLogin === yesterdayStr) {
        currentStreak++;
    } else {
        currentStreak = 1;
    }

    // Update Storage
    localStorage.setItem('aiRadar_lastLogin', today);
    localStorage.setItem('aiRadar_streak', currentStreak);

    // Update App State
    const xpReward = 10 + (currentStreak * 2);
    if (APP_STATE.user) {
        APP_STATE.user.streak = currentStreak;
        APP_STATE.user.xp += xpReward; // Add reward immediately to local state
        localStorage.setItem('aiRadar_xp', APP_STATE.user.xp);

        // SYNC TO DB
        if (window.appState?.session?.user) {
            API.syncLocalProfile(window.appState.session.user, {
                xp: APP_STATE.user.xp,
                streak: currentStreak
            });
        }
    }

    return {
        isNewLogin: true,
        streak: currentStreak,
        xpReward: xpReward
    };
}

// --- Reward Modal UI ---

export function RewardModal(data, onClose) {
    // data = { streak: 5, xpReward: 20 }

    const overlay = el('div', {
        style: 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(5px); animation: fadeIn 0.3s ease;'
    }, [
        el('div', {
            style: 'background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); width:90%; max-width:320px; padding:30px 20px; border-radius:24px; text-align:center; border: 1px solid rgba(255,255,255,0.1); position:relative; box-shadow: 0 0 50px rgba(79, 70, 229, 0.4); animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);'
        }, [
            // Icon / Image
            el('div', {
                style: 'width:80px; height:80px; background:rgba(255,255,255,0.1); border-radius:50%; margin:0 auto 20px; display:flex; align-items:center; justify-content:center; font-size:40px;'
            }, '🎁'),

            el('h2', { style: 'font-size:24px; font-weight:800; color:white; margin-bottom:8px;' }, 'Günlük Ödül!'),
            el('p', { style: 'color:rgba(255,255,255,0.8); font-size:14px; margin-bottom:24px; line-height:1.5;' }, [
                el('span', {}, 'Seriye devam ediyorsun!'),
                el('br'),
                el('span', { style: 'font-weight:700; color:#f59e0b;' }, `${data.streak} Günlük Seri 🔥`)
            ]),

            // Reward Box
            el('div', {
                style: 'background:rgba(255,255,255,0.05); padding:16px; border-radius:16px; margin-bottom:24px; border:1px solid rgba(255,255,255,0.1);'
            }, [
                el('div', { style: 'font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;' }, 'KAZANILAN'),
                el('div', { style: 'font-size:32px; font-weight:800; color:#ec4899;' }, `+${data.xpReward} XP`)
            ]),

            // Action
            el('button', {
                onclick: () => {
                    overlay.remove();
                    if (onClose) onClose();
                },
                style: 'width:100%; padding:14px; background:white; color:#1e1b4b; border:none; border-radius:12px; font-weight:700; font-size:16px; cursor:pointer;'
            }, 'Harika!')
        ])
    ]);

    return overlay;
}
