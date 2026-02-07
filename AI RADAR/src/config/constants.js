
// Mock Data (Moved from bundled_app.js)
export const OPPORTUNITIES = [
    {
        id: '1',
        type: 'opportunity',
        category: 'money',
        title: 'Yüzsüz YouTube Otomasyonu',
        description: 'AI ajanları, yapay zeka video araçları için arama ilgisinde belirgin bir artış tespit etti.',
        trendScore: 98,
        difficulty: 'Orta',
        revenuePotential: '$2k-10k/ay',
        timeToStart: '2 Gün',
        audience: 'Yaratıcılar, İçe Dönükler',
        aiInsights: {
            confidence: 98,
            sources: ['TrendHunter', 'Google Trends'],
            discussionExcerpt: 'Ajanlar, bu ay "yapay zeka video oluşturucu" aramalarında %340\'lık bir artış tespit etti. Yüzsüz kanallar altın çağını yaşıyor.'
        },
        story: {
            person: 'Emre K.',
            role: 'Üniversite Öğrencisi',
            earnings: '$3,400/ay',
            quote: 'Sesimi veya yüzümü kullanmadan sadece Midjourney ve ElevenLabs ile tarih belgeselleri yaparak harçlığımı çıkardım.',
            image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100'
        },
        socialProof: { usersAttempting: 842, averageEarnings: '$3,200/ay' },
        tools: [
            { name: 'Midjourney', icon: 'palette' },
            { name: 'ElevenLabs', icon: 'mic' },
            { name: 'CapCut', icon: 'clapperboard' }
        ],
        steps: [
            'Niş alandaki rakipleri araştırın (En iyi 5 kanal)',
            'ChatGPT kullanarak senaryo yazın',
            'Midjourney ile görseller oluşturun',
            'ElevenLabs ile seslendirme yapın',
            'CapCut ile düzenleyip yayınlayın'
        ]
    },
    {
        id: '2',
        type: 'opportunity',
        category: 'money',
        title: 'AI Bülten Kürasyonu',
        description: 'Bunalmış profesyoneller, küratörlü özetlere abone oluyor.',
        trendScore: 92,
        difficulty: 'Düşük',
        revenuePotential: '$500-3k/ay',
        timeToStart: '1 Gün',
        audience: 'Yazarlar, Küratörler',
        aiInsights: {
            confidence: 92,
            sources: ['Substack', 'LinkedIn'],
            discussionExcerpt: 'AI küratörlü bültenlerin elde tutma oranları sektör ortalamasından %40 daha yüksek.'
        },
        story: {
            person: 'Selin Y.',
            role: 'Pazarlama Uzmanı',
            earnings: '$900/ay',
            quote: 'Her sabah LinkedIn haberlerini AI ile özetleyip 5 dakikada bültenime atıyorum. Sadık bir kitlem oluştu.',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
        },
        socialProof: { usersAttempting: 310, averageEarnings: '$1,150/ay' },
        tools: [
            { name: 'Beehiiv', icon: 'mail' },
            { name: 'Perplexity', icon: 'search' },
            { name: 'LinkedIn', icon: 'briefcase' }
        ],
        steps: [
            'Belirli bir sektör seçin (örn. Yasal AI)',
            'Beehiiv hesabı oluşturun',
            'Günlük haberleri bulmak için Perplexity kullanın',
            'En iyi 3 haberi AI ile özetleyin',
            'LinkedIn ağınızda başlatın'
        ]
    },
    {
        id: '3',
        type: 'trend',
        category: 'trends',
        title: 'Hobiler için Mikro-SaaS',
        description: 'Belirli topluluklar için küçük araçlar oluşturma (örn. örgü modelleri).',
        trendScore: 88,
        difficulty: 'Yüksek',
        revenuePotential: '$1k-50k/ay',
        timeToStart: '2-4 Hafta',
        audience: 'Geliştiriciler, Üreticiler',
        aiInsights: {
            confidence: 88,
            sources: ['ProductHunt', 'Reddit'],
            discussionExcerpt: 'Niş topluluklar hobi yönetimi için aktif olarak "basit araçlar" talep ediyor.'
        },
        story: {
            person: 'Caner D.',
            role: 'Indie Hacker',
            earnings: '$4,200/ay',
            quote: 'Sadece balıkçılar için hava durumunu analiz eden basit bir app yaptım. Niş kitle ödeme yapmaya çok istekli.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
        },
        socialProof: { usersAttempting: 125, averageEarnings: '$5,400/ay' },
        tools: [
            { name: 'Bubble', icon: 'zap' },
            { name: 'Stripe', icon: 'credit-card' }
        ],
        steps: [
            'Acı verici bir hobi problemini tanımlayın',
            'Reddit topluluklarında doğrulayın',
            'Bubble ile MVP oluşturun',
            'ProductHunt\'ta başlatın'
        ]
    },
    {
        id: '4',
        type: 'business',
        category: 'business',
        title: 'AI İç Mekan Tasarım Ajansı',
        description: 'Emlakçılar boş listeler için hızlı sanal evrelemeye ihtiyaç duyar.',
        trendScore: 95,
        difficulty: 'Orta',
        revenuePotential: '$4k-15k/ay',
        timeToStart: '1 Hafta',
        audience: 'Tasarımcılar, Emlakçılar',
        aiInsights: {
            confidence: 95,
            sources: ['Zillow', 'Houzz'],
            discussionExcerpt: 'Sanal evreleme, fiziksel evrelemeden %90 daha az maliyetli ve emlakçı adaptasyonu yüksek.'
        },
        story: {
            person: 'Zeynep A.',
            role: 'Grafik Tasarımcı',
            earnings: '$2,500/proje',
            quote: 'Emlakçılara boş daire fotoğraflarını mobilyalı hale getirmeyi teklif ettim. InteriorAI ile saniyeler sürüyor.',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
        },
        socialProof: { usersAttempting: 450, averageEarnings: '$6,200/ay' },
        tools: [
            { name: 'InteriorAI', icon: 'home' },
            { name: 'Canva', icon: 'palette' }
        ],
        steps: [
            'Öncesi/sonrası portföyü oluşturun',
            'Yerel emlakçılara soğuk e-posta atın',
            'İlk odayı ücretsiz sunun',
            'Serbest editörlerle ölçeklendirin'
        ]
    },
    {
        id: '5',
        type: 'opportunity',
        category: 'money',
        title: 'AI Seslendirme Ajansı',
        description: 'Yerel işletmeler için profesyonel seslendirme ve reklam prodüksiyonu.',
        trendScore: 89,
        difficulty: 'Düşük',
        revenuePotential: '$1k-5k/ay',
        timeToStart: '2 Gün',
        audience: 'Serbest Çalışanlar',
        aiInsights: {
            confidence: 89,
            sources: ['Fiverr', 'Upwork'],
            discussionExcerpt: 'Seslendirmeli yerel reklamlar 3 kat daha yüksek dönüşüme sahip; AI hızlı A/B testi sağlar.'
        },
        story: {
            person: 'Mert T.',
            role: 'Ses Mühendisi',
            earnings: '$1,200/hafta',
            quote: 'Yerel radyolara reklam cıngılları yapıyorum. ElevenLabs ile stüdyo maliyetim sıfıra indi.',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
        },
        socialProof: { usersAttempting: 215, averageEarnings: '$1,800/ay' },
        tools: [
            { name: 'ElevenLabs', icon: 'mic' },
            { name: 'Audacity', icon: 'headphones' }
        ],
        steps: [
            'Niş belirleyin (E-ticaret reklamları)',
            'ElevenLabs ile demo oluşturun',
            'İşletmelere soğuk e-posta atın',
            'Revizyon sürecini yönetin'
        ]
    },
    {
        id: '6',
        type: 'trend',
        category: 'trends',
        title: 'Özel AI Chatbot Geliştirme',
        description: 'Şirket verileriyle eğitilmiş özel destek botları oluşturma.',
        trendScore: 99,
        difficulty: 'Orta',
        revenuePotential: '$3k-20k/ay',
        timeToStart: '1 Hafta',
        audience: 'Geliştiriciler, Ajanslar',
        aiInsights: {
            confidence: 99,
            sources: ['Gartner', 'TechCrunch'],
            discussionExcerpt: 'Ajanlar, bu botları kullanan KOBİ\'ler için destek yanıt süresinde %80 azalma tespit etti.'
        },
        story: {
            person: 'Deniz K.',
            role: 'Yazılımcı',
            earnings: '$15k/proje',
            quote: 'Hukuk büroları için eski dava dosyalarını tarayan bir bot yazdım. Tek seferde kurulum ücreti alıyorum.',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100'
        },
        socialProof: { usersAttempting: 680, averageEarnings: '$8,500/ay' },
        tools: [
            { name: 'Chatbase', icon: 'message-square' },
            { name: 'Zapier', icon: 'zap' }
        ],
        steps: [
            'Şirket web sitesini analiz edin',
            'Chatbase ile belgeleri eğitin',
            'Web sitesine entegre edin',
            'Lead oluşturma akışını kurun'
        ]
    }
];


// Safe JSON Parse Helper
function safeJSONParse(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.warn(`Error parsing ${key} from localStorage, resetting.`, e);
        return fallback;
    }
}

export const GAMIFICATION_CONFIG = {
    xpPerLike: 5,
    xpPerRead: 10,
    levels: [0, 100, 300, 600, 1000, 2000], // Level 1 starts at 0, Level 2 at 100...
    titles: [
        { minXp: 0, label: 'Meraklı Gözlemci', icon: 'search' },
        { minXp: 100, label: 'Trend Avcısı', icon: 'crosshair' },
        { minXp: 300, label: 'Fırsat Dedektifi', icon: 'zap' },
        { minXp: 600, label: 'Gelecek Vizyoneri', icon: 'eye' },
        { minXp: 1000, label: 'AI Ustası', icon: 'cpu' },
        { minXp: 2000, label: 'Radar Kahini', icon: 'sun' }
    ],
    badges: [
        { id: 'first_step', label: 'İlk Adım', icon: 'flag', description: 'İlk fırsatı inceledin', condition: (user) => user.viewed.size >= 1 },
        { id: 'liker', label: 'Beğeni Uzmanı', icon: 'heart', description: '5 fırsatı beğendin', condition: (user) => user.likes.size >= 5 },
        { id: 'streak_3', label: 'Ateşli Seri', icon: 'flame', description: '3 gün üst üste geldin', condition: (user) => user.streak >= 3 },
        { id: 'collector', label: 'Koleksiyoncu', icon: 'bookmark', description: '3 fırsatı kaydettin', condition: (user) => user.stats.saved >= 3 },
        { id: 'early_bird', label: 'Erkenci Kuş', icon: 'sunrise', description: 'Sabah 09:00 öncesi giriş', condition: () => false } // Manuel logic required usually, keeping simple for now
    ]
};

// Helper: Get Opportunity of the Day (Rotates based on date)
export function getDailyOpportunity() {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % OPPORTUNITIES.length;
    return OPPORTUNITIES[index];
}

export const APP_STATE = {
    user: {
        name: 'Alex',
        premium: false,
        interests: safeJSONParse('aiRadar_interests', []), // ['tech', 'business']
        xp: parseInt(localStorage.getItem('aiRadar_xp')) || 0,
        level: parseInt(localStorage.getItem('aiRadar_level')) || 1,
        streak: parseInt(localStorage.getItem('aiRadar_streak')) || 0,
        likes: new Set(safeJSONParse('aiRadar_likes', [])),
        stats: {
            scanned: 142,
            saved: 4
        },
        viewed: new Set()
    },
    aiAnalytics: {
        activeAgents: 842,
        networkLoad: 'OPTIMAL'
    },
    lastViewedId: localStorage.getItem('aiRadar_lastViewedId') || null,

    // Retention Upgrade: Enhanced Progress Tracking
    // Structure: { [id]: { status: 'saved' | 'in_progress' | 'completed', lastUpdated: ISOString, currentStep: 0 } }
    progress: safeJSONParse('aiRadar_progress_v2', {}),

    // Legacy backwards compatibility (will migrate on save)
    completed: safeJSONParse('aiRadar_completed', []),
    saved: safeJSONParse('aiRadar_saved', []),

    session: {
        earningsCount: 0
    },
    opportunities: OPPORTUNITIES
};
