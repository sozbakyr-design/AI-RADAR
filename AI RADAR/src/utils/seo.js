
// SEO Helper: Manages document title and meta tags

const DEFAULT_TITLE = 'AI Radar - Yapay Zeka Fırsatlarını Keşfet';
const DEFAULT_DESC = 'Yapay zeka odaklı iş fikirlerini, gelir fırsatlarını ve trendleri keşfedin. Günlük AI analizleri ve içgörüler.';

export const SEO = {
    update(config = {}) {
        const { title, description } = config;

        // 1. Update Title
        document.title = title ? `${title} | AI Radar` : DEFAULT_TITLE;

        // 2. Update Description
        this.setMeta('description', description || DEFAULT_DESC);

        // 3. Open Graph (Social Sharing)
        this.setMeta('og:title', document.title);
        this.setMeta('og:description', description || DEFAULT_DESC);

        // 4. Apple Mobile Web App Title
        this.setMeta('apple-mobile-web-app-title', 'AI Radar');
    },

    setMeta(name, content) {
        let element = document.querySelector(`meta[name="${name}"]`);
        if (!element) {
            // Check property for OG tags
            element = document.querySelector(`meta[property="${name}"]`);
        }

        if (!element) {
            element = document.createElement('meta');
            if (name.startsWith('og:')) {
                element.setAttribute('property', name);
            } else {
                element.setAttribute('name', name);
            }
            document.head.appendChild(element);
        }

        element.setAttribute('content', content);
    }
};
