import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Star, Globe } from 'lucide-react';
import { Message, AgentType } from '../types';
import { cn } from '../lib/utils';
import { getKazakhExplanation, submitFeedbackToFormbricks, onApiStatusChange, ApiStatus } from '../services/aiService';
import { AGENT_ICONS } from './SubjectIcon';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  currentAgent?: AgentType;
  userId?: string;
  phase?: 'diagnostic' | 'learning' | string;
  diagnosticProgress?: { current: number; total: number };
}

// Цвета и метки агентов
const AGENT_META: Record<AgentType, { color: string; bg: string; border: string; label: string }> = {
  Diagnostic:     { color: '#9B8AF5', bg: '#1a1045', border: '#3a2888', label: 'Diagnostic' },
  CognitiveModel: { color: '#60A0F0', bg: '#0d1f3a', border: '#1a3f7a', label: 'Cognitive' },
  Tutor:          { color: '#3DD68C', bg: '#0d2b1e', border: '#1a5530', label: 'Tutor' },
  Assessment:     { color: '#F5A623', bg: '#2b1a08', border: '#5a3810', label: 'Assessment' },
  Prediction:     { color: '#F472A0', bg: '#2b0a18', border: '#7a1f40', label: 'Prediction' },
  Analytics:      { color: '#60A0F0', bg: '#1a2030', border: '#2a3a60', label: 'Analytics' },
};

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isTyping,
  currentAgent,
  userId = "student-1",
  phase,
  diagnosticProgress,
}) => {
  const [input, setInput]           = React.useState('');
  const [lang, setLang]             = React.useState<'ru' | 'kz'>('ru');
  const [kazakhText, setKazakhText] = React.useState<string | null>(null);
  const [kazakhLoading, setKazakhLoading] = React.useState(false);
  const [showFeedback, setShowFeedback]   = React.useState(false);
  const [feedbackRating, setFeedbackRating] = React.useState(0);
  const [feedbackComment, setFeedbackComment] = React.useState('');
  const [feedbackSent, setFeedbackSent]   = React.useState(false);
  const [apiStatus, setApiStatus] = React.useState<ApiStatus>('unknown');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  React.useEffect(() => {
    return onApiStatusChange(setApiStatus);
  }, []);

  // ── Показываем кнопку фидбэка после 3-го сообщения ──────────────────────
  const showFeedbackButton = messages.filter(m => m.role === 'assistant').length >= 3 && !feedbackSent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input);
      setInput('');
      setKazakhText(null);
    }
  };

  // ── 2️⃣ AlemLLM: перевести последнее объяснение на казахский ────────────
  const handleKazakhToggle = async () => {
    if (lang === 'kz') {
      setLang('ru');
      setKazakhText(null);
      return;
    }
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
    if (!lastAssistant) return;
    setLang('kz');
    setKazakhLoading(true);
    const kzText = await getKazakhExplanation(
      lastAssistant.agent || 'Tutor',
      lastAssistant.content
    );
    setKazakhText(kzText);
    setKazakhLoading(false);
  };

  // ── 6️⃣ Formbricks: отправить фидбэк ─────────────────────────────────────
  const handleFeedbackSubmit = async () => {
    const lastTopic = messages.findLast(m => m.agent === 'Tutor')?.content?.slice(0, 40) || 'Урок';
    await submitFeedbackToFormbricks(userId, feedbackRating, feedbackComment, lastTopic);
    setFeedbackSent(true);
    setShowFeedback(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#111827', borderRadius: 20, overflow: 'hidden', border: '1px solid #1E2A45' }}>

      {/* Шапка */}
      <div style={{ background: '#0d1424', borderBottom: '1px solid #1E2A45', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #4F8EF7, #6C63FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2C5.5 2 3 4.5 3 7.5C3 10 4.5 12 7 12.5V15H11V12.5C13.5 12 15 10 15 7.5C15 4.5 12.5 2 9 2Z" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
              <line x1="7" y1="15" x2="11" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h3 style={{ fontWeight: 800, color: '#E8EEFF', fontSize: 13, margin: 0 }}>EduTwin — Цифровой Двойник</h3>
            <p style={{ fontSize: 10, color: '#5A6A88', margin: 0, display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              {isTyping ? (
                <><Loader2 size={10} className="animate-spin" style={{ color: '#4F8EF7' }} />
                  <span style={{ color: '#4F8EF7' }}>{currentAgent || 'Обработка...'}</span></>
              ) : (
                <><span style={{ width: 6, height: 6, background: '#00D4AA', borderRadius: '50%', display: 'inline-block' }} />
                  <span>Qwen3 · AlemLLM · Online</span></>
              )}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Прогресс диагностики */}
          {diagnosticProgress && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, color: '#9B8AF5', background: '#1a1045', padding: '5px 10px', borderRadius: 20, border: '1px solid #3a2888' }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <circle cx="5" cy="5" r="4" stroke="#9B8AF5" strokeWidth="1.3" fill="none"/>
                <path d="M3 5h4M5 3v4" stroke="#9B8AF5" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              {diagnosticProgress.current}/{diagnosticProgress.total}
            </div>
          )}

          {/* Переключатель языка — AlemLLM */}
          <button
            onClick={handleKazakhToggle}
          disabled={kazakhLoading}
          title={lang === 'ru' ? "Қазақша түсіндір (AlemLLM)" : "Русский язык"}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
            lang === 'kz'
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
          )}
        >
          {kazakhLoading
            ? <Loader2 size={12} className="animate-spin" />
            : <Globe size={12} />}
          {lang === 'kz' ? "ҚАЗ" : "KZ"}
          </button>
        </div>
      </div>

      {/* Казахская версия AlemLLM */}
      <AnimatePresence>
        {lang === 'kz' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ background: '#0d1f3a', borderBottom: '1px solid #1a3f7a', padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke="#4F8EF7" strokeWidth="1.2" fill="none"/>
                  <path d="M4 6.5L5.5 8L8.5 4.5" stroke="#4F8EF7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#4F8EF7', textTransform: 'uppercase', letterSpacing: 1 }}>
                  AlemLLM · Қазақша
                </span>
              </div>
              {kazakhLoading
                ? <p style={{ fontSize: 12, color: '#5A6A88', fontStyle: 'italic' }}>Аударылуда...</p>
                : <p style={{ fontSize: 13, color: '#C8D4E8', lineHeight: 1.6 }}>{kazakhText}</p>
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Уровень 4: Баннер статуса API */}
      {apiStatus !== 'ok' && apiStatus !== 'unknown' && (
        <div style={{
          padding: '8px 16px',
          background: apiStatus === 'down' ? '#2b0a0a' : '#2b1a08',
          borderBottom: `1px solid ${apiStatus === 'down' ? '#7a1f1f' : '#5a3810'}`,
          display: 'flex', alignItems: 'center', gap: 8, fontSize: 12,
          color: apiStatus === 'down' ? '#f09595' : '#FAC775',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
            background: apiStatus === 'down' ? '#E24B4A' : '#EF9F27' }} />
          {apiStatus === 'down'
            ? 'ИИ сейчас недоступен — идёт восстановление. Попробуй через минуту.'
            : 'Небольшие проблемы с соединением — отвечаю медленнее обычного.'}
        </div>
      )}

      {/* Сообщения */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', width: '100%', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
            >
              <div style={{
                maxWidth: '80%', padding: '10px 14px', borderRadius: 16,
                background: msg.role === 'user' ? '#1a3f7a' : '#111827',
                border: msg.role === 'user' ? '1px solid #2a5fa0' : '1px solid #1E2A45',
                borderTopRightRadius: msg.role === 'user' ? 4 : 16,
                borderTopLeftRadius: msg.role === 'assistant' ? 4 : 16,
              }}>
                {msg.agent && msg.role === 'assistant' && (() => {
                  const meta = AGENT_META[msg.agent];
                  const Icon = AGENT_ICONS[msg.agent];
                  return (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '3px 8px 3px 6px', borderRadius: 20, marginBottom: 8,
                      background: meta.bg, border: `1px solid ${meta.border}`,
                    }}>
                      {Icon && <Icon size={13} color={meta.color} />}
                      <span style={{ fontSize: 10, fontWeight: 700, color: meta.color, letterSpacing: 0.5 }}>
                        {meta.label}
                      </span>
                    </div>
                  );
                })()}
                <p style={{
                  fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap',
                  color: msg.role === 'user' ? '#E8EEFF' : '#C8D4E8',
                }}>{msg.content}</p>
                <span style={{ fontSize: 10, opacity: 0.35, display: 'block', marginTop: 6, textAlign: 'right', color: '#E8EEFF' }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div style={{
              background: '#111827', border: '1px solid #1E2A45',
              borderRadius: 16, borderTopLeftRadius: 4,
              padding: '10px 14px', display: 'flex', gap: 5, alignItems: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="#4F8EF7" strokeWidth="1.3" fill="none"/>
                <path d="M5 7h4M7 5v4" stroke="#4F8EF7" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Formbricks: обратная связь */}
      <AnimatePresence>
        {showFeedbackButton && !showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ padding: '8px 16px', background: '#0d1f2a', borderTop: '1px solid #1E2A45', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span style={{ fontSize: 12, color: '#8892A4' }}>Как прошёл урок?</span>
            <button onClick={() => setShowFeedback(true)} style={{
              fontSize: 11, fontWeight: 700, color: '#F5A623', background: 'none',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Star size={12} /> Оценить
            </button>
          </motion.div>
        )}

        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', padding: '12px 16px', background: '#0d1f2a', borderTop: '1px solid #1E2A45' }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: '#F5A623', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Star size={12} /> Оцени урок (Formbricks)
            </p>
            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setFeedbackRating(n)} style={{
                  fontSize: 18, background: 'none', border: 'none', cursor: 'pointer',
                  color: feedbackRating >= n ? '#F5A623' : '#2A3A55', transition: '.15s',
                }}>★</button>
              ))}
            </div>
            <input
              type="text" value={feedbackComment}
              onChange={e => setFeedbackComment(e.target.value)}
              placeholder="Комментарий (необязательно)"
              style={{
                width: '100%', fontSize: 12, background: '#111827',
                border: '1px solid #1E2A45', borderRadius: 8, padding: '7px 10px',
                color: '#C8D4E8', outline: 'none', fontFamily: 'inherit', marginBottom: 8,
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleFeedbackSubmit} disabled={feedbackRating === 0} style={{
                flex: 1, background: '#F5A623', color: '#0A0E1A', fontSize: 11, fontWeight: 700,
                border: 'none', borderRadius: 8, padding: '7px', cursor: 'pointer', fontFamily: 'inherit',
                opacity: feedbackRating === 0 ? 0.4 : 1,
              }}>Отправить</button>
              <button onClick={() => setShowFeedback(false)} style={{
                padding: '7px 12px', fontSize: 11, color: '#5A6A88', background: 'none',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              }}>Отмена</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {feedbackSent && (
        <div style={{ padding: '8px 16px', background: '#0d2b1e', borderTop: '1px solid #1a5530', fontSize: 11, color: '#3dd68c', fontWeight: 700, textAlign: 'center' }}>
          Спасибо за отзыв! Данные отправлены в Formbricks.
        </div>
      )}

      {/* Поле ввода */}
      <form onSubmit={handleSubmit} style={{ padding: '12px', background: '#0d1424', borderTop: '1px solid #1E2A45', display: 'flex', gap: 8 }}>
        <input
          type="text" value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Введите ответ или вопрос..."
          disabled={isTyping}
          style={{
            flex: 1, background: '#111827', border: '1px solid #1E2A45',
            borderRadius: 12, padding: '10px 14px', fontSize: 13,
            color: '#E8EEFF', outline: 'none', fontFamily: 'inherit',
            transition: 'border-color .2s',
          }}
          onFocus={e => e.target.style.borderColor = '#4F8EF7'}
          onBlur={e => e.target.style.borderColor = '#1E2A45'}
        />
        <button
          type="submit" disabled={!input.trim() || isTyping}
          style={{
            background: 'linear-gradient(135deg, #4F8EF7, #6C63FF)',
            border: 'none', borderRadius: 12, padding: '0 14px',
            cursor: 'pointer', opacity: (!input.trim() || isTyping) ? 0.4 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity .2s',
          }}
        >
          <Send size={17} color="white" />
        </button>
      </form>
    </div>
  );
};
