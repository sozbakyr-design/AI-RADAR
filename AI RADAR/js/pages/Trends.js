
import { trends } from '../data/mockData.js';

export function TrendsPage(navigate) {
    const container = document.createElement('div');
    container.className = 'container page-list';

    container.innerHTML = `
        <header>
            <h1>Market Trends</h1>
            <p>What's capturing attention right now.</p>
        </header> 
    `;

    const list = document.createElement('div');
    list.className = 'card-list';

    trends.forEach(trend => {
        const card = document.createElement('div');
        card.className = 'card item-card';
        card.style.cursor = 'pointer';
        card.onclick = () => navigate(`/detail?id=${trend.id}`);

        card.innerHTML = `
             <div class="card-header">
                <h3>${trend.name}</h3>
            </div>
            <p>${trend.description}</p>
        `;
        list.appendChild(card);
    });

    container.appendChild(list);

    return container;
}
