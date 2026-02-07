import { APP_STATE, GAMIFICATION_CONFIG } from '../config/constants.js';
import { renderOpportunityList } from './Home.js';
import { el, icon } from '../utils/dom.js';
import { redirectToCheckout } from '../utils/stripe.js';

export function ProfilePage(navigate) {
    // 0. Gamification Data
    const { xp, level, interests } = APP_STATE.user;
    const { levels, titles, badges } = GAMIFICATION_CONFIG;

    // Calculate Progress
    const currentLevelBase = levels[level - 1] || 0;
    const nextLevelThreshold = levels[level] || (levels[levels.length - 1] * 2);
    const xpInLevel = xp - currentLevelBase;
    const xpNeeded = nextLevelThreshold - currentLevelBase;
    const progressPercent = Math.min(100, Math.max(0, (xpInLevel / xpNeeded) * 100));

    // Dynamic Rank Title (Soul Injection)
    const currentTitleConf = titles.slice().reverse().find(t => xp >= t.minXp) || titles[0];
    const rankTitle = currentTitleConf.label;
    const rankIcon = currentTitleConf.icon;
    // Colors mapping (could be in config, but keeping simple here)
    const rankColors = {
        'search': '#94a3b8',
        'crosshair': '#3b82f6',
        'zap': '#f59e0b',
        'eye': '#8b5cf6',
        'cpu': '#ec4899',
        'sun': '#10b981'
    };
    const rankColor = rankColors[rankIcon] || '#94a3b8';

    // 1. Profile Header with Progress Bar
    const profileHeader = el('div', { style: `text-align:center; margin-bottom:30px; padding-top:20px;` }, [
        el('div', {
            style: `width:100px; height:100px; background:var(--gradient-premium); border-radius:50%; margin:0 auto 20px; display:flex; align-items:center; justify-content:center; box-shadow: 0 0 30px rgba(79, 70, 229, 0.4); position: relative;`
        }, [
            icon(rankIcon, { style: 'color:white; width:48px; height:48px;' }), // Use Title Icon
            el('div', {
                style: `position: absolute; bottom: 0; right: 0; background: ${rankColor}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid var(--bg-main); font-weight:800; font-size:12px; color:white;`
            }, [
                el('span', {}, level)
            ])
        ]),
        el('h1', { style: 'font-size:28px; margin-bottom:4px;', text: APP_STATE.user.name }),
        el('div', { style: `color: ${rankColor}; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; display:flex; align-items:center; justify-content:center; gap:6px;` }, [
            icon(rankIcon, { style: 'width:16px;' }),
            el('span', {}, rankTitle)
        ]),

        // Progress Bar Container
        el('div', { style: 'width: 200px; margin: 0 auto 8px auto;' }, [
            el('div', { style: 'display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-bottom:4px;' }, [
                el('span', {}, `${xp} XP`),
                el('span', {}, `${nextLevelThreshold} XP`)
            ]),
            el('div', { style: 'height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;' }, [
                el('div', { style: `height: 100%; width: ${progressPercent}%; background: ${rankColor}; transition: width 0.5s ease;` })
            ])
        ])
    ]);

    // 2. Stats Grid
    const likedCount = APP_STATE.user.likes.size;
    const viewsCount = APP_STATE.user.viewed.size;

    const statsGrid = el('div', { style: `display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:32px;` }, [
        el('div', { className: 'stat-box', style: 'padding:12px;' }, [
            el('div', { className: 'label', style: 'font-size:10px; color:var(--text-muted);', text: 'TARANAN' }),
            el('div', { className: 'value', style: 'font-size:18px; font-weight:800; color:white;', text: viewsCount })
        ]),
        el('div', { className: 'stat-box', style: 'padding:12px;' }, [
            el('div', { className: 'label', style: 'font-size:10px; color:var(--text-muted);', text: 'KAYDEDİLEN' }),
            el('div', { className: 'value', style: 'font-size:18px; font-weight:800; color:#ec4899;', text: likedCount })
        ]),
        el('div', { className: 'stat-box', style: 'padding:12px;' }, [
            el('div', { className: 'label', style: 'font-size:10px; color:var(--text-muted);', text: 'SERİ' }),
            el('div', { className: 'value', style: 'font-size:18px; font-weight:800; color:#f59e0b;', text: `${APP_STATE.user.streak || 0} Gün` })
        ])
    ]);

    // 2.5 Badge Grid (Soul Injection)
    const badgesSection = el('div', { style: 'margin-bottom:32px;' }, [
        el('h3', { style: 'font-size:16px; margin-bottom:12px; font-weight:600; display:flex; justify-content:space-between;' }, [
            el('span', {}, 'Rozetlerin'),
            el('span', { style: 'font-size:12px; color:var(--text-muted); font-weight:400;' }, `${badges.filter(b => b.condition(APP_STATE.user)).length}/${badges.length}`)
        ]),
        el('div', { style: 'display:grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap:12px;' },
            badges.map(badge => {
                const isUnlocked = badge.condition(APP_STATE.user);
                return el('div', {
                    style: `background:${isUnlocked ? 'rgba(255,255,255,0.05)' : 'transparent'}; border:1px solid ${isUnlocked ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'}; border-radius:16px; padding:12px; display:flex; flex-direction:column; align-items:center; gap:8px; opacity:${isUnlocked ? 1 : 0.4}; text-align:center; position:relative;`
                }, [
                    isUnlocked ? null : icon('lock', { style: 'width:12px; position:absolute; top:8px; right:8px; opacity:0.5;' }),
                    el('div', {
                        style: `width:32px; height:32px; border-radius:50%; background:${isUnlocked ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'}; display:flex; align-items:center; justify-content:center; color:white;`
                    }, [icon(badge.icon, { style: 'width:16px;' })]),
                    el('div', { style: 'font-size:10px; font-weight:700; color:white;' }, badge.label)
                ]);
            })
        )
    ]);

    // 3. Interests Section
    const interestLabels = {
        'business': 'İş Fikirleri',
        'money': 'Para Kazanma',
        'trends': 'Trendler',
        'creative': 'Yaratıcı AI',
        'tech': 'Kodlama'
    };

    const interestsList = el('div', { style: 'margin-bottom: 32px;' }, [
        el('h3', { style: 'font-size:16px; margin-bottom:12px; font-weight:600;', text: 'İlgi Alanların' }),
        el('div', { style: 'display:flex; flex-wrap:wrap; gap:8px;' },
            (interests.length > 0 ? interests : ['Henüz seçilmedi']).map(tag =>
                el('span', {
                    style: 'padding:6px 12px; background:rgba(255,255,255,0.05); border-radius:20px; font-size:12px; border:1px solid rgba(255,255,255,0.1);',
                    text: interestLabels[tag] || tag
                })
            )
        )
    ]);

    // 4. Settings List (New from snippet)
    const settingsList = el('div', { className: 'settings-list', style: 'margin-bottom: 32px;' }, [
        el('div', { className: 'setting-item', style: 'display:flex; justify-content:space-between; padding:16px; background:rgba(255,255,255,0.05); border-bottom:1px solid rgba(255,255,255,0.05); cursor:pointer;' }, [
            el('span', {}, 'Bildirimler'),
            icon('chevron-right', { style: 'width:16px; opacity:0.5;' })
        ]),
        el('div', { className: 'setting-item', style: 'display:flex; justify-content:space-between; padding:16px; background:rgba(255,255,255,0.05); border-bottom:1px solid rgba(255,255,255,0.05); cursor:pointer;' }, [
            el('span', {}, 'Gizlilik'),
            icon('chevron-right', { style: 'width:16px; opacity:0.5;' })
        ]),
        el('div', {
            className: 'setting-item', style: 'display:flex; justify-content:space-between; padding:16px; background:rgba(255,255,255,0.05); cursor:pointer;', onclick: () => {
                if (confirm('Çıkış yapılsın mı?')) { window.location.reload(); }
            }
        }, [
            el('span', { style: 'color:#ef4444;' }, 'Çıkış Yap'),
            icon('log-out', { style: 'width:16px; color:#ef4444;' })
        ])
    ]);

    // 5. Upgrade Card (Re-used)
    /* Same upgrade logic as before... */
    let upgradeCard = null;
    if (!APP_STATE.user.premium) {
        upgradeCard = el('div', {
            className: 'card',
            style: `background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); border: 1px solid rgba(168, 85, 247, 0.3); margin-bottom: 32px; text-align: center; padding: 24px; border-radius:16px;`
        }, [
            el('h3', { style: 'font-size: 20px; font-weight: 800; margin-bottom: 8px; color: white;', text: 'Pro\'ya Yükselt' }),
            el('p', { style: 'margin-bottom:16px; font-size:13px; opacity:0.8;', text: 'Tüm analizlere ve araçlara erişim kazan.' }),
            el('button', {
                onclick: () => redirectToCheckout('pro'),
                style: `width: 100%; padding: 14px; background: var(--gradient-premium); border: none; border-radius: 12px; color: white; font-weight: 700; cursor: pointer;`,
                text: 'Premium Ol'
            })
        ]);
    }

    // 6. Reset/Actions
    const actions = el('div', { style: 'margin-bottom: 32px;' }, [
        el('button', {
            onclick: () => {
                if (confirm('İlgi alanlarını sıfırlamak istiyor musun?')) {
                    APP_STATE.user.interests = [];
                    localStorage.removeItem('aiRadar_interests');
                    window.location.reload(); // Quick way to re-trigger onboarding
                }
            },
            style: 'width:100%; padding:12px; background:transparent; border:1px solid rgba(255,255,255,0.2); color:var(--text-secondary); border-radius:12px; cursor:pointer;',
            text: 'İlgi Alanlarını Sıfırla'
        })
    ]);

    return el('div', {
        className: 'container page-profile',
        style: 'padding:20px; padding-bottom:100px; max-width:600px; margin:0 auto;'
    }, [
        profileHeader,
        statsGrid,
        badgesSection,
        interestsList,
        settingsList, // Added
        upgradeCard,
        actions
    ]);
}
