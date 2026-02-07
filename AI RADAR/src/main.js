
// GLOBAL ERROR HANDLER (For debugging blank screens)
window.onerror = function (msg, url, line, col, error) {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = `<div style="color:red; padding:20px;">
            <h3>Yükleme Hatası</h3>
            <p>${msg}</p>
            <p>File: ${url}:${line}:${col}</p>
        </div>`;
    }
    console.error('Global Error:', error);
    return false;
};

import { APP_STATE } from './config/constants.js';
import { HashRouter } from './utils/router.js';
import { getClient, initSupabase } from './supabase/client.js';
import { API } from './supabase/api.js';
import { el } from './utils/dom.js';
import { initAnalytics } from './utils/analytics.js';
import { SEO } from './utils/seo.js';
import { NotificationManager } from './managers/NotificationManager.js';
import { OpportunityService } from './services/OpportunityService.js';

// Components
import { renderLayout } from './components/layout.js';
import { HomePage } from './pages/Home.js';
import { ExplorePage } from './pages/Explore.js';
import { SavedPage } from './pages/Saved.js';
import { ProfilePage } from './pages/Profile.js';
import { DetailPage } from './pages/Detail.js';
import { AuthPage } from './pages/Auth.js';
import { LegalPage } from './pages/Legal.js';
import { WeeklyPage } from './pages/Weekly.js';
import { AdminPage } from './pages/Admin.js';
import { ListPage } from './pages/List.js';
import { OnboardingModal } from './components/Onboarding.js';
import { Walkthrough } from './components/Walkthrough.js';

// --- Initialization ---

// 1. Init Features
const supabase = initSupabase();
initAnalytics();
NotificationManager.init();

// Fetch Data & Init
(async () => {
    try {
        APP_STATE.opportunities = await OpportunityService.getAll();
    } catch (e) {
        console.error('Data Load Error:', e);
    }
    if (window.router) window.router.render(window.location.hash);
})();

// Auth State Helper
window.appState = APP_STATE; // Sync global state ref
window.appState.session = null;

async function initSession() {
    if (!supabase) return;

    const { data: { session } } = await supabase.auth.getSession();
    handleSession(session);

    supabase.auth.onAuthStateChange((_event, session) => {
        handleSession(session);
    });
}

async function handleSession(session) {
    console.log('Session Update:', session?.user?.email);
    window.appState.session = session;

    if (session?.user) {
        // Sync Profile from DB
        const profile = await API.getProfile(session.user.id);
        if (profile) {
            // Update local state with DB source of truth
            window.appState.user.name = profile.full_name || session.user.email.split('@')[0];
            window.appState.user.xp = profile.xp || 0;
            window.appState.user.level = profile.level || 1;
            window.appState.user.streak = profile.streak || 0;
            // Sync local storage as backup/cache
            localStorage.setItem('aiRadar_xp', profile.xp);
            localStorage.setItem('aiRadar_streak', profile.streak);
        } else {
            // First time? Create profile if not exists (handled partly by triggers or here)
            // For now, relies on SignUp options or manual sync events.
        }
    } else {
        // Guest / Logout
        // Optional: clear user specific data from state?
    }

    // Trigger re-render if needed (Router handles most, but header might need update)
    if (window.updateLayoutAuth) window.updateLayoutAuth();
}

initSession();


// 2. Define Routes
const routes = {
    '#/': HomePage,
    '#home': HomePage,
    '#explore': ExplorePage,
    '#saved': SavedPage,
    '#profile': ProfilePage,
    '#detail': DetailPage,
    '#login': (nav) => AuthPage(nav, 'login'),
    '#signup': (nav) => AuthPage(nav, 'signup'),
    '#privacy': (nav) => LegalPage(nav, 'privacy'),
    '#terms': (nav) => LegalPage(nav, 'terms'),
    '#weekly': WeeklyPage,
    '#admin': AdminPage,

    // Dynamic lists mapped manually in router callback or wrapper below
    '#money': (nav) => ListPage(nav, 'money'),
    '#trends': (nav) => ListPage(nav, 'trends'),
    '#opportunities': (nav) => ListPage(nav, 'business'),
};

// 3. Render Logic
function render(hash) {
    const app = document.getElementById('app');
    if (!app) return;

    // Secure Clear
    while (app.firstChild) app.removeChild(app.firstChild);

    try {
        const router = window.router;
        const { key, Component } = router.getCurrentRoute();

        let PageComponent = Component;

        // Fallback for list pages if not in direct map
        if (!PageComponent) {
            if (key === '#money') PageComponent = (nav) => ListPage(nav, 'money');
            else if (key === '#trends') PageComponent = (nav) => ListPage(nav, 'trends');
            else if (key === '#opportunities') PageComponent = (nav) => ListPage(nav, 'business');
            else PageComponent = HomePage; // 404 handling -> Home
        }

        console.log('Routing to:', key);

        // SEO Update
        const seoMap = {
            '#/': { title: 'Ana Sayfa', desc: 'Günün AI fırsatlarını keşfet.' },
            '#explore': { title: 'Keşfet', desc: 'Tüm kategorilerde yapay zeka trendleri.' },
            '#saved': { title: 'Kaydedilenler', desc: 'Favori fikirlerin.' },
            '#profile': { title: 'Profil', desc: 'İlerlemeni takip et.' },
            '#login': { title: 'Giriş Yap', desc: 'Hesabına eriş.' },
            '#signup': { title: 'Kayıt Ol', desc: 'AI Radar\'a katıl.' }
        };
        // For detail pages, we might need dynamic titles (handled inside page or here if data available)
        SEO.update(seoMap[key] || {});

        // Render Page
        const pageNode = PageComponent(router.navigate);

        // Wrap in Layout (EXCEPT Auth Pages)
        if (key === '#login' || key === '#signup') {
            app.appendChild(pageNode);
        } else {
            const layoutNode = renderLayout(pageNode, router.navigate, key);
            app.appendChild(layoutNode);
        }

        // Onboarding Check (Skip if on Auth)
        if (key !== '#login' && key !== '#signup') {
            if (APP_STATE.user.interests.length === 0) {
                // Check if we should force onboarding? 
                // For now, let's allow browsing but maybe prompt?
                // Existing logic:
                // Chain: Walkthrough -> Onboarding -> Render
                const showOnboarding = () => {
                    const onboardingNode = OnboardingModal(() => {
                        render(key);
                    });
                    app.appendChild(onboardingNode);
                };

                const walkthroughNode = Walkthrough(() => {
                    // Check if we need Interest Onboarding
                    if (APP_STATE.user.interests.length === 0) {
                        showOnboarding();
                    }
                });

                if (walkthroughNode) {
                    app.appendChild(walkthroughNode);
                } else {
                    // Walkthrough already seen, show onboarding immediately
                    showOnboarding();
                }
            } else {
                // Gamification Check (Only if onboarded)
                import('./utils/gamification.js').then(({ checkLoginStreak, RewardModal }) => {
                    const result = checkLoginStreak();
                    if (result.isNewLogin) {
                        // XP added in checkLoginStreak, now sync to DB?
                        // checkLoginStreak handles local, we need to ensure it syncs too.

                        // Show Modal
                        const modal = RewardModal(result, () => {
                            const xpDisplay = document.getElementById('xp-display');
                            if (xpDisplay) xpDisplay.textContent = `${APP_STATE.user.xp} XP`;
                        });
                        app.appendChild(modal);
                    }
                });
            }
        }

        // Re-init Icons (Lucide)
        if (window.lucide) window.lucide.createIcons();

    } catch (e) {
        console.error('Render Error:', e);
        // Secure Error Display
        app.appendChild(el('div', { style: 'color:red; padding:20px; text-align:center;' }, [
            el('h3', {}, 'Uygulama Hatası'),
            el('p', {}, 'Bir şeyler ters gitti.'),
            el('button', { onclick: () => window.location.reload() }, 'Yenile')
        ]));
    }
}

// 4. Start Router
const router = new HashRouter(routes, render);
window.router = router; // Global ref

// Initial Render
render(window.location.hash);
