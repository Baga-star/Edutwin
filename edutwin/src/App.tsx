import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, LayoutDashboard, MessageSquare, Settings, LogOut } from 'lucide-react';
import { ChatWindow } from './components/ChatWindow';
import { StudentDashboard } from './components/StudentDashboard';
import { SubjectSelector } from './components/SubjectSelector';
import { Landing } from './components/Landing';
import { AuthPage } from './components/AuthPage';
import { Message, StudentProfile, AgentType, Question } from './types';
import { ALL_SUBJECTS, getDiagnosticQuestions, REQUIRED_SUBJECTS } from './constants';
import {
  getAgentResponse,
  getAgentResponseStream,
  saveProfileToMemory,
  loadProfileFromRedis,
  logProgressToNocoDB,
  saveProgressReport,
} from './services/aiService';

const USER_ID = 'student-1';

type AppPhase =
  | 'landing'
  | 'auth-register'
  | 'auth-login'
  | 'subject-select'
  | 'diagnostic'
  | 'learning'
  | 'analytics';

const SUBJECT_LABEL: Record<string, string> = Object.fromEntries(
  ALL_SUBJECTS.map(s => [s.id, s.label])
);

export default function App() {
  const [appPhase, setAppPhase] = React.useState<AppPhase>('landing');
  const [chatPhase, setChatPhase] = React.useState<'subject-select' | 'diagnostic' | 'learning'>('subject-select');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1', role: 'assistant',
      content: 'Добро пожаловать в EduTwin! Выбери предметы ЕНТ и начнём диагностику — создадим твой персональный профиль.',
      agent: 'Diagnostic', timestamp: Date.now(),
    }
  ]);
  const [isTyping, setIsTyping] = React.useState(false);
  const [currentAgent, setCurrentAgent] = React.useState<AgentType>('Diagnostic');
  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>(REQUIRED_SUBJECTS);
  const [profile, setProfile] = React.useState<StudentProfile>({
    name: 'Ученик', level: 'Beginner',
    selectedSubjects: REQUIRED_SUBJECTS,
    weakTopics: [], strongTopics: [],
    completedTasks: 0, accuracy: 0, predictedENT: 70,
    subjectStats: {}, learningHistory: [],
  });

  const [diagnosticQuestions, setDiagnosticQuestions] = React.useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [quizAnswers, setQuizAnswers] = React.useState<{
    questionId: string; isCorrect: boolean; topic: string; subject: string;
  }[]>([]);

  React.useEffect(() => {
    if (isLoggedIn) {
      loadProfileFromRedis(USER_ID).then(saved => {
        if (saved) {
          setProfile(saved);
          setSelectedSubjects(saved.selectedSubjects || REQUIRED_SUBJECTS);
        }
      });
    }
  }, [isLoggedIn]);

  const addMessage = (content: string, role: 'user' | 'assistant', agent?: AgentType) => {
    setMessages(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      role, content, agent, timestamp: Date.now(),
    }]);
  };

  const handleAuthSuccess = (name: string) => {
    setProfile(prev => ({ ...prev, name }));
    setIsLoggedIn(true);
    setAppPhase('subject-select');
    setChatPhase('subject-select');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAppPhase('landing');
  };

  const startDiagnostic = (subjects: string[]) => {
    const questions = getDiagnosticQuestions(subjects);
    setDiagnosticQuestions(questions);
    setCurrentQuestionIndex(0);
    setQuizAnswers([]);
    setAppPhase('diagnostic');
    setChatPhase('diagnostic');

    const subjectNames = subjects.map(id => ALL_SUBJECTS.find(s => s.id === id)?.label || id).join(', ');
    const q = questions[0];
    const subjectLabel = SUBJECT_LABEL[q.subject] || q.subject;
    addMessage(
      `Начинаем диагностику!\nПредметы: ${subjectNames}\nВсего вопросов: ${questions.length}\n\n` +
      `[${subjectLabel}] ${q.topic}\n\n${q.text}\n\nВарианты: ${q.options.join(' | ')}`,
      'assistant', 'Diagnostic'
    );
  };

  const handleSubjectConfirm = (subjects: string[]) => {
    setSelectedSubjects(subjects);
    const updatedProfile = { ...profile, selectedSubjects: subjects };
    setProfile(updatedProfile);
    startDiagnostic(subjects);
  };

  const handleSendMessage = async (text: string) => {
    addMessage(text, 'user');
    setIsTyping(true);

    if (chatPhase === 'diagnostic') {
      const q = diagnosticQuestions[currentQuestionIndex];
      const isCorrect =
        text.trim().toLowerCase() === q.correctAnswer.toLowerCase() ||
        text.trim() === q.correctAnswer;

      const newAnswers = [...quizAnswers, { questionId: q.id, isCorrect, topic: q.topic, subject: q.subject }];
      setQuizAnswers(newAnswers);
      logProgressToNocoDB(USER_ID, q.topic, isCorrect, 'Diagnostic');

      if (currentQuestionIndex < diagnosticQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        const nextQ = diagnosticQuestions[currentQuestionIndex + 1];
        const nextSubjectLabel = SUBJECT_LABEL[nextQ.subject] || nextQ.subject;
        setTimeout(() => {
          setIsTyping(false);
          addMessage(
            `${isCorrect ? 'Верно!' : `Нет. Правильный ответ: ${q.correctAnswer}\n${q.explanation}`}\n\n` +
            `Вопрос ${currentQuestionIndex + 2}/${diagnosticQuestions.length}:\n` +
            `[${nextSubjectLabel}] ${nextQ.topic}\n\n${nextQ.text}\n\nВарианты: ${nextQ.options.join(' | ')}`,
            'assistant', 'Diagnostic'
          );
        }, 800);
      } else {
        setCurrentAgent('CognitiveModel');
        const weak = [...new Set(newAnswers.filter(a => !a.isCorrect).map(a => a.topic))];
        const strong = [...new Set(newAnswers.filter(a => a.isCorrect).map(a => a.topic))];
        const accuracy = Math.round((newAnswers.filter(a => a.isCorrect).length / newAnswers.length) * 100);

        const subjectStatsRaw: Record<string, { correct: number; total: number; topics: { weak: string[]; strong: string[] } }> = {};
        for (const ans of newAnswers) {
          if (!subjectStatsRaw[ans.subject]) subjectStatsRaw[ans.subject] = { correct: 0, total: 0, topics: { weak: [], strong: [] } };
          subjectStatsRaw[ans.subject].total++;
          if (ans.isCorrect) subjectStatsRaw[ans.subject].topics.strong.push(ans.topic);
          else subjectStatsRaw[ans.subject].topics.weak.push(ans.topic);
          if (ans.isCorrect) subjectStatsRaw[ans.subject].correct++;
        }

        const newProfile: StudentProfile = {
          ...profile, weakTopics: weak, strongTopics: strong, accuracy,
          completedTasks: profile.completedTasks + newAnswers.length,
          predictedENT: Math.min(140, Math.round(70 + accuracy * 0.7)),
          level: accuracy >= 80 ? 'Advanced' : accuracy >= 50 ? 'Intermediate' : 'Beginner',
          selectedSubjects,
          subjectStats: Object.fromEntries(
            Object.entries(subjectStatsRaw).map(([sid, st]) => [sid, {
              accuracy: Math.round((st.correct / st.total) * 100),
              completed: st.total,
              weakTopics: st.topics.weak,
              strongTopics: st.topics.strong,
            }])
          ),
          learningHistory: [
            ...profile.learningHistory,
            ...newAnswers.map(a => ({ topic: a.topic, subject: a.subject, score: a.isCorrect ? 100 : 0, timestamp: Date.now() })),
          ],
        };

        setProfile(newProfile);
        saveProfileToMemory(USER_ID, newProfile);
        saveProgressReport(USER_ID, newProfile);

        // ✅ СТРИМИНГ для CognitiveModel анализа
        const analysisMsgId = Math.random().toString(36).slice(2);
        setMessages(prev => [...prev, {
          id: analysisMsgId, role: 'assistant', content: '', agent: 'CognitiveModel', timestamp: Date.now(),
        }]);
        setIsTyping(false);

        await getAgentResponseStream('CognitiveModel',
          `Диагностика завершена. Предметы: ${selectedSubjects.join(', ')}. Результаты: ${JSON.stringify(newAnswers)}. Краткий анализ.`,
          newProfile,
          (chunk) => {
            setMessages(prev => prev.map(m =>
              m.id === analysisMsgId ? { ...m, content: m.content + chunk } : m
            ));
          },
          (_full) => {}
        );

        setTimeout(() => {
          addMessage(
            `Цифровой двойник создан!\n` +
            (weak.length > 0
              ? `Слабые темы: ${weak.join(', ')}. С чего начнём?`
              : `Отличный результат! Все темы усвоены хорошо.`),
            'assistant', 'Tutor'
          );
          setAppPhase('learning');
          setChatPhase('learning');
          setCurrentAgent('Tutor');
        }, 600);
      }
    } else {
      let agentToUse = currentAgent;
      const lower = text.toLowerCase();
      if (lower.includes('прогноз') || lower.includes('ент') || lower.includes('балл')) agentToUse = 'Prediction';
      else if (lower.includes('отчёт') || lower.includes('статистик') || lower.includes('прогресс')) agentToUse = 'Analytics';
      else if (lower.includes('провер') || lower.includes('правильно') || lower.includes('ответ')) agentToUse = 'Assessment';
      setCurrentAgent(agentToUse);

      // ✅ СТРИМИНГ: добавляем сообщение с пустым текстом, потом дополняем по мере ответа
      const streamMsgId = Math.random().toString(36).slice(2);
      setMessages(prev => [...prev, {
        id: streamMsgId, role: 'assistant', content: '', agent: agentToUse, timestamp: Date.now(),
      }]);
      setIsTyping(false);

      await getAgentResponseStream(agentToUse, text, profile,
        (chunk) => {
          setMessages(prev => prev.map(m =>
            m.id === streamMsgId ? { ...m, content: m.content + chunk } : m
          ));
        },
        (_full) => {
          // Фоновые операции — не блокируют UI
          const updatedProfile = { ...profile, completedTasks: profile.completedTasks + 1 };
          setProfile(updatedProfile);
          saveProfileToMemory(USER_ID, updatedProfile);
          logProgressToNocoDB(USER_ID, text.slice(0, 30), true, agentToUse).catch(() => {});
        }
      );
    }
  };

  // ── ЛЕНДИНГ ─────────────────────────────────────────────────────────────────
  if (appPhase === 'landing') {
    return (
      <Landing
        onStart={() => setAppPhase('auth-register')}
        onLogin={() => setAppPhase('auth-login')}
      />
    );
  }

  // ── АВТОРИЗАЦИЯ ──────────────────────────────────────────────────────────────
  if (appPhase === 'auth-register' || appPhase === 'auth-login') {
    return (
      <AuthPage
        mode={appPhase === 'auth-register' ? 'register' : 'login'}
        onSuccess={handleAuthSuccess}
        onBack={() => setAppPhase('landing')}
      />
    );
  }

  // ── ЛИЧНЫЙ КАБИНЕТ ───────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#0A0E1A', fontFamily: 'Sora, sans-serif', color: '#E8EEFF', display: 'flex', flexDirection: 'column' }}>

      {/* Навигация */}
      <nav style={{
        background: 'rgba(10,14,26,0.95)', borderBottom: '1px solid #1E2A45',
        padding: '14px 32px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#4F8EF7,#6C63FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', fontWeight: 800 }}>E</div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.5 }}>
            EDUTWIN<span style={{ color: '#4F8EF7' }}>.KZ</span>
          </span>
          <span style={{ fontSize: 10, color: '#3A4A65', background: '#111827', border: '1px solid #1E2A45', borderRadius: 20, padding: '3px 10px', fontWeight: 600, marginLeft: 6, display: 'none' }}>
            Qwen3 · AlemLLM · Redis · NocoDB · MinIO
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {[
            { icon: <Settings size={14}/>, label: 'Предметы', phase: 'subject-select' as AppPhase },
            { icon: <BookOpen size={14}/>, label: 'Обучение', phase: 'learning' as AppPhase },
            { icon: <LayoutDashboard size={14}/>, label: 'Дашборд', phase: 'analytics' as AppPhase },
          ].map(({ icon, label, phase }) => (
            <button key={label} onClick={() => { setAppPhase(phase); if (phase === 'subject-select') setChatPhase('subject-select'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 10, border: 'none', fontFamily: 'inherit',
                background: appPhase === phase ? '#1a2540' : 'transparent',
                color: appPhase === phase ? '#4F8EF7' : '#5A6A88',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .2s',
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#E8EEFF', margin: 0 }}>{profile.name}</p>
            <p style={{ fontSize: 10, color: '#5A6A88', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>{profile.level}</p>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#4F8EF7,#6C63FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff' }}>
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <button onClick={handleLogout} title="Выйти" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3A4A65', padding: 4 }}>
            <LogOut size={16} />
          </button>
        </div>
      </nav>

      {/* Основной контент */}
      <main style={{ flex: 1, maxWidth: 1400, width: '100%', margin: '0 auto', padding: '24px 24px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'start', boxSizing: 'border-box' }}>

        {/* Левая колонка */}
        <div style={{ height: 'calc(100vh - 90px)', position: 'sticky', top: 80 }}>
          <AnimatePresence mode="wait">

            {appPhase === 'subject-select' && (
              <motion.div key="subjects" style={{ height: '100%' }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <SubjectSelector
                  subjects={ALL_SUBJECTS}
                  selectedSubjects={selectedSubjects}
                  onConfirm={handleSubjectConfirm}
                  onSkip={() => { setAppPhase('learning'); setChatPhase('learning'); }}
                />
              </motion.div>
            )}

            {(appPhase === 'diagnostic' || appPhase === 'learning') && (
              <motion.div key="chat" style={{ height: '100%' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ChatWindow
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isTyping={isTyping}
                  currentAgent={currentAgent}
                  userId={USER_ID}
                  phase={chatPhase}
                  diagnosticProgress={chatPhase === 'diagnostic'
                    ? { current: currentQuestionIndex + 1, total: diagnosticQuestions.length }
                    : undefined
                  }
                />
              </motion.div>
            )}

            {appPhase === 'analytics' && (
              <motion.div key="analytics" style={{ height: '100%', overflowY: 'auto' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ background: '#111827', border: '1px solid #1E2A45', borderRadius: 20, padding: 24, height: '100%' }}>
                  <StudentDashboard profile={profile} userId={USER_ID} subjects={ALL_SUBJECTS} />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Правая колонка — дашборд */}
        <div style={{ height: 'calc(100vh - 90px)', overflowY: 'auto', position: 'sticky', top: 80 }}>
          <div style={{ background: '#0d1424', borderRadius: 20, padding: '16px', border: '1px solid #1E2A45', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#5A6A88', textTransform: 'uppercase', letterSpacing: 1 }}>
                Цифровой двойник
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, fontWeight: 700, color: '#00D4AA', background: '#0d2b1e', border: '1px solid #1a5530', borderRadius: 20, padding: '3px 8px' }}>
                <span style={{ width: 5, height: 5, background: '#00D4AA', borderRadius: '50%' }} />
                LIVE · Redis
              </div>
            </div>
            <StudentDashboard profile={profile} userId={USER_ID} subjects={ALL_SUBJECTS} />
          </div>
        </div>
      </main>

      {/* Мобильный переключатель */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 50 }}>
        <button
          onClick={() => setAppPhase(appPhase === 'analytics' ? 'learning' : 'analytics')}
          style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg,#4F8EF7,#6C63FF)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(79,142,247,0.4)',
          }}
        >
          {appPhase === 'analytics' ? <MessageSquare size={22} color="white" /> : <LayoutDashboard size={22} color="white" />}
        </button>
      </div>
    </div>
  );
}
