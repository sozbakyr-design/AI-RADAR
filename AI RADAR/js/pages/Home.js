
import { opportunities } from '../data/mockData.js';

export function HomePage(navigate) {
    const container = document.createElement('div');
    container.className = 'container page-home';

    // Top Opportunity
    const topOpp = opportunities[0];

    // Helper to create elements with events
    const createEl = (html) => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.firstElementChild;
    };

    const header = createEl(`
        <header class="home-header">
            <p class="greeting">Good Morning, Alex</p>
            <h1>AI Radar Active <i data-lucide="activity" class="inline-icon"></i></h1>
        </header>
    `);

    // Highlight Card
    const highlightSection = document.createElement('section');
    highlightSection.className = 'daily-opp';
    const highlightHTML = `
        <div>
            <div class="section-header">
                <h2>Daily Top Pick</h2>
                <span class="badge">98% Match</span>
            </div>
            <div class="card highlight-card" style="cursor:pointer">
                <h3>${topOpp.title}</h3>
                <div class="stats-row">
                    <div class="stat">
                        <span class="label">Growth</span>
                        <span class="value success">${topOpp.growth}</span>
                    </div>
                    <div class="stat">
                        <span class="label">Potential</span>
                        <span class="value">${topOpp.potential}</span>
                    </div>
                </div>
                <p class="insight">
                    <i data-lucide="bot"></i> 
                    ${topOpp.agentInsight}
                </p>
                <button class="btn-primary" style="margin-top: 12px; pointer-events: none;">View Strategy</button>
            </div>
        </div>
    `;
    const highlightNode = createEl(highlightHTML);
    // Attach click to the card
    highlightNode.querySelector('.highlight-card').onclick = () => navigate(`/detail?id=${topOpp.id}`);
    highlightSection.appendChild(highlightNode);


    // Quick Actions
    const quickSection = document.createElement('section');
    quickSection.className = 'quick-links';

    const quickHTML = `
        <div>
             <h2>Quick Actions</h2>
             <div class="grid-2">
                <div class="card action-card" id="btn-scan" style="cursor:pointer">
                    <i data-lucide="search"></i>
                    <span>Scan Market</span>
                </div>
                <div class="card action-card" style="cursor:pointer">
                    <i data-lucide="bookmark"></i>
                    <span>Saved</span>
                </div>
             </div>
        </div>
    `;
    const quickNode = createEl(quickHTML);
    quickNode.querySelector('#btn-scan').onclick = () => navigate('/trends'); // Scan goes to trends
    quickSection.appendChild(quickNode);


    container.appendChild(header);
    container.appendChild(highlightSection);
    container.appendChild(quickSection);

    return container;
}
