import { el, icon } from '../utils/dom.js';
import { getClient } from '../supabase/client.js';

export function AuthPage(navigate, type = 'login') {
    const isLogin = type === 'login';
    const supabase = getClient();

    // Form State
    let email = '';
    let password = '';
    let loading = false;
    let error = null;

    // --- Actions ---

    async function handleSubmit(e) {
        e.preventDefault();
        error = null;
        loading = true;
        updateUI();

        try {
            if (!supabase) throw new Error('Supabase yapılandırılmadı.');

            const { data, error: authError } = isLogin
                ? await supabase.auth.signInWithPassword({ email, password })
                : await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: email.split('@')[0], // Default name
                            xp: 0,
                            level: 1
                        }
                    }
                });

            if (authError) throw authError;

            // Success
            if (isLogin) {
                navigate('#home');
            } else {
                // Check if email confirmation is required (Supabase setting)
                if (data.user && !data.session) {
                    alert('Lütfen e-posta adresinizi doğrulayın.');
                    navigate('#login');
                } else {
                    navigate('#onboarding'); // Logic to be added
                }
            }

        } catch (err) {
            console.error('Auth Error:', err);
            error = err.message || 'Bir hata oluştu.';
        } finally {
            loading = false;
            updateUI();
        }
    }

    // --- UI Components ---

    const container = el('div', {
        className: 'container',
        style: 'min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; background: var(--bg-main);'
    });

    const content = el('div', {
        style: 'width: 100%; max-width: 400px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 30px;'
    });

    function updateUI() {
        content.innerHTML = ''; // Clear

        // Header
        content.appendChild(el('div', { style: 'text-align: center; margin-bottom: 30px;' }, [
            icon('radar', { style: 'width: 48px; height: 48px; color: var(--accent-primary); margin-bottom: 15px;' }),
            el('h1', { style: 'font-size: 24px; font-weight: 700; margin-bottom: 10px;' }, isLogin ? 'Tekrar Hoşgeldin' : 'Radar\'a Katıl'),
            el('p', { style: 'color: var(--text-muted); font-size: 14px;' }, isLogin ? 'Kaldığın yerden devam et.' : 'Fırsatları kaçırma, hemen başla.')
        ]));

        // Error
        if (error) {
            content.appendChild(el('div', {
                style: 'background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.2); color: #f87171; padding: 10px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; text-align: center;'
            }, error));
        }

        // Form
        const form = el('form', { onsubmit: handleSubmit }, [
            // Email
            el('div', { style: 'margin-bottom: 15px;' }, [
                el('label', { style: 'display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 5px;' }, 'E-posta'),
                el('input', {
                    type: 'email',
                    required: true,
                    placeholder: 'ornek@email.com',
                    value: email,
                    oninput: (e) => email = e.target.value,
                    style: 'width: 100%; padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: white; outline: none;'
                })
            ]),
            // Password
            el('div', { style: 'margin-bottom: 25px;' }, [
                el('label', { style: 'display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 5px;' }, 'Şifre'),
                el('input', {
                    type: 'password',
                    required: true,
                    placeholder: '••••••••',
                    value: password,
                    oninput: (e) => password = e.target.value,
                    style: 'width: 100%; padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: white; outline: none;'
                })
            ]),
            // Submit Button
            el('button', {
                type: 'submit',
                disabled: loading,
                style: `width: 100%; padding: 14px; background: var(--gradient-primary); border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer; opacity: ${loading ? 0.7 : 1};`
            }, loading ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol'))
        ]);

        content.appendChild(form);

        // Toggle Text
        const toggleLink = el('div', { style: 'margin-top: 20px; text-align: center; font-size: 13px; color: var(--text-muted);' }, [
            el('span', {}, isLogin ? 'Hesabın yok mu? ' : 'Zaten hesabın var mı? '),
            el('a', {
                href: isLogin ? '#signup' : '#login',
                onclick: (e) => {
                    e.preventDefault();
                    navigate(isLogin ? '#signup' : '#login');
                },
                style: 'color: var(--accent-primary); text-decoration: none; cursor: pointer; font-weight: 600;'
            }, isLogin ? 'Kayıt Ol' : 'Giriş Yap')
        ]);

        content.appendChild(toggleLink);
    }

    container.appendChild(content);

    // Initial Render
    updateUI();

    return container;
}
