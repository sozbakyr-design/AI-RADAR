
import { el, icon } from '../utils/dom.js';
import { ShareCard } from './ShareCard.js'; // New

export function ShareModal(item, onClose) {
    const textToShare = `🚀 AI Radar'da harika bir fırsat buldum: "${item.title}"\n🔥 Trend Skoru: %${item.trendScore}\n\nDetaylar için: ${window.location.href}`;

    const overlay = el('div', {
        style: 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:10000; display:flex; align-items:flex-end; backdrop-filter:blur(5px); animation: fadeIn 0.2s ease; overflow-y:auto;'
    }, [
        el('div', {
            style: 'width:100%; background:#1e1b4b; border-radius: 24px 24px 0 0; padding:24px 20px 40px 20px; border-top:1px solid rgba(255,255,255,0.1); animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); max-height:90vh; overflow-y:auto;'
        }, [
            // Handle for visual affordance
            el('div', { style: 'width:40px; height:4px; background:rgba(255,255,255,0.2); border-radius:2px; margin:0 auto 20px;' }),

            el('h3', { style: 'font-size:18px; font-weight:700; color:white; margin-bottom:20px; text-align:center;' }, 'Fırsatı Paylaş'),

            // VISUAL CARD PREVIEW
            el('div', { style: 'margin-bottom:24px; pointer-events:none; transform:scale(0.95);' }, [ShareCard(item)]),

            // Instructions
            el('p', { style: 'text-align:center; font-size:12px; color:rgba(255,255,255,0.5); margin-bottom:24px;' }, 'Kartı paylaşmak için ekran görüntüsü alabilir veya aşağıdaki butonları kullanabilirsin.'),

            // Action Grid
            el('div', { style: 'display:grid; grid-template-columns:1fr 1fr; gap:12px;' }, [
                // Copy Link
                el('button', {
                    onclick: () => {
                        navigator.clipboard.writeText(textToShare);
                        alert('Link kopyalandı! 📋'); // Simple feedback
                        if (onClose) onClose();
                    },
                    style: 'background:rgba(255,255,255,0.1); border:none; padding:16px; border-radius:16px; color:white; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;'
                }, [icon('copy', { style: 'width:18px;' }), el('span', {}, 'Kopyala')]),

                // Native Share (if mobile)
                el('button', {
                    onclick: () => {
                        if (navigator.share) {
                            navigator.share({
                                title: 'AI Radar Fırsatı',
                                text: textToShare,
                                url: window.location.href
                            }).catch(console.error);
                        } else {
                            // Fallback
                            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}`, '_blank');
                        }
                        if (onClose) onClose();
                    },
                    style: 'background:var(--accent-primary); border:none; padding:16px; border-radius:16px; color:white; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;'
                }, [icon('share-2', { style: 'width:18px;' }), el('span', {}, 'Paylaş')])
            ]),

            // Close
            el('button', {
                onclick: () => {
                    overlay.remove();
                    if (onClose) onClose();
                },
                style: 'width:100%; margin-top:16px; padding:12px; background:transparent; border:none; color:rgba(255,255,255,0.5); font-weight:600; cursor:pointer;'
            }, 'İptal')
        ])
    ]);

    // Close on overlay click
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
            if (onClose) onClose();
        }
    };

    return overlay;
}
