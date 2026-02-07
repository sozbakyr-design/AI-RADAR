
// Analytics Helper

export function initAnalytics() {
    // GA4 Initialization (Mock for now, would inject script tag here)
    if (!window.dataLayer) {
        window.dataLayer = [];
    }

    // Helper to push to dataLayer
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-XXXXXXXXXX'); // Replace with real ID

    console.log('Analytics Initialized');
}

export function trackEvent(eventName, params = {}) {
    console.log(`[Analytics] ${eventName}`, params);
    if (window.gtag) {
        window.gtag('event', eventName, params);
    }
    // Also track to Supabase if needed
}

export function trackRetentionEvent(action, label) {
    console.log(`[Analytics] Retention Event: ${action}`, { label });
    if (window.gtag) {
        window.gtag('event', 'retention_action', {
            action: action,
            label: label,
            timestamp: new Date().toISOString()
        });
    }
    // Also track to Supabase if needed
}
