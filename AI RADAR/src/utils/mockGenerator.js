
// Mock Data Generator for "Soul Injection"

// 1. Deterministic Random (Seeded by Item ID)
// Ensures the same item always has the same stats for this user/session
function seededRandom(seedStr) {
    if (!seedStr) return Math.random();
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
}

// 2. Generate Social Stats for an Opportunity
export function getSocialStats(itemId) {
    // Check if we have real overrides (e.g. user liked it)
    // For now we mix determinstic mock data with real user state

    const rnd = seededRandom(itemId);

    // Weighted logic: Some items are "Viral" (top 20%)
    const isViral = rnd > 0.8;

    // View Count: 1,000 - 5,000 normally. Viral: 10,000+
    let baseViews = 1200 + Math.floor(rnd * 3800);
    if (isViral) baseViews += 5000 + Math.floor(rnd * 10000);

    // Like Ratio: 4% - 12%
    const likeRatio = 0.04 + (rnd * 0.08);
    const likes = Math.floor(baseViews * likeRatio);

    // "Active Now" (Fake Live Users): 2 - 45
    const activeNow = 2 + Math.floor(Math.random() * 43); // This can be random each call to feel "live"

    return {
        views: baseViews,
        likes: likes,
        activeNow: activeNow,
        isViral: isViral,
        isTrending: likes > 300,
        badges: isViral ? ['🔥 TREND', '⭐ TOP %10'] : (likes > 300 ? ['🔥 POPÜLER'] : [])
    };
}

// 3. System Stats (Global)
export function getSystemStats() {
    return {
        onlineUsers: 140 + Math.floor(Math.random() * 80), // 140-220 users online
        trendsDiscoveredToday: 1842
    };
}

// 4. Daily Timer Logic
export function getDailyCountdown() {
    const now = new Date();
    // Goal: Next 09:00 AM
    let goal = new Date();
    goal.setHours(9, 0, 0, 0);

    if (now > goal) {
        // If it's 10AM, goal is tomorrow 9AM
        goal.setDate(goal.getDate() + 1);
    }

    const diff = goal - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return {
        hours,
        minutes,
        fullText: `${hours}s ${minutes}dk`
    };
}
