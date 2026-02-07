
import { userProfile } from '../data/mockData.js';

export function ProfilePage() {
    const container = document.createElement('div');
    container.className = 'container page-profile';

    container.innerHTML = `
        <div class="profile-header">
            <div class="avatar">
                <i data-lucide="user"></i>
            </div>
            <h2>${userProfile.name}</h2>
            <span class="badge ${userProfile.premium ? 'gold' : ''}">
                ${userProfile.premium ? 'Premium Agent' : 'Free Plan'}
            </span>
        </div>

        <div class="card upgrade-card">
            <h3>Unlock Deep Insights</h3>
            <p>Get full access to AI agent analysis and step-by-step guides.</p>
            <button class="btn-primary">Upgrade to Pro</button>
        </div>

        <div class="settings-list">
            <div class="setting-item">
                <span>Notifications</span>
                <i data-lucide="chevron-right"></i>
            </div>
            <div class="setting-item">
                <span>Saved Items</span>
                <i data-lucide="chevron-right"></i>
            </div>
        </div>
    `;

    return container;
}
