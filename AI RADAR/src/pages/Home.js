import { APP_STATE } from '../config/constants.js';
import { el, icon } from '../utils/dom.js';
import { Ticker } from '../components/Ticker.js';
import { NewsletterSignup } from '../components/NewsletterSignup.js';
import { getSocialStats, getDailyCountdown } from '../utils/mockGenerator.js';
import { Walkthrough } from '../components/Walkthrough.js';
import { AIDialog } from '../components/AIDialog.js';

// --- Shared: Opportunity List Helper ---
export function renderOpportunityList(items, navigate) {
    // FILTER: Only show items matching user interests (if set)
    // For 'Home' page we might want mixed, but let's prioritize interests.
    // If items passed are already specific (like from ListPage), keep them.
    // This logic is better placed at the CALLER level usually, but let's highlight matching items here.

    const cards = items.map(item => {
        const iconBg = item.category === 'money' ? 'rgba(16, 185, 129, 0.2)' :
            item.category === 'trends' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(99, 102, 241, 0.2)';
        const iconColor = item.category === 'money' ? '#10b981' :
            item.category === 'trends' ? '#f59e0b' : '#6366f1';

        const isLocked = item.difficulty === 'Yüksek' && !APP_STATE.user.premium;
        const isLiked = APP_STATE.user.likes.has(item.id);

        // Soul Injection: Get Realistic Social Stats
        const social = getSocialStats(item.id);

        return el('div', {
            className: 'card',
            style: `background: rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 16px; display: flex; align-items: center; gap: 16px; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.2s ease; position: relative; overflow:hidden;`,
            onclick: (e) => {
                // Prevent navigation if clicking like button
                if (e.target.closest('.like-btn')) return;

                if (isLocked) {
                    alert('Bu analiz sadece Premium üyeler içindir!');
                    navigate('#/profile');
                } else {
                    APP_STATE.user.viewed.add(item.id);
                    // Add XP for reading (simplified)
                    APP_STATE.user.xp += 10;
                    localStorage.setItem('aiRadar_xp', APP_STATE.user.xp);
                    navigate(`#/detail?id=${item.id}`);
                }
            }
        }, [
            // Icon Box
            el('div', {
                style: `width: 48px; height: 48px; background: ${iconBg}; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;`
            }, [
                icon(isLocked ? 'lock' : 'zap', { style: `color: ${iconColor}; width: 24px; height: 24px;` })
            ]),
            // Content
            el('div', { style: 'flex: 1;' }, [
                el('div', { style: 'display: flex; justify-content: space-between; margin-bottom: 4px;' }, [
                    el('span', {
                        style: `font-size: 11px; font-weight: 700; color: ${iconColor}; text-transform: uppercase; letter-spacing: 0.5px;`,
                        text: item.category
                    }),
                    // Trend Score & Badge Row
                    el('div', { style: 'display:flex; align-items:center; gap:8px;' }, [
                        // Dynamic Badges (Fire / Star)
                        social.isViral ? el('span', {
                            style: 'font-size: 9px; padding: 2px 6px; background: rgba(239, 68, 68, 0.2); color: #ef4444; border-radius: 4px; font-weight:800;',
                            text: '🔥 TOP %10'
                        }) : null,

                        el('span', {
                            style: 'font-size: 11px; color: var(--text-muted); display: flex; align-items: center; gap: 4px;'
                        }, [
                            icon('trending-up', { style: 'width: 12px;' }),
                            el('span', {}, ` ${item.trendScore}%`)
                        ])
                    ])
                ]),
                el('h3', {
                    style: 'font-size: 15px; font-weight: 600; margin-bottom: 4px; color: var(--text-main); line-height: 1.4;',
                    text: item.title
                }),
                // SOCIAL PROOF LINE (Soul Injection)
                el('div', { style: 'font-size: 11px; color: var(--text-muted); display: flex; gap: 12px; align-items:center; margin-top:4px;' }, [
                    el('span', { style: 'display:flex; align-items:center; gap:3px;' }, [
                        icon('eye', { style: 'width:12px; opacity:0.7;' }),
                        el('span', {}, new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(social.views))
                    ]),
                    el('span', { style: 'display:flex; align-items:center; gap:3px;' }, [
                        icon('heart', { style: 'width:12px; opacity:0.7;' }),
                        el('span', {}, new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(social.likes))
                    ])
                ])
            ]),
            // Like Button (Absolute or Flex? Flex is safer for layout)
            el('button', {
                className: 'like-btn',
                style: `background: transparent; border: none; cursor: pointer; padding: 8px; display: flex; align-items: center; justify-content: center; color: ${isLiked ? '#ec4899' : 'rgba(255,255,255,0.3)'}; transition: transform 0.2s;`,
                onclick: function (e) {
                    e.stopPropagation(); // Stop card click

                    if (APP_STATE.user.likes.has(item.id)) {
                        APP_STATE.user.likes.delete(item.id);
                        this.style.color = 'rgba(255,255,255,0.3)';
                        this.style.transform = 'scale(1)';
                    } else {
                        APP_STATE.user.likes.add(item.id);
                        APP_STATE.user.xp += 5; // XP Reward
                        this.style.color = '#ec4899';
                        this.style.transform = 'scale(1.3)';
                        setTimeout(() => this.style.transform = 'scale(1)', 200);
                    }
                    // Persist
                    localStorage.setItem('aiRadar_likes', JSON.stringify(Array.from(APP_STATE.user.likes)));
                    localStorage.setItem('aiRadar_xp', APP_STATE.user.xp);

                    const xpDisplay = document.getElementById('xp-display');
                    if (xpDisplay) xpDisplay.textContent = `${APP_STATE.user.xp} XP`;
                }
            }, [
                icon('heart', { fill: isLiked ? 'currentColor' : 'none', style: 'width: 20px; height: 20px;' })
            ])
        ]);
    });

    return el('div', {
        className: 'opportunity-list',
        style: 'display: flex; flex-direction: column; gap: 16px; padding-bottom: 80px;'
    }, cards);
}

export function HomePage(navigate) {
    try {
        // Loading State
        if (!APP_STATE.opportunities || APP_STATE.opportunities.length === 0) {
            return el('div', { style: 'padding:40px; text-align:center; color:white;' }, [
                el('div', { className: 'spinner', style: 'margin-bottom:20px;' }),
                el('p', {}, 'Fırsatlar Yükleniyor...')
            ]);
        }

        const iconItem = APP_STATE.opportunities[0];
        const countdown = getDailyCountdown();

        // 1. Header (Brand & User Status)
        const header = el('header', {
            style: 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-top: 10px;'
        }, [
            el('div', {}, [
                el('div', { style: 'display: flex; align-items: center; gap: 8px; margin-bottom: 4px;' }, [
                    el('div', {
                        style: 'background: var(--accent-primary); color: white; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase;',
                        text: `LVL ${APP_STATE.user.level}`
                    }),
                    el('span', { id: 'xp-display', style: 'font-size: 12px; font-weight: 700; color: var(--accent-primary);', text: `${APP_STATE.user.xp} XP` }),
                    APP_STATE.user.streak > 0 ? el('div', {
                        style: 'display:flex; align-items:center; color:#f59e0b; font-size:12px; font-weight:800; margin-left:8px; gap:2px;'
                    }, [
                        icon('flame', { style: 'width:12px; fill:#f59e0b;' }),
                        el('span', {}, APP_STATE.user.streak)
                    ]) : null
                ]),
                el('h1', { style: 'font-size: 24px; font-weight: 800; letter-spacing: -0.5px;' }, [
                    el('span', {}, 'AI '),
                    el('span', { style: 'color: var(--accent-primary);' }, 'Radar')
                ])
            ]),
            el('div', {
                style: 'width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;',
                onclick: () => navigate('#/profile')
            }, [
                icon('user', { style: 'width: 20px; color: white;' })
            ])
        ]);

        // 2. Daily Opportunity Hero Card
        const dayIndex = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24) % APP_STATE.opportunities.length;
        const dailyItem = APP_STATE.opportunities[dayIndex];

        const dailyCard = el('div', {
            className: 'daily-card',
            style: `background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 24px; border-radius: 20px; margin-bottom: 32px; cursor: pointer; position: relative; overflow: hidden; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3); border: 2px solid rgba(220, 38, 38, 0.5); animation: pulse-border 2s infinite;`,
            onclick: (e) => {
                if (e.target.tagName === 'BUTTON') return;
                navigate(`#/detail?id=${dailyItem.id}`);
            }
        }, [
            el('div', { style: 'position: relative; z-index: 2;' }, [
                el('div', { style: 'display: flex; justify-content: space-between; margin-bottom: 12px;' }, [
                    el('div', { style: 'display:flex; gap: 8px;' }, [
                        el('span', { style: 'background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; color: white;', text: 'GÜNÜN FIRSATI' }),
                        el('span', { className: 'fomo-timer', style: 'background: rgba(220, 38, 38, 0.9); padding: 4px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; color: white; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);', text: `⏳ ${countdown.fullText}` })
                    ]),
                    el('span', { style: 'color: rgba(255,255,255,0.9); font-size: 12px; font-weight: 600;', text: `🔥 ${dailyItem.trendScore} Trend Skoru` })
                ]),
                el('h2', { style: 'font-size: 22px; font-weight: 800; color: white; margin-bottom: 8px; line-height: 1.2;', text: dailyItem.title }),
                el('p', { style: 'color: rgba(255,255,255,0.9); font-size: 13px; margin-bottom: 20px; line-height: 1.5; opacity: 0.9;', text: dailyItem.description }),
                el('div', { style: 'display:flex; justify-content:space-between; align-items:center' }, [
                    el('button', {
                        style: 'background: white; color: #059669; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 800; font-size: 14px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); display:flex; align-items:center; gap:6px;',
                        onclick: (e) => {
                            e.stopPropagation();
                            navigate(`#/detail?id=${dailyItem.id}&action=start`);
                        }
                    }, [
                        icon('play', { style: 'width:16px; fill:currentColor;' }),
                        el('span', {}, '60 Sn\'de Başla')
                    ]),
                    el('span', { style: 'font-size:11px; color:rgba(255,255,255,0.8); font-weight:600;', text: '+25 XP Bonus' })
                ])
            ]),
            el('div', { style: "position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop') center/cover; opacity: 0.1; mix-blend-mode: overlay; z-index: 1;" })
        ]);

        // 3. Quick Actions Grid
        const actions = [
            { label: 'Para Kazanma', icon: 'dollar-sign', color: '#10b981', path: '#/money' },
            { label: 'Trendler', icon: 'trending-up', color: '#f59e0b', path: '#/trends' },
            { label: 'İş Fikirleri', icon: 'briefcase', color: '#6366f1', path: '#/opportunities' },
            { label: 'Kaydedilenler', icon: 'bookmark', color: '#ec4899', path: '#/saved' }
        ];

        const actionGrid = el('div', { style: 'display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 32px;' },
            actions.map(action => el('div', {
                style: 'background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: background 0.2s;',
                onclick: () => navigate(action.path)
            }, [
                el('div', { style: `width: 36px; height: 36px; border-radius: 10px; background: ${action.color}20; display: flex; align-items: center; justify-content: center;` }, [
                    icon(action.icon, { style: `color: ${action.color}; width: 18px;` })
                ]),
                el('span', { style: 'font-size: 12px; font-weight: 600; color: var(--text-secondary);', text: action.label })
            ]))
        );

        // 4. Continue Learning (Retention)
        const progressEntries = Object.entries(APP_STATE.progress || {}).sort((a, b) => new Date(b[1].lastUpdated) - new Date(a[1].lastUpdated));
        const activeEntry = progressEntries.find(([id, data]) => data.status === 'in_progress');

        let continueSection = null;
        let continueItem = null;

        if (activeEntry) continueItem = APP_STATE.opportunities.find(i => i.id === activeEntry[0]);
        else if (localStorage.getItem('aiRadar_lastViewedId')) continueItem = APP_STATE.opportunities.find(i => i.id === localStorage.getItem('aiRadar_lastViewedId'));

        if (continueItem) {
            continueSection = el('div', { style: 'margin-bottom: 32px;' }, [
                el('h3', { style: 'font-size: 16px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;' }, [
                    icon('clock', { style: 'width: 16px; color: var(--accent-primary);' }),
                    el('span', {}, activeEntry ? 'Kaldığın Yerden' : 'Son Görüntülenen')
                ]),
                el('div', {
                    style: 'background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border-left: 3px solid var(--accent-primary);',
                    onclick: () => navigate(`#/detail?id=${continueItem.id}`)
                }, [
                    el('div', {}, [
                        el('div', { style: 'font-size: 11px; color: var(--text-muted); margin-bottom: 2px;', text: activeEntry ? (continueItem.steps[activeEntry[1].currentStep] || 'Devam et') : 'İncelemeye devam et' }),
                        el('div', { style: 'font-weight: 600; font-size: 14px;', text: continueItem.title })
                    ]),
                    icon('chevron-right', { style: 'color: var(--text-muted); width: 16px;' })
                ])
            ]);
        }

        // 5. User Personalized Feed
        const feed = renderOpportunityList(
            APP_STATE.opportunities
                .filter(o => APP_STATE.user.interests.length === 0 || APP_STATE.user.interests.includes(o.category) || o.category === 'trends')
                .slice(0, 10),
            navigate
        );

        // Assemble Page
        return el('div', {
            className: 'container page-home',
            style: 'padding: 20px; max-width: 600px; margin: 0 auto;'
        }, [
            // Admin Access (Temp)
            el('button', {
                style: 'width:100%; padding:15px; margin-bottom:15px; background:#ef4444; color:white; font-weight:800; border-radius:12px; box-shadow:0 4px 15px rgba(239,68,68,0.4);',
                onclick: () => navigate('#/admin')
            }, '🛠️ ADMIN PANELİNE GİT'),

            Ticker(),
            header,
            el('div', { style: 'margin: 20px 0;' }, [AIDialog()]), // AI Dialog here
            dailyCard,
            actionGrid,
            continueSection,
            NewsletterSignup(),
            el('h3', { style: 'font-size: 18px; font-weight: 700; margin-bottom: 16px;', text: 'Sizin İçin Seçilenler' }),
            feed,
            Walkthrough()
        ].filter(Boolean));

    } catch (err) {
        console.error('Home Render Error:', err);
        return el('div', { style: 'color:red; padding:20px;' }, [
            el('h2', {}, 'Görünüm Hatası'),
            el('pre', { style: 'white-space:pre-wrap;' }, err.toString())
        ]);
    }
}

