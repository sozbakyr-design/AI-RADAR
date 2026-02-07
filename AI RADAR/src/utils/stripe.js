
// Stripe Payment Configuration

// TODO: Replace with actual Stripe Payment Link URLs from your Dashboard
const STRIPE_CONFIG = {
    starter: {
        id: 'price_starter_mock',
        link: 'https://buy.stripe.com/test_starter', // Example
        label: 'Başlangıç Paketi'
    },
    pro: {
        id: 'price_pro_mock',
        link: 'https://buy.stripe.com/test_pro',
        label: 'Pro Plan'
    },
    lifetime: {
        id: 'price_lifetime_mock',
        link: 'https://buy.stripe.com/test_lifetime',
        label: 'Ömür Boyu Erişim'
    }
};

export async function redirectToCheckout(plan) {
    const config = STRIPE_CONFIG[plan];

    // 1. Validation
    if (!config) {
        console.error('Invalid plan selected:', plan);
        alert('Geçersiz ödeme planı.');
        return;
    }

    // 2. Client-Side Auth Check
    const user = window.appState?.user;
    const session = window.appState?.session;

    if (!user || !session) {
        // Option A: Force Login
        if (confirm(`"${config.label}" satın almak için giriş yapmalısınız. Giriş sayfasına git?`)) {
            window.appNavigate('#login');
        }
        return;
    }

    // 3. Analytics Tracking
    if (window.gtag) {
        window.gtag('event', 'begin_checkout', {
            currency: 'USD',
            value: 29.00, // Dynamic based on plan
            items: [{ item_id: config.id, item_name: config.label }]
        });
    }

    // 4. Redirect
    console.log(`Redirecting to Stripe: ${config.link}`);
    // Append client_reference_id to track which user paid
    const finalUrl = `${config.link}?client_reference_id=${session.user.id}&prefilled_email=${session.user.email}`;

    window.open(finalUrl, '_blank');
}
