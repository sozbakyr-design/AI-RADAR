
import { APP_STATE } from '../config/constants.js';
import { el, icon } from '../utils/dom.js';
import { Haptics } from '../utils/haptics.js';
import { ShareModal } from '../components/ShareModal.js';

// ... (triggerUpgrade helper remains same)
function triggerUpgrade(navigate) {
    navigate('#/profile');
}
export function DetailPage(navigate) {
    // ... (params logic remains same)
    let id = null;
    if (window.currentParams && window.currentParams.get('id')) {
        id = window.currentParams.get('id');
    } else if (window.location.hash.includes('id=')) {
        id = window.location.hash.split('id=')[1].split('&')[0];
    }

    // Try finding in state, else fetch (async component pattern or simple fallback)
    let item = APP_STATE.opportunities.find(i => i.id === id);

    // If data not loaded yet, show loading (this page re-renders when main.js fetches)
    if (!item && APP_STATE.opportunities.length === 0) {
        return el('div', { style: 'padding:40px; text-align:center; color:white;' }, 'Yükleniyor...');
    }

    // Auto-Scroll if action=start
    if (window.currentParams && window.currentParams.get('action') === 'start') {
        setTimeout(() => {
            const stepsEl = document.getElementById('steps-section');
            if (stepsEl) {
                stepsEl.scrollIntoView({ behavior: 'smooth' });
                // Add highlight effect
                stepsEl.style.transition = 'background 0.5s';
                stepsEl.style.background = 'rgba(16, 185, 129, 0.1)';
                setTimeout(() => stepsEl.style.background = 'transparent', 1000);
            }
        }, 100);

        // Auto-mark as In Progress if not already
        if (!APP_STATE.progress[item.id]) {
            APP_STATE.progress[item.id] = { status: 'in_progress', lastUpdated: new Date().toISOString(), currentStep: 0 };
            localStorage.setItem('aiRadar_progress_v2', JSON.stringify(APP_STATE.progress));
        }
    }

    // --- Header ---
    const header = el('div', {
        style: `display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; position:relative; z-index:2;`
    }, [
        el('button', {
            onclick: () => window.history.back(),
            style: `background:rgba(255,255,255,0.08); border:none; color:white; width:44px; height:44px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(10px);`
        }, [icon('arrow-left')]),
        el('div', { style: 'display:flex; gap:12px;' }, [
            // Share Button
            el('button', {
                onclick: () => {
                    Haptics.light();
                    const modal = ShareModal(item);
                    document.body.appendChild(modal);
                },
                style: `background:rgba(255,255,255,0.08); border:none; color:white; width:44px; height:44px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center;`
            }, [icon('share-2', { style: 'width:20px;' })]),

            // Like Button
            el('button', {
                className: 'toggle-like-btn',
                onclick: (e) => {
                    Haptics.medium(); // Tactile pop
                    const btn = e.currentTarget;
                    const iconElem = btn.querySelector('i');
                    if (APP_STATE.user.likes.has(item.id)) {
                        APP_STATE.user.likes.delete(item.id);
                        iconElem.style.fill = 'none';
                        iconElem.style.color = 'white';
                    } else {
                        APP_STATE.user.likes.add(item.id);
                        APP_STATE.user.xp += 5;
                        iconElem.style.fill = '#ec4899';
                        iconElem.style.color = '#ec4899';
                    }
                    localStorage.setItem('aiRadar_likes', JSON.stringify(Array.from(APP_STATE.user.likes)));
                    localStorage.setItem('aiRadar_xp', APP_STATE.user.xp);
                },
                style: `background:rgba(255,255,255,0.08); border:none; color:white; width:44px; height:44px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center;`
            }, [icon('heart', { style: isLiked ? 'fill:#ec4899; color:#ec4899;' : '' })]),

            // Save / Progress Toggle (Enhanced)
            el('button', {
                className: 'toggle-save-btn',
                onclick: (e) => {
                    Haptics.light();
                    const btn = e.currentTarget;
                    const iconElem = btn.querySelector('i');

                    const isNowSaved = APP_STATE.saved.some(s => s.id === item.id);
                    const isNowInProgress = APP_STATE.progress[item.id]?.status === 'in_progress';

                    // Cycle: Empty -> Saved -> In Progress -> Empty
                    if (!isNowSaved && !isNowInProgress) {
                        // Empty -> Saved
                        APP_STATE.saved.push(item);
                        iconElem.style.fill = 'white';
                        iconElem.style.color = 'white';
                        // Clean Progress if any exists (e.g. completed/archived)
                        // delete APP_STATE.progress[item.id]; 
                    } else if (isNowSaved) {
                        // Saved -> In Progress
                        APP_STATE.saved = APP_STATE.saved.filter(s => s.id !== item.id); // Remove from saved
                        APP_STATE.progress[item.id] = { status: 'in_progress', lastUpdated: new Date().toISOString(), currentStep: 0 };
                        iconElem.parentElement.innerHTML = ''; // Clear icon to replace
                        const newIcon = icon('bookmark', { style: 'fill:#10b981; color:#10b981;' });
                        btn.appendChild(newIcon);
                        // Show toast maybe? "Marked as In Progress"
                    } else {
                        // In Progress -> Empty
                        if (APP_STATE.progress[item.id]) delete APP_STATE.progress[item.id];
                        iconElem.style.fill = 'none';
                        iconElem.style.color = 'white';
                    }

                    // Persist
                    localStorage.setItem('aiRadar_saved', JSON.stringify(APP_STATE.saved));
                    localStorage.setItem('aiRadar_progress_v2', JSON.stringify(APP_STATE.progress));

                    // Force refresh button icon state for simplicity next click (or use robust UI state but this is MVP)
                    // Actually, let's just re-render the button content based on new state to be safe
                    const updatedState = getButtonState(item.id);
                    btn.innerHTML = '';
                    btn.appendChild(icon('bookmark', updatedState.style));
                },
                style: `background:rgba(255,255,255,0.08); border:none; color:white; width:44px; height:44px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center;`
            }, [icon('bookmark', getButtonState(item.id).style)])
        ])
    ]);

    function getButtonState(id) {
        if (APP_STATE.progress[id]?.status === 'in_progress') return { style: 'fill:#10b981; color:#10b981;' }; // Green for active
        if (APP_STATE.saved.some(s => s.id === id)) return { style: 'fill:white; color:white;' }; // White for saved
        return { style: '' }; // Outline default
    }

    // ... (rest of content) ...
    // Update Steps Header with ID for auto-scroll
    const stepsHeader = el('h3', { id: 'steps-section', style: 'font-size:20px; font-weight:800; margin-bottom:16px;' }, 'Nasıl Başlanır?');
    // Data Grid
    const dataGrid = el('div', { style: `display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:32px;` }, [
        ['Zorluk', item.difficulty, 'bar-chart-2', false],
        ['Potansiyel', item.revenuePotential, 'dollar-sign', true], // Premium Locked!
        ['Başlama', item.timeToStart, 'clock', false],
        ['Hedef Kitle', item.audience, 'users', false]
    ].map(([label, val, iconName, isPremium]) => {
        const isLocked = isPremium && !APP_STATE.user.premium;

        return el('div', {
            style: 'background:rgba(255,255,255,0.05); padding:16px; border-radius:16px; border:1px solid rgba(255,255,255,0.05); position:relative; overflow:hidden;',
            onclick: isLocked ? () => navigate('#/profile') : null
        }, [
            el('div', { style: 'display:flex; align-items:center; gap:6px; margin-bottom:6px; color:var(--text-muted); font-size:12px;' }, [
                icon(iconName, { style: 'width:14px;' }),
                el('span', {}, label)
            ]),
            el('div', {
                style: `font-weight:600; font-size:14px; color:white; ${isLocked ? 'filter:blur(4px); opacity:0.5; pointer-events:none;' : ''}`
            }, val),

            // Lock Overlay
            isLocked ? el('div', {
                style: 'position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.1);'
            }, [
                icon('lock', { style: 'width:16px; color:#fbbf24;' })
            ]) : null
        ]);
    }));
    // ...
    const stepsList = el('div', { style: 'margin-bottom:40px;' }, item.steps.map((step, idx) =>
        el('div', { style: 'display:flex; gap:16px; margin-bottom:20px;' }, [
            el('div', { style: 'width:28px; height:28px; background:rgba(255,255,255,0.1); border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; color:white; flex-shrink:0;' }, idx + 1),
            el('div', { style: 'flex:1;' }, [
                el('p', { style: 'font-size:15px; line-height:1.5; color:rgba(255,255,255,0.9); margin-top:2px;' }, step)
            ])
        ])
    ));

    // --- Story Section (New from snippet) ---
    let storySection = null;
    if (item.story) {
        storySection = el('div', { className: 'card', style: 'margin-top: 20px; background:rgba(255,255,255,0.05); padding:16px; border-radius:16px;' }, [
            el('div', { style: 'display: flex; align-items: center; gap: 12px; margin-bottom: 12px;' }, [
                el('img', {
                    src: item.story.image,
                    style: 'width: 48px; height: 48px; border-radius: 50%; object-fit: cover;'
                }),
                el('div', {}, [
                    el('h4', { style: 'font-weight:700;' }, item.story.person),
                    el('p', { style: 'font-size: 12px; color: var(--text-muted);' }, item.story.role)
                ])
            ]),
            el('p', { style: 'font-style: italic; color: var(--text-secondary); margin-bottom:8px;' },
                `"${item.story.quote}"`
            ),
            el('p', { style: 'color: var(--accent-primary); font-weight: 600;' },
                `💰 ${item.story.earnings}`
            )
        ]);
    }

    // --- Sticky Footer (Enhanced) ---
    const isCompleted = APP_STATE.completed.includes(item.id);
    const stickyFooter = el('div', {
        className: 'sticky-footer',
        style: 'position: sticky; bottom: 20px; z-index: 10; display:flex; gap:12px; padding-top:20px; background: linear-gradient(to top, var(--bg-main) 80%, transparent);'
    }, [
        // Like Button (Mini)
        el('button', {
            className: 'btn-secondary',
            style: `flex: 0 0 auto; width: 50px; padding: 0; background:${APP_STATE.user.likes.has(item.id) ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255,255,255,0.1)'}; color:${APP_STATE.user.likes.has(item.id) ? '#ec4899' : 'white'}; border:none; border-radius:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; height:50px;`,
            onclick: () => {
                Haptics.medium();
                if (APP_STATE.user.likes.has(item.id)) {
                    APP_STATE.user.likes.delete(item.id);
                } else {
                    APP_STATE.user.likes.add(item.id);
                    // alert('Beğenildi! +5 XP kazandın!'); // Less intrusive?
                }
                localStorage.setItem('aiRadar_likes', JSON.stringify(Array.from(APP_STATE.user.likes)));
                navigate(window.location.hash); // Re-render to update color
            }
        }, [icon('heart', { style: APP_STATE.user.likes.has(item.id) ? 'fill:currentColor' : '' })]),

        // Share Button (Medium)
        el('button', {
            className: 'btn-secondary',
            style: 'flex: 1; background:rgba(255,255,255,0.1); border:none; border-radius:12px; color:white; font-weight:600; cursor:pointer;',
            onclick: () => {
                document.body.appendChild(ShareModal(item));
            }
        }, 'Paylaş'),

        // Action Button (Large)
        el('button', {
            className: 'btn-primary',
            style: `flex: 2; background:var(--accent-primary); border:none; border-radius:12px; color:white; font-weight:700; cursor:pointer; box-shadow:0 10px 30px rgba(16, 185, 129, 0.3);`,
            onclick: () => {
                Haptics.success();
                if (!isCompleted) {
                    APP_STATE.completed.push(item.id);
                    localStorage.setItem('aiRadar_completed', JSON.stringify(APP_STATE.completed));
                    navigate('#/profile');
                }
            }
        }, isCompleted ? 'Tamamlandı 🎉' : 'Başla 🚀')
    ]);

    // Tools Section (Optional)
    let toolsSection = null;
    if (item.tools) {
        toolsSection = el('div', { style: 'margin-top: 24px; margin-bottom:24px;' }, [
            el('h3', { style: 'font-size:16px; font-weight:700; margin-bottom:12px;' }, 'Gerekli Araçlar'),
            el('div', { className: 'tools-grid', style: 'display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;' }, item.tools.map(tool =>
                el('div', { className: 'tool-item', style: 'background:rgba(255,255,255,0.05); padding:10px; border-radius:10px; display:flex; flex-direction:column; align-items:center; gap:8px; text-align:center;' }, [
                    el('div', { className: 'tool-icon' }, [icon(tool.icon, { style: 'width:20px; opacity:0.8;' })]),
                    el('span', { className: 'tool-name', style: 'font-size:11px; font-weight:600;' }, tool.name)
                ])
            ))
        ]);
    }

    // Assemble
    return el('div', {
        className: 'container page-detail',
        style: 'padding:20px; padding-bottom:40px; max-width:600px; margin:0 auto; min-height:100vh; position:relative;'
    }, [
        header,
        // AI Insight Card (Top Priority)
        el('div', { className: 'card insight-card', style: 'background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 16px; padding: 16px; margin-bottom: 24px;' }, [
            el('div', { className: 'insight-header', style: 'display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #a855f7;' }, [
                icon('bot', { style: 'width: 18px;' }),
                el('h3', { style: 'font-size: 14px; font-weight: 700;' }, 'AI Analizi')
            ]),
            el('p', { style: 'font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.9);' }, item.aiInsights.discussionExcerpt)
        ]),

        el('h1', { style: 'font-size:24px; font-weight:800; margin-bottom:16px; line-height:1.2;' }, item.title),
        dataGrid,
        storySection,
        toolsSection,
        stepsHeader,
        stepsList,
        stickyFooter
    ].filter(Boolean));
}
