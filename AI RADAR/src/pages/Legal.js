import { el, icon } from '../utils/dom.js';

export function LegalPage(navigate, type = 'privacy') {
    const isPrivacy = type === 'privacy';

    // Check back logic
    const goBack = () => navigate('#profile');

    const content = el('div', {
        className: 'container',
        style: 'padding: 20px; padding-bottom: 100px; max-width: 800px; margin: 0 auto; color: var(--text-secondary); line-height: 1.6;'
    }, [
        // Header
        el('div', { style: 'margin-bottom: 30px; display:flex; align-items:center; gap:10px;' }, [
            el('button', {
                onclick: goBack,
                style: 'background:none; border:none; color:white; cursor:pointer;'
            }, [icon('arrow-left')]),
            el('h1', { style: 'font-size: 24px; font-weight: 700; color: white;' }, isPrivacy ? 'Gizlilik Politikası' : 'Kullanım Koşulları')
        ]),

        // Text Content
        isPrivacy ? renderPrivacyText() : renderTermsText(),

        // Safe Space at bottom
        el('div', { style: 'height: 50px;' })
    ]);

    return content;
}

function renderPrivacyText() {
    return el('div', {}, [
        el('p', {}, 'Son Güncelleme: 7 Şubat 2025'),
        el('h3', { style: 'color:white; margin-top:20px;' }, '1. Veri Toplama'),
        el('p', {}, 'AI Radar olarak, hizmetimizi sağlamak için gerekli olan minimum veriyi topluyoruz. Bu veriler e-posta adresiniz, kullanım istatistikleriniz (XP, seviye) ve tercihlerinizden oluşur.'),
        el('h3', { style: 'color:white; margin-top:20px;' }, '2. Veri Kullanımı'),
        el('p', {}, 'Toplanan veriler, hesabınızı güvenli bir şekilde yönetmek, ilerlemenizi kaydetmek ve size özel fırsatlar sunmak için kullanılır. Verileriniz üçüncü taraflarla satılmaz.'),
        el('h3', { style: 'color:white; margin-top:20px;' }, '3. Güvenlik'),
        el('p', {}, 'Verileriniz endüstri standardı şifreleme yöntemleri ile korunmaktadır. Ödeme işlemleri güvenli ödeme altyapısı sağlayıcısı Stripe aracılığıyla gerçekleştirilir.'),
        el('h3', { style: 'color:white; margin-top:20px;' }, '4. İletişim'),
        el('p', {}, 'Sorularınız için bizimle support@airadar.app adresinden iletişime geçebilirsiniz.')
    ]);
}

function renderTermsText() {
    return el('div', {}, [
        el('p', {}, 'Son Güncelleme: 7 Şubat 2025'),
        el('h3', { style: 'color:white; margin-top:20px;' }, '1. Hizmetin Tanımı'),
        el('p', {}, 'AI Radar, yapay zeka destekli iş ve gelir fırsatlarını analiz eden ve sunan bir bilgilendirme platformudur.'),
        el('h3', { style: 'color:white; margin-top:20px;' }, '2. Kullanım Şartları'),
        el('p', {}, 'Platformu kullanarak, sunulan içeriklerin yatırım tavsiyesi olmadığını ve kendi araştırmanızı yapmanız gerektiğini kabul edersiniz.'),
        el('h3', { style: 'color:white; margin-top:20px;' }, '3. Üyelik ve Ödemeler'),
        el('p', {}, 'Premium özelliklere erişim için yapılan ödemeler, Stripe üzerinden güvenli bir şekilde işlenir. İade politikamız 14 gün geçerlidir.'),
        el('h3', { style: 'color:white; margin-top:20px;' }, '4. Sorumluluk Reddi'),
        el('p', {}, 'AI Radar, sunulan fırsatların garantili gelir sağlayacağını taahhüt etmez. Başarı, kullanıcının eforuna ve pazar koşullarına bağlıdır.')
    ]);
}
