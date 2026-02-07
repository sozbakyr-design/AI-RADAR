
import { el, icon } from '../utils/dom.js';
import { getClient } from '../supabase/client.js';

export function NewsletterSignup() {
    const emailInput = el('input', {
        type: 'email',
        placeholder: 'E-posta adresin...',
        style: `
            flex: 1; padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); 
            background: rgba(0,0,0,0.2); color: white; font-size: 14px; outline: none;
        `
    });

    const submitBtn = el('button', {
        style: `
            padding: 12px 16px; border-radius: 12px; border: none; background: var(--accent-primary);
            color: white; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center;
        `
    }, [icon('arrow-right', { style: 'width: 18px;' })]);

    const form = el('div', {
        style: `
            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
            border-radius: 16px; padding: 20px; margin-bottom: 32px;
        `
    }, [
        el('div', { style: 'display: flex; align-items: center; gap: 8px; margin-bottom: 8px;' }, [
            icon('mail', { style: 'color: var(--accent-primary); width: 18px;' }),
            el('h3', { style: 'font-size: 16px; font-weight: 700; color: white;' }, 'Erken Erişim')
        ]),
        el('p', { style: 'font-size: 13px; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5;' },
            'Yeni AI fırsatları çıktığında ilk senin haberin olsun. Haftalık özel rapor.'
        ),
        el('div', { style: 'display: flex; gap: 8px;' }, [
            emailInput,
            submitBtn
        ]),
        el('div', { className: 'message-area', style: 'font-size: 12px; margin-top: 8px; min-height: 18px;' }) // Feedback area
    ]);

    submitBtn.onclick = async () => {
        const email = emailInput.value.trim();
        const msgArea = form.querySelector('.message-area');

        if (!email || !email.includes('@')) {
            msgArea.style.color = '#ef4444';
            msgArea.textContent = 'Lütfen geçerli bir e-posta girin.';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        msgArea.textContent = 'Kaydediliyor...';
        msgArea.style.color = 'var(--text-muted)';

        const supabase = getClient();
        if (supabase) {
            const { error } = await supabase.from('leads').insert([{ email, source: 'homepage' }]);
            if (error) {
                console.error('Signup error:', error);
                // Handle duplicate email usually
                if (error.code === '23505') { // Unique violation
                    msgArea.style.color = '#10b981';
                    msgArea.textContent = 'Zaten listemizdesin! 🚀';
                } else {
                    msgArea.style.color = '#ef4444';
                    msgArea.textContent = 'Bir hata oluştu.';
                }
            } else {
                msgArea.style.color = '#10b981';
                msgArea.textContent = 'Harika! Listeye eklendin. 🎉';
                emailInput.value = '';
            }
        } else {
            // Mock mode
            setTimeout(() => {
                msgArea.style.color = '#10b981';
                msgArea.textContent = 'Harika! Listeye eklendin. (Demo)';
                emailInput.value = '';
            }, 800);
        }

        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    };

    return form;
}
