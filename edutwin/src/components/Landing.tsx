import React from 'react';
import { motion } from 'motion/react';
import {
  SUBJECT_ICONS,
  SUBJECT_COLORS,
  IconMath,
  IconPhysics,
  IconChemistry,
  IconBiology,
  IconGeo,
  IconInformatics,
  IconEnglish,
  IconRussian,
  IconWorldHistory,
  IconMathLit,
  IconReading,
  IconHistoryKZ,
} from './SubjectIcon';

interface Props {
  onStart: () => void;
  onLogin: () => void;
}

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="4" width="22" height="18" rx="3" stroke="#4F8EF7" strokeWidth="1.8" fill="none"/>
        <path d="M8 11l3 3 7-6" stroke="#4F8EF7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="3" y1="22" x2="25" y2="22" stroke="#4F8EF7" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
    title: 'Диагностика за 5 минут',
    desc: 'Пройди тест по всем предметам. AI мгновенно выявит слабые темы и составит персональный план.',
    color: '#4F8EF7',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3C9 3 5 7 5 11C5 15.5 8 17.5 10.5 18V22H17.5V18C20 17.5 23 15.5 23 11C23 7 19 3 14 3Z" stroke="#00D4AA" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
        <line x1="10.5" y1="22" x2="17.5" y2="22" stroke="#00D4AA" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M11 12Q14 9 17 12" stroke="#00D4AA" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    title: 'AI-репетитор 24/7',
    desc: 'Задай любой вопрос по любому предмету. Qwen3 и AlemLLM объясняют на русском и казахском.',
    color: '#00D4AA',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <polyline points="4,20 9,13 14,16 22,6" stroke="#FFD600" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="18,6 22,6 22,10" stroke="#FFD600" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="4" y1="23" x2="24" y2="23" stroke="#FFD600" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    title: 'Прогноз балла ЕНТ',
    desc: 'Система рассчитывает твой прогнозируемый балл и показывает какие темы поднимут его быстрее всего.',
    color: '#FFD600',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="11" r="6" stroke="#FF6B9D" strokeWidth="1.8" fill="none"/>
        <path d="M6 24C6 20 9 18 14 18C19 18 22 20 22 24" stroke="#FF6B9D" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M17 9L19 11L23 7" stroke="#FF6B9D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Цифровой двойник',
    desc: 'Когнитивная модель обновляется после каждого занятия. Профиль хранится в Redis и доступен всегда.',
    color: '#FF6B9D',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="5" width="20" height="16" rx="3" stroke="#9575CD" strokeWidth="1.8" fill="none"/>
        <line x1="4" y1="10" x2="24" y2="10" stroke="#9575CD" strokeWidth="1.3" opacity="0.5"/>
        <path d="M9 15l3 3 7-5" stroke="#9575CD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Пробные тесты ЕНТ',
    desc: 'Реальные вопросы по спецификациям НЦТ. 75+ вопросов по 12 предметам с подробными объяснениями.',
    color: '#9575CD',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#FF7043" strokeWidth="1.8" fill="none"/>
        <path d="M10 14h8M14 10v8" stroke="#FF7043" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Казахский язык',
    desc: 'AlemLLM (247B параметров, Astana Hub) объясняет материал по-казахски нативно и грамотно.',
    color: '#FF7043',
  },
];

const SUBJECTS_PREVIEW = [
  { id: 'math_lit', label: 'Мат. грамотность', Icon: IconMathLit, color: '#7986CB' },
  { id: 'reading', label: 'Грамотность чтения', Icon: IconReading, color: '#4DD0E1' },
  { id: 'history_kz', label: 'История Казахстана', Icon: IconHistoryKZ, color: '#FFA726' },
  { id: 'math', label: 'Математика', Icon: IconMath, color: '#7B7FFF' },
  { id: 'physics', label: 'Физика', Icon: IconPhysics, color: '#FFD600' },
  { id: 'chemistry', label: 'Химия', Icon: IconChemistry, color: '#FF7043' },
  { id: 'biology', label: 'Биология', Icon: IconBiology, color: '#4CAF50' },
  { id: 'geography', label: 'География', Icon: IconGeo, color: '#1DE9B6' },
  { id: 'informatics', label: 'Информатика', Icon: IconInformatics, color: '#29B6F6' },
  { id: 'english', label: 'Английский язык', Icon: IconEnglish, color: '#FF6B9D' },
  { id: 'russian', label: 'Русский язык', Icon: IconRussian, color: '#81C784' },
  { id: 'world_history', label: 'Всемирная история', Icon: IconWorldHistory, color: '#9575CD' },
];

const STATS = [
  { value: '12', label: 'предметов ЕНТ' },
  { value: '75+', label: 'вопросов в базе' },
  { value: '6', label: 'AI-агентов' },
  { value: '140', label: 'максимум баллов' },
];

export const Landing: React.FC<Props> = ({ onStart, onLogin }) => {
  return (
    <div style={{ background: '#0A0E1A', minHeight: '100vh', fontFamily: 'Sora, sans-serif', color: '#E8EEFF' }}>

      {/* NAV */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 60px', borderBottom: '1px solid #1E2A45',
        position: 'sticky', top: 0, background: 'rgba(10,14,26,0.92)',
        backdropFilter: 'blur(12px)', zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#4F8EF7,#6C63FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 16, color: '#fff',
          }}>E</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>
            EDUTWIN<span style={{ color: '#4F8EF7' }}>.KZ</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {['О нас', 'Предметы', 'Возможности', 'Подписка'].map(item => (
            <span key={item} style={{ fontSize: 14, color: '#8892A4', cursor: 'pointer', fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#E8EEFF')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8892A4')}
            >{item}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onLogin} style={{
            padding: '9px 20px', borderRadius: 10, border: '1px solid #1E2A45',
            background: 'transparent', color: '#E8EEFF', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>Войти</button>
          <button onClick={onStart} style={{
            padding: '9px 20px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg,#4F8EF7,#6C63FF)',
            color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>Начать бесплатно</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 40px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#1a2540', border: '1px solid #2a3a5c',
            borderRadius: 100, padding: '6px 14px', fontSize: 12,
            color: '#4F8EF7', fontWeight: 600, marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, background: '#00D4AA', borderRadius: '50%', display: 'inline-block' }} />
            AI-платформа для подготовки к ЕНТ №1
          </div>

          <h1 style={{ fontSize: 50, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, marginBottom: 20 }}>
            <span style={{ background: 'linear-gradient(90deg,#4F8EF7,#6C63FF,#00D4AA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EduTwin
            </span>{' '}
            — твой помощник при подготовке к ЕНТ
          </h1>
          <p style={{ color: '#8892A4', fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>
            Многоагентная AI-система адаптируется под твой уровень.<br/>
            Диагностика, персональный план, прогноз баллов — всё в одном месте.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
            {[
              'Диагностика по всем предметам ЕНТ',
              'AI-репетитор на казахском и русском языках',
              'Прогноз твоего балла в реальном времени',
              'Персональный план подготовки',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#C8D4E8' }}>
                <div style={{ width: 18, height: 18, borderRadius: 6, background: '#0d2b1e', border: '1px solid #1a5530', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5 4-4" stroke="#00D4AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <motion.button
              onClick={onStart}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{
                padding: '15px 32px', borderRadius: 14, border: 'none',
                background: 'linear-gradient(135deg,#4F8EF7,#6C63FF)',
                color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 8px 30px rgba(79,142,247,0.3)',
              }}
            >
              Начать диагностику →
            </motion.button>
            <button onClick={onLogin} style={{
              padding: '15px 28px', borderRadius: 14,
              border: '1px solid #1E2A45', background: 'transparent',
              color: '#E8EEFF', fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>Войти в аккаунт</button>
          </div>
        </motion.div>

        {/* Hero card */}
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div style={{ background: '#111827', border: '1px solid #1E2A45', borderRadius: 24, padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#1e3a5f,#2a4a7f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2C6.5 2 4 5 4 8C4 11.5 6.5 13.5 9 14V17H11V14C13.5 13.5 16 11.5 16 8C16 5 13.5 2 10 2Z" stroke="#4F8EF7" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#E8EEFF' }}>Цифровой двойник</p>
                  <p style={{ fontSize: 10, color: '#5A6A88' }}>Прогноз ЕНТ · обновлён</p>
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#4F8EF7' }}>
                118<span style={{ fontSize: 13, color: '#5A6A88' }}>/140</span>
              </div>
            </div>
            {[
              { label: 'Мат. грамотность', pct: 82, color: '#7B7FFF' },
              { label: 'История КЗ', pct: 91, color: '#00D4AA' },
              { label: 'Физика', pct: 67, color: '#FFD600' },
              { label: 'Химия', pct: 54, color: '#FF7043' },
              { label: 'Английский', pct: 78, color: '#FF6B9D' },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: '#C8D4E8', fontWeight: 500 }}>{s.label}</span>
                  <span style={{ color: s.color, fontWeight: 700 }}>{s.pct}%</span>
                </div>
                <div style={{ height: 6, background: '#1E2A45', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    style={{ height: '100%', background: s.color, borderRadius: 3 }}
                  />
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
              {['Diagnostic', 'Tutor', 'Prediction', 'Analytics'].map(a => (
                <div key={a} style={{
                  padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                  background: '#0d1424', border: '1px solid #2a3a5c', color: '#60a0f0',
                }}>{a}</div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{ background: '#0d1424', borderTop: '1px solid #1E2A45', borderBottom: '1px solid #1E2A45', padding: '32px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#4F8EF7', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#5A6A88', marginTop: 6 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 40px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#4F8EF7', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Возможности</p>
        <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1.5, marginBottom: 48, maxWidth: 500, lineHeight: 1.15 }}>
          Всё для сдачи ЕНТ на максимум
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, borderColor: f.color + '50' }}
              style={{
                background: '#111827', border: '1px solid #1E2A45',
                borderRadius: 18, padding: 28, transition: 'border-color .2s',
              }}>
              <div style={{
                width: 50, height: 50, borderRadius: 14,
                background: f.color + '15', border: `1px solid ${f.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
              }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: '#E8EEFF' }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#5A6A88', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SUBJECTS */}
      <section style={{ background: '#0d1424', borderTop: '1px solid #1E2A45', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#4F8EF7', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Предметы</p>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1.5, marginBottom: 48 }}>Все предметы ЕНТ</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {SUBJECTS_PREVIEW.map((s, i) => (
              <motion.div key={s.id}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4, borderColor: s.color + '60' }}
                style={{
                  background: '#111827', border: '1px solid #1E2A45',
                  borderRadius: 16, padding: '24px 16px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                  cursor: 'default', transition: 'all .2s',
                }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: s.color + '15', border: `1px solid ${s.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.Icon size={34} color={s.color} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#E8EEFF' }}>{s.label}</p>
                  <p style={{ fontSize: 11, color: '#5A6A88', marginTop: 3 }}>~5 вопросов</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '80px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#4F8EF7', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Подписка</p>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1.5, marginBottom: 12 }}>Готовься к ЕНТ как профи</h2>
          <p style={{ fontSize: 15, color: '#5A6A88' }}>Подписка — это твой шанс получить максимум баллов всего за стоимость одной кружки кофе!</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Free */}
          <div style={{ background: '#111827', border: '1px solid #1E2A45', borderRadius: 20, padding: 32 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#E8EEFF', marginBottom: 6 }}>Бесплатная регистрация</h3>
            <p style={{ fontSize: 13, color: '#5A6A88', marginBottom: 24 }}>Быстрый вход (Google или Яндекс)</p>
            <div style={{ fontSize: 42, fontWeight: 800, color: '#E8EEFF', marginBottom: 28 }}>0 <span style={{ fontSize: 14, color: '#5A6A88' }}>₸</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {['Диагностика по всем предметам', '3 обязательных предмета', '1 пробный тест', 'AI-репетитор (базовый)'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#8892A4' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, background: '#1E2A45', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5 4-4" stroke="#5A6A88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  {f}
                </div>
              ))}
            </div>
            <button onClick={onStart} style={{
              width: '100%', padding: '14px', borderRadius: 12, border: '1px solid #2a3a5c',
              background: 'transparent', color: '#4F8EF7', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>Начать бесплатно</button>
          </div>

          {/* Ultra */}
          <div style={{ background: 'linear-gradient(135deg,#0f1f40,#1a1545)', border: '1px solid #3a4a7a', borderRadius: 20, padding: 32, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 16, right: 16, background: '#4F8EF7', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
              ПОПУЛЯРНО
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#00D4AA', marginBottom: 6 }}>Ultra</h3>
            <p style={{ fontSize: 13, color: '#5A6A88', marginBottom: 24 }}>в месяц, всё включено!</p>
            <div style={{ fontSize: 42, fontWeight: 800, color: '#E8EEFF', marginBottom: 28 }}>
              2190 <span style={{ fontSize: 16, color: '#5A6A88' }}>₸</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {[
                'Все 12 предметов ЕНТ без ограничений',
                'Неограниченный AI-репетитор',
                'Пробные тесты как на реальном ЕНТ',
                'Объяснения на казахском (AlemLLM)',
                'Детальная аналитика и отчёты',
                'Прогноз балла в реальном времени',
              ].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#C8D4E8' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, background: '#0d2b1e', border: '1px solid #1a5530', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5 4-4" stroke="#00D4AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  {f}
                </div>
              ))}
            </div>
            <motion.button onClick={onStart} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg,#4F8EF7,#6C63FF)',
                color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 6px 24px rgba(79,142,247,0.3)',
              }}>Получить Ultra!</motion.button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg,#0f1f40,#1a1545)',
        borderTop: '1px solid #1E2A45', padding: '80px 40px', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1.5, marginBottom: 16 }}>
          Готовься к ЕНТ как профи —<br/>
          <span style={{ background: 'linear-gradient(90deg,#4F8EF7,#00D4AA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            начни прямо сейчас
          </span>
        </h2>
        <p style={{ fontSize: 16, color: '#5A6A88', marginBottom: 36 }}>
          AI, тесты, репетитор. Всё, что нужно, уже в EduTwin!
        </p>
        <motion.button onClick={onStart} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          style={{
            padding: '16px 48px', borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg,#4F8EF7,#6C63FF)',
            color: '#fff', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 10px 40px rgba(79,142,247,0.35)',
          }}>
          Начать диагностику бесплатно →
        </motion.button>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #1E2A45', padding: '24px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 15 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#4F8EF7,#6C63FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', fontWeight: 800 }}>E</div>
          EDUTWIN<span style={{ color: '#4F8EF7' }}>.KZ</span>
        </div>
        <p style={{ fontSize: 12, color: '#3A4A65' }}>© 2025 EduTwin.kz · Qwen3 · AlemLLM · Redis · NocoDB · MinIO</p>
        <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#5A6A88' }}>
          <span style={{ cursor: 'pointer' }}>О нас</span>
          <span style={{ cursor: 'pointer' }}>Политика</span>
          <span style={{ cursor: 'pointer' }}>Контакты</span>
        </div>
      </footer>
    </div>
  );
};
