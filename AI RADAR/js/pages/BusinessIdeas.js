
import { ideas } from '../data/mockData.js';

export function IdeasPage(navigate) {
    const container = document.createElement('div');
    container.className = 'container page-list';

    container.innerHTML = `
        <header>
            <h1>Business Ideas</h1>
            <p>Problems needing solutions.</p>
        </header> 
    `;

    const list = document.createElement('div');
    list.className = 'card-list';

    ideas.forEach(idea => {
        const card = document.createElement('div');
        card.className = 'card item-card';
        card.style.cursor = 'pointer';
        card.onclick = () => navigate(`/detail?id=${idea.id}`);

        card.innerHTML = `
             <div class="card-header">
                <span class="badge gradient-text">MVP Idea</span>
            </div>
            <h3>${idea.solution}</h3>
            <p class="problem-text"><strong>Problem:</strong> ${idea.problem}</p>
        `;
        list.appendChild(card);
    });

    container.appendChild(list);

    return container;
}
