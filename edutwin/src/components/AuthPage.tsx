import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  mode: 'login' | 'register';
  onSuccess: (name: string) => void;
  onBack: () => void;
}

export const AuthPage: React.FC<Props> = ({ mode: initialMode, onSuccess, onBack }) => {
  const [mode, setMode] = React.useState<'login' | 'register'>(initialMode);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(name || email.split('@')[0] || 'Ученик');
    }, 1200);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px',
    background: '#0d1424', border: '1px solid #1E2A45',
    borderRadius: 12, color: '#E8EEFF', fontSize: 14,
    fontFamily: 'Sora, sans-serif', outline: 'none', transition: 'border-color .2s',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700,
    color: '#5A6A88', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8,
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0E1A',
      fontFamily: 'Sora, sans-serif', display: 'flex', flexDirection: 'column',
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 60px', borderBottom: '1px solid #1E2A45',
      }}>
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          color: '#5A6A88', fontSize: 14, fontWeight: 600,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="#5A6A88" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Назад
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#4F8EF7,#6C63FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', fontWeight: 800 }}>E</div>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#E8EEFF' }}>
            EDUTWIN<span style={{ color: '#4F8EF7' }}>.KZ</span>
          </span>
        </div>
        <div style={{ width: 80 }} />
      </nav>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: 440 }}
        >
          {/* Card */}
          <div style={{ background: '#111827', border: '1px solid #1E2A45', borderRadius: 24, padding: '36px 36px' }}>
            <AnimatePresence mode="wait">
              <motion.div key={mode} initial={{ opacity: 0, x: mode === 'login' ? -16 : 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>

                <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1, color: '#E8EEFF', marginBottom: 6 }}>
                  {mode === 'login' ? 'С возвращением!' : 'Создай аккаунт'}
                </h1>
                <p style={{ fontSize: 14, color: '#5A6A88', marginBottom: 28 }}>
                  {mode === 'login'
                    ? 'Продолжи подготовку к ЕНТ'
                    : 'Начни подготовку к ЕНТ прямо сейчас — бесплатно'}
                </p>

                {/* Perks (только для регистрации) */}
                {mode === 'register' && (
                  <div style={{
                    background: '#0d1828', border: '1px solid #1a3050',
                    borderRadius: 14, padding: '14px 16px', marginBottom: 24,
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}>
                    {['Диагностика по 12 предметам ЕНТ', 'Персональный план подготовки', 'AI-репетитор на казахском и русском'].map(p => (
                      <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#8892A4' }}>
                        <div style={{ width: 16, height: 16, borderRadius: 5, background: '#0d2b1e', border: '1px solid #1a5530', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#00D4AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        {p}
                      </div>
                    ))}
                  </div>
                )}

                {/* Social */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                  {['G  Google', 'Ya  Яндекс'].map(s => (
                    <button key={s} style={{
                      padding: '11px', border: '1px solid #1E2A45',
                      borderRadius: 12, background: 'transparent',
                      color: '#E8EEFF', fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'background .2s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#1a2540')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >{s}</button>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: '#1E2A45' }} />
                  <span style={{ fontSize: 12, color: '#3A4A65' }}>или через email</span>
                  <div style={{ flex: 1, height: 1, background: '#1E2A45' }} />
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {mode === 'register' && (
                    <div>
                      <label style={labelStyle}>Имя</label>
                      <input
                        value={name} onChange={e => setName(e.target.value)}
                        placeholder="Как тебя зовут?" style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#4F8EF7'}
                        onBlur={e => e.target.style.borderColor = '#1E2A45'}
                      />
                    </div>
                  )}
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="твой@email.com" style={inputStyle} required
                      onFocus={e => e.target.style.borderColor = '#4F8EF7'}
                      onBlur={e => e.target.style.borderColor = '#1E2A45'}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Пароль</label>
                    <input
                      type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" style={inputStyle} required
                      onFocus={e => e.target.style.borderColor = '#4F8EF7'}
                      onBlur={e => e.target.style.borderColor = '#1E2A45'}
                    />
                  </div>

                  <motion.button
                    type="submit" disabled={loading}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                      background: loading ? '#2a3a5c' : 'linear-gradient(135deg,#4F8EF7,#6C63FF)',
                      color: '#fff', fontSize: 14, fontWeight: 700,
                      cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit',
                      transition: 'background .2s',
                    }}
                  >
                    {loading
                      ? 'Загрузка...'
                      : mode === 'login'
                        ? 'Войти в аккаунт'
                        : 'Создать аккаунт и начать →'
                    }
                  </motion.button>
                </form>

                <p style={{ textAlign: 'center', fontSize: 13, color: '#5A6A88', marginTop: 20 }}>
                  {mode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
                  <span
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    style={{ color: '#4F8EF7', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
                  </span>
                </p>

              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
