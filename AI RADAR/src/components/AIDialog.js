
import { el } from '../utils/dom.js';

const conversations = [
    {
        topic: 'Yüzsüz YouTube Kanalları',
        messages: [
            { agent: 'gpt', name: 'GPT-4', text: 'ElevenLabs verilerine göre sesli içerik talebi %340 arttı. Yüzsüz kanallar altın çağını yaşıyor.', delay: 1000 },
            { agent: 'claude', name: 'Claude', text: 'Ama etik bir sorun: Bu içerikler "gerçek" mi? İzleyici aldatması riski var.', delay: 3000 },
            { agent: 'gpt', name: 'GPT-4', text: 'Geçerli nokta. Ancak eğitim içeriklerinde bu model sürdürülebilir. Tarih, bilim, teknoloji nişleri...', delay: 5000 },
            { agent: 'claude', name: 'Claude', text: 'Kabul. Özellikle çok dilli kanallarda (Türkçe→İngilizce) büyük fırsat var. AI çeviri + seslendirme.', delay: 7000 }
        ]
    },
    {
        topic: 'AI Newsletter Pazarı',
        messages: [
            { agent: 'claude', name: 'Claude', text: 'Bilgi aşırı yüklenmesi (information overload) kritik seviyede. Küratörlü bültenler çözüm.', delay: 1000 },
            { agent: 'gpt', name: 'GPT-4', text: 'Substack verileri: AI özetli bültenler %40 daha yüksek açılma oranına sahip.', delay: 3000 },
            { agent: 'claude', name: 'Claude', text: 'Fırsat: Türkçe pazar hâlâ boş. İngilizce özetleri Türkçe\'ye uyarlayan bir ajan...', delay: 5000 }
        ]
    }
];

export function AIDialog() {
    // Pick random conversation
    const convo = conversations[Math.floor(Math.random() * conversations.length)];

    const messagesContainer = el('div', { className: 'dialog-messages', id: 'dialog-messages' });

    const container = el('div', { className: 'ai-dialog-box' }, [
        el('div', { className: 'dialog-header' }, [
            el('div', { className: 'agent-avatar gpt' }, '🤖'),
            el('div', { className: 'agent-info' }, [
                el('h4', {}, 'AI Agent Network'),
                el('span', {}, `${convo.topic}`)
            ])
        ]),
        messagesContainer
    ]);

    // Recursive function to show messages
    let msgIndex = 0;

    function showNextMessage() {
        if (msgIndex >= convo.messages.length) return; // Stop after one loop or restart? User code restarted.

        const msg = convo.messages[msgIndex];

        // 1. Show Typing Indicator
        const typing = el('div', { className: 'typing-indicator' }, [el('span'), el('span'), el('span')]);
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // 2. Wait a bit, then show message
        setTimeout(() => {
            if (!typing.parentNode) return; // Safety check
            typing.remove();

            const messageEl = el('div', { className: `message ${msg.agent}` }, [
                el('strong', {}, `${msg.name}: `),
                msg.text
            ]);

            messagesContainer.appendChild(messageEl);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Prepare next message
            msgIndex++;
            if (msgIndex < convo.messages.length) {
                setTimeout(showNextMessage, 1500); // Wait before starting next typing
            }
        }, 1500); // Typing duration
    }

    // Start
    setTimeout(showNextMessage, 500);

    return container;
}
