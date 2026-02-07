import { el } from '../utils/dom.js';
import { OpportunityService } from '../services/OpportunityService.js';

export function AdminPage(navigate) {
    const statusBox = el('div', { style: 'margin-top:20px; padding:15px; border-radius:10px; display:none; white-space: pre-wrap;' });

    return el('div', {
        className: 'container page-admin',
        style: 'padding: 40px; max-width: 600px; margin: 0 auto; color: white;'
    }, [
        el('h1', { style: 'font-size: 24px; font-weight: 800; margin-bottom: 24px;' }, 'Admin Panel 🛠️'),

        el('div', { style: 'background: rgba(255,255,255,0.05); padding: 24px; border-radius: 16px; margin-bottom: 24px;' }, [
            el('h2', { style: 'font-size: 18px; font-weight: 700; margin-bottom: 12px;' }, 'Veritabanı Kurulumu'),
            el('p', { style: 'color: rgba(255,255,255,0.6); margin-bottom: 24px; line-height: 1.5;' },
                'Aşağıdaki butona basarak verileri Supabase\'e aktarın. Sonuç aşağıda görünecektir.'
            ),

            el('button', {
                onclick: async (e) => {
                    if (confirm('Veritabanına mock verileri eklensin mi?')) {
                        const btn = e.target;
                        btn.innerText = 'Yükleniyor... (Bekleyin)';
                        btn.disabled = true;
                        btn.style.opacity = '0.7';

                        // Reset Status
                        statusBox.style.display = 'block';
                        statusBox.style.background = 'rgba(255,255,255,0.1)';
                        statusBox.innerText = 'İşlem Başlıyor...';

                        try {
                            const result = await OpportunityService.seedData();

                            if (result.success) {
                                statusBox.style.background = 'rgba(16, 185, 129, 0.2)';
                                statusBox.style.color = '#10b981';
                                statusBox.innerText = '✅ ' + result.message;
                            } else {
                                statusBox.style.background = 'rgba(239, 68, 68, 0.2)';
                                statusBox.style.color = '#ef4444';
                                statusBox.innerText = '❌ Hata: ' + result.message;
                            }

                        } catch (err) {
                            statusBox.style.background = 'rgba(239, 68, 68, 0.2)';
                            statusBox.style.color = '#ef4444';
                            statusBox.innerText = '❌ Kritik Hata: ' + err.message;
                        } finally {
                            btn.innerText = 'Verileri Aktar (Seed)';
                            btn.disabled = false;
                            btn.style.opacity = '1';
                        }
                    }
                },
                style: 'background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer;'
            }, 'Verileri Aktar (Seed)'),

            statusBox
        ]),

        el('button', {
            onclick: () => navigate('#/home'),
            style: 'background: transparent; color: white; border: 1px solid rgba(255,255,255,0.2); padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer;'
        }, 'Ana Sayfaya Dön')
    ]);
}
