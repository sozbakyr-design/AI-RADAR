
import { el } from '../utils/dom.js';


import { el } from '../utils/dom.js';

export function Ticker() {
    const messages = [
        { agent: 'GPT-4', text: 'Kripto trendlerini analiz ediyorum...', type: 'agent-1' },
        { agent: 'Claude', text: 'Yeni Micro-SaaS nişi tespit ettim!', type: 'agent-2' },
        { agent: 'Gemini', text: 'Sinyal gücü: %98', type: 'agent-3' },
        { agent: 'GPT-4', text: 'YouTube otomasyonu talebi artıyor...', type: 'agent-1' },
        { agent: 'Claude', text: '842 aktif ajan tarama yapıyor', type: 'agent-2' },
        { agent: 'Gemini', text: 'AI İç Tasarım sektöründe patlama!', type: 'agent-3' },
        { agent: 'GPT-4', text: 'Sesli reklam pazarı büyüyor...', type: 'agent-1' },
        { agent: 'Claude', text: 'Yeni fırsat: AI SEO içerik', type: 'agent-2' }
    ];

    // Create spans for messages
    const createMessageSpans = () => messages.map(m =>
        el('span', { className: `ticker-item ${m.type}`, style: 'margin-right: 40px;' }, [
            el('span', {}, '⚡ '),
            el('span', { style: 'font-weight: 800;' }, `${m.agent}: `),
            el('span', {}, m.text)
        ])
    );

    // Double content for seamless loop
    const allSpans = [...createMessageSpans(), ...createMessageSpans()];

    return el('div', { className: 'ticker-container' }, [
        el('div', { className: 'ticker-wrap' }, [
            el('div', { className: 'ticker-move' }, allSpans)
        ])
    ]);
}

