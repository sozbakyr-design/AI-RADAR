/**
 * Secure DOM Element Creator
 * PREVENTS innerHTML usage entirely.
 * Updated: Text Support Added
 */
console.log('DOM Utils v2 Loaded');

export function el(tag, attributes = {}, children = []) {
    // 1. Create Element
    const element = document.createElement(tag);

    // 2. Set Attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'style') {
            // Safe style setting
            element.style.cssText = value;
        } else if (key.startsWith('on')) {
            // Event Listeners (Strict)
            // Convention: attributes.onclick = function
            const eventName = key.toLowerCase().substring(2);
            if (typeof value === 'function') {
                element.addEventListener(eventName, value);
            } else {
                console.warn(`Security Warning: Non-function passed to ${key}`);
            }
        } else if (key === 'className' || key === 'class') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dKey, dVal]) => {
                element.dataset[dKey] = dVal;
            });
        } else if (key === 'text' || key === 'innerText') {
            // Special handler for { text: '...' } used in components
            // Also supports innerText just in case
            if (value !== null && value !== undefined) {
                element.textContent = String(value);
            }
        } else {
            // Standard Attributes (SetAttribute sanitizes usually, but we prefer explicit properties where possible)
            if (value !== null && value !== undefined && value !== false) {
                element.setAttribute(key, value);
            }
        }
    });

    // Debug: Ensure we know when this runs
    // console.log('El created:', tag);

    // 3. Append Children (Recursively)
    // Supports: String, Number, Node, Array of nodes
    const appendChild = (child) => {
        if (child === null || child === undefined || child === false) return;

        if (Array.isArray(child)) {
            child.forEach(appendChild);
            return;
        }

        if (child instanceof Node) {
            element.appendChild(child);
            return;
        }

        // Text Content (Secure by default)
        const textNode = document.createTextNode(String(child));
        element.appendChild(textNode);
    };

    // If 'children' is not array, treat as single item
    if (!Array.isArray(children)) {
        appendChild(children);
    } else {
        children.forEach(appendChild);
    }

    return element;
}

// Icon Helper (Lucide) - Safe
export function icon(name, attrs = {}) {
    // Since we rely on lucide.createIcons(), we create the <i> element
    // <i data-lucide="name"></i>
    return el('i', {
        'data-lucide': name,
        ...attrs
    });
}
