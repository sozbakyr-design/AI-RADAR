
import { opportunities } from '../data/mockData.js';

export function MakeMoneyPage(navigate) {
    const container = document.createElement('div');
    container.className = 'container page-list';

    const header = document.createElement('header');
    header.innerHTML = `<h1>Make Money</h1><p>High-growth income streams detected.</p>`;
    container.appendChild(header);

    const list = document.createElement('div');
    list.className = 'card-list';

    opportunities.forEach(opp => {
        const card = document.createElement('div');
        card.className = 'card item-card';
        card.style.cursor = 'pointer';
        card.onclick = () => navigate(`/detail?id=${opp.id}`);

        card.innerHTML = `
            <div class="card-header">
                <h3>${opp.title}</h3>
                <span class="badge">${opp.difficulty}</span>
            </div>
            <div class="card-body">
                <div class="row">
                    <i data-lucide="trending-up"></i>
                    <span>${opp.growth} demand</span>
                </div>
                <div class="row">
                    <i data-lucide="dollar-sign"></i>
                    <span>${opp.potential}</span>
                </div>
            </div>
        `;
        list.appendChild(card);
    });

    container.appendChild(list);
    return container;
}
