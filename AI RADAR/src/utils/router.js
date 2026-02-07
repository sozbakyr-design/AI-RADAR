
export class HashRouter {
    constructor(routes, renderCallback) {
        this.routes = routes;
        this.renderCallback = renderCallback;
        this.currentState = { path: window.location.hash || '#/' };

        // Bind methods
        this.navigate = this.navigate.bind(this);
        this.handleHashChange = this.handleHashChange.bind(this);

        // Init
        window.addEventListener('hashchange', this.handleHashChange);
        window.appNavigate = this.navigate; // Global Helper
    }

    navigate(path) {
        // Fallback or Normalize
        if (!path.startsWith('#') && !path.startsWith('http')) {
            if (path === '/') path = '#/';
            else path = '#' + path;
        }

        if (path.includes('?')) {
            const [base, params] = path.split('?');
            const cleanBase = base.replace('#', '');
            window.location.hash = `${cleanBase}?${params}`;
        } else {
            window.location.hash = path;
        }

        this.currentState.path = window.location.hash;
    }

    handleHashChange() {
        let hash = window.location.hash || '#/';
        if (hash === '' || hash === '#') hash = '#/';

        this.currentState.path = hash;

        // Callback to trigger re-render
        if (this.renderCallback) this.renderCallback(hash);
    }

    getCurrentRoute() {
        let hash = window.location.hash || '#/';
        if (hash === '' || hash === '#') hash = '#/';

        const routeKey = hash.split('?')[0];
        const queryParams = hash.split('?')[1];

        // Search Param Polyfill
        if (queryParams) {
            window.currentParams = new URLSearchParams(queryParams);
        } else {
            window.currentParams = new URLSearchParams('');
        }

        return {
            key: routeKey,
            params: queryParams,
            Component: this.routes[routeKey] || this.routes['#/']
        };
    }
}
