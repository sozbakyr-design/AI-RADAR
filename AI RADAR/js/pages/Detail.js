
import { opportunities, trends, ideas } from '../data/mockData.js';

export function DetailPage() {
    // Parse ID from invalid-but-working "query param" style stored in potential window state or URL
    // For this simple router without history API, we can use a custom approach or just rely on a global "currentItem" or url params if we were using real URLs.
    // Let's assume the router passes the params or we read from window.location.search if we were using pushState.
    // simpler: look at window.location.hash or a global variable.

    // BUT since my app.js "navigate" just updates state, I need to pass the ID.
    // I will refactor app.js slightly to support params, OR just read from a temporary global for this MVP.
    // Let's use `window.history.state` if we were using it, but my router is memory-based.

    // Hack for MVP memory router:
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    // Find item
    const item = [...opportunities, ...trends, ...ideas].find(i => i.id === id || i.id === id); // loose match

    const container = document.createElement('div');
    container.className = 'container page-detail';

    if (!item) {
        container.innerHTML = `<p>Item not found.</p><button onclick="window.history.back()">Go Back</button>`;
        return container;
    }

    container.innerHTML = `
        <header class="detail-header">
            <button class="back-btn"><i data-lucide="arrow-left"></i></button>
            <span class="badge detail-badge">${item.category || item.sentiment || 'Idea'}</span>
        </header>

        <h1 class="detail-title">${item.title || item.name || item.solution}</h1>

        <div class="card insight-card">
            <div class="insight-header">
                <i data-lucide="bot" class="agent-icon"></i>
                <h3>AI Agent Analysis</h3>
            </div>
            <p>${item.agentInsight || item.description || item.problem}</p>
        </div>

        <div class="stats-grid">
            <div class="stat-box">
                <span class="label">Growth/Vol</span>
                <span class="val">${item.growth || item.volume || 'N/A'}</span>
            </div>
             <div class="stat-box">
                <span class="label">Potential</span>
                <span class="val">${item.potential || 'High'}</span>
            </div>
        </div>

        <section class="action-plan">
            <h2>5-Step Execution Plan</h2>
            <ul class="steps-list">
                <li class="step">
                    <span class="step-num">01</span>
                    <p>Research the top 3 competitors in this specific niche.</p>
                </li>
                <li class="step">
                    <span class="step-num">02</span>
                    <p>Set up a landing page using low-code tools.</p>
                </li>
                <li class="step">
                    <span class="step-num">03</span>
                    <p>Run a $50 ad test to validate demand.</p>
                </li>
                 <li class="step">
                    <span class="step-num">04</span>
                    <p>Collect email leads and offer a free lead magnet.</p>
                </li>
                 <li class="step">
                    <span class="step-num">05</span>
                    <p>Launch MVP to the email list.</p>
                </li>
            </ul>
        </section>

        <div class="sticky-footer">
            <button class="btn-primary">Launch This Project</button>
        </div>
    `;

    // Bind Back Button
    container.querySelector('.back-btn').onclick = () => {
        // This relies on the global navigate which we haven't exposed to the component nicely yet inside this file 
        // OR we can just dispatch a custom event
        window.history.back(); // won't work perfectly with memory router
        // Dispatch event for app.js to catch
        document.dispatchEvent(new CustomEvent('navigate', { detail: '/' }));
    };

    return container;
}
