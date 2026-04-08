import React from 'react';
import { motion } from 'motion/react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { StudentProfile, Subject } from '../types';
import { saveProgressReport, getTopicStatsFromNocoDB } from '../services/aiService';
import { SUBJECT_ICONS, SUBJECT_COLORS, AGENT_ICONS, IconAnalytics } from './SubjectIcon';

interface Props {
  profile: StudentProfile;
  userId?: string;
  subjects?: Subject[];
}

const MetricCard = ({ value, label, color }: { value: string | number; label: string; color: string }) => (
  <div style={{
    background: '#0d1424', border: '1px solid #1E2A45', borderRadius: 12,
    padding: '12px', textAlign: 'center',
  }}>
    <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
    <div style={{ fontSize: 10, color: '#5A6A88', marginTop: 2, fontWeight: 600 }}>{label}</div>
  </div>
);

export const StudentDashboard: React.FC<Props> = ({ profile, userId = 'student-1', subjects = [] }) => {
  const [nocoStats, setNocoStats] = React.useState<Record<string, { correct: number; total: number }> | null>(null);
  const [loadingStats, setLoadingStats] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeTab, setActiveTab] = React.useState<'overview' | 'subjects'>('overview');

  const chartData = profile.learningHistory.slice(-12).map(h => ({
    name: h.topic.slice(0, 6),
    score: h.score,
  }));

  const allTopics = [...new Set([...profile.weakTopics, ...profile.strongTopics])];
  const radarTopics = allTopics.slice(0, 6).length > 0
    ? allTopics.slice(0, 6)
    : ['Матем.', 'Физика', 'Химия', 'Биол.', 'Геогр.', 'История'];
  const radarData = radarTopics.map(t => ({
    subject: t.slice(0, 8),
    A: profile.strongTopics.includes(t) ? 85 : profile.weakTopics.includes(t) ? 25 : 50,
  }));

  const selectedSubjectObjects = subjects.filter(s => profile.selectedSubjects?.includes(s.id));

  const handleLoadStats = async () => {
    setLoadingStats(true);
    const stats = await getTopicStatsFromNocoDB(userId);
    setNocoStats(stats);
    setLoadingStats(false);
  };

  const handleSaveReport = async () => {
    setSaveStatus('saving');
    const ok = await saveProgressReport(userId, profile);
    setSaveStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const card = (children: React.ReactNode, style?: React.CSSProperties) => (
    <div style={{
      background: '#111827', border: '1px solid #1E2A45',
      borderRadius: 16, padding: '16px', ...style,
    }}>
      {children}
    </div>
  );

  const cardTitle = (text: string) => (
    <p style={{
      fontSize: 10, fontWeight: 700, color: '#5A6A88',
      textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
    }}>
      {text}
    </p>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', height: '100%', paddingRight: 2, paddingBottom: 8 }}>

      {/* Главные метрики */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <motion.div whileHover={{ scale: 1.02 }} style={{
          background: 'linear-gradient(135deg, #0a1f40, #0d2855)',
          border: '1px solid #1a3f7a', borderRadius: 16, padding: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <IconPredictionMini />
            <span style={{ fontSize: 9, fontWeight: 700, color: '#4F8EF7', opacity: 0.8 }}>ПРОГНОЗ ЕНТ</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#4F8EF7' }}>{Math.round(profile.predictedENT)}</div>
          <div style={{ fontSize: 10, color: '#5A6A88', marginTop: 2 }}>из 140 · Prediction Agent</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} style={{
          background: 'linear-gradient(135deg, #0a2a1a, #0d3520)',
          border: '1px solid #1a5530', borderRadius: 16, padding: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <IconAccuracyMini />
            <span style={{ fontSize: 9, fontWeight: 700, color: '#00D4AA', opacity: 0.8 }}>ТОЧНОСТЬ</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#00D4AA' }}>{profile.accuracy}%</div>
          <div style={{ fontSize: 10, color: '#5A6A88', marginTop: 2 }}>{profile.completedTasks} заданий</div>
        </motion.div>
      </div>

      {/* Вкладки */}
      <div style={{
        display: 'flex', gap: 4,
        background: '#0d1424', borderRadius: 12, padding: 4,
      }}>
        {(['overview', 'subjects'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: '8px', border: 'none', borderRadius: 9,
            background: activeTab === tab ? '#4F8EF7' : 'transparent',
            color: activeTab === tab ? '#fff' : '#5A6A88',
            fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all .2s',
          }}>
            {tab === 'overview' ? 'Обзор' : 'По предметам'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (<>

        {/* Радар */}
        {card(<>
          {cardTitle('Когнитивный профиль · Цифровой двойник')}
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="62%" data={radarData}>
                <PolarGrid stroke="#1E2A45" />
                <PolarAngleAxis dataKey="subject" fontSize={8} tick={{ fill: '#5A6A88' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar name="Уровень" dataKey="A" stroke="#4F8EF7" fill="#4F8EF7" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </>)}

        {/* Сильные / слабые */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {card(<>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L8.5 5.5H13L9.5 8.5L11 13L7 10L3 13L4.5 8.5L1 5.5H5.5L7 1Z" fill="#00D4AA" opacity="0.9"/>
              </svg>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#00D4AA' }}>СИЛЬНЫЕ</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {profile.strongTopics.length > 0
                ? profile.strongTopics.slice(0, 4).map(t => (
                  <span key={t} style={{
                    padding: '3px 8px', background: '#0d2b1e',
                    color: '#3dd68c', fontSize: 10, borderRadius: 6,
                    border: '1px solid #1a5530', fontWeight: 600,
                  }}>{t}</span>
                ))
                : <span style={{ fontSize: 10, color: '#3A4A65', fontStyle: 'italic' }}>—</span>
              }
            </div>
          </>)}

          {card(<>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#f472a0" strokeWidth="1.5" fill="none"/>
                <line x1="7" y1="4" x2="7" y2="8" stroke="#f472a0" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="7" cy="10" r="0.7" fill="#f472a0"/>
              </svg>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#f472a0' }}>СЛАБЫЕ</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {profile.weakTopics.length > 0
                ? profile.weakTopics.slice(0, 4).map(t => (
                  <span key={t} style={{
                    padding: '3px 8px', background: '#2b0a18',
                    color: '#f472a0', fontSize: 10, borderRadius: 6,
                    border: '1px solid #7a1f40', fontWeight: 600,
                  }}>{t}</span>
                ))
                : <span style={{ fontSize: 10, color: '#3A4A65', fontStyle: 'italic' }}>—</span>
              }
            </div>
          </>)}
        </div>

        {/* История */}
        {chartData.length > 0 && card(<>
          {cardTitle('История прогресса')}
          <div style={{ height: 96 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E2A45" />
                <XAxis dataKey="name" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1E2A45', borderRadius: 8, fontSize: 10 }} />
                <Line type="monotone" dataKey="score" stroke="#4F8EF7" strokeWidth={2}
                  dot={{ r: 3, fill: '#4F8EF7' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>)}
      </>)}

      {activeTab === 'subjects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {selectedSubjectObjects.length === 0
            ? card(<p style={{ fontSize: 12, color: '#5A6A88', textAlign: 'center' }}>
              Пройдите диагностику для просмотра статистики
            </p>)
            : selectedSubjectObjects.map(sub => {
              const Icon = SUBJECT_ICONS[sub.id];
              const color = SUBJECT_COLORS[sub.id] || '#4F8EF7';
              const stats = profile.subjectStats?.[sub.id];
              const acc = stats?.accuracy ?? 0;

              return card(<>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: acc > 0 ? 10 : 0 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: color + '15', border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {Icon && <Icon size={22} color={color} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#E8EEFF' }}>{sub.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color }}>{acc}%</span>
                    </div>
                    <div style={{ height: 5, background: '#1E2A45', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${acc}%`, background: color, borderRadius: 3, transition: 'width .8s' }} />
                    </div>
                  </div>
                </div>
                {stats && (stats.weakTopics.length > 0 || stats.strongTopics.length > 0) && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {stats.strongTopics.map(t => (
                      <span key={t} style={{ fontSize: 9, background: '#0d2b1e', color: '#3dd68c', padding: '2px 7px', borderRadius: 5, border: '1px solid #1a5530', fontWeight: 600 }}>✓ {t}</span>
                    ))}
                    {stats.weakTopics.map(t => (
                      <span key={t} style={{ fontSize: 9, background: '#2b0a18', color: '#f472a0', padding: '2px 7px', borderRadius: 5, border: '1px solid #7a1f40', fontWeight: 600 }}>✗ {t}</span>
                    ))}
                  </div>
                )}
              </>, { padding: '12px' });
            })
          }
        </div>
      )}

      {/* NocoDB */}
      {card(<>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconAnalytics size={14} color="#7B7FFF" />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#7B7FFF', textTransform: 'uppercase', letterSpacing: 1 }}>
              Статистика · NocoDB
            </span>
          </div>
          <button onClick={handleLoadStats} disabled={loadingStats} style={{
            fontSize: 10, fontWeight: 700, color: '#7B7FFF',
            background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {loadingStats ? '...' : '↻ Загрузить'}
          </button>
        </div>
        {nocoStats
          ? Object.keys(nocoStats).length === 0
            ? <p style={{ fontSize: 10, color: '#3A4A65', fontStyle: 'italic' }}>Данных пока нет</p>
            : Object.entries(nocoStats).map(([topic, stat]) => (
              <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: '#8892A4', width: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{topic}</span>
                <div style={{ flex: 1, height: 5, background: '#1E2A45', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round((stat.correct / stat.total) * 100)}%`, background: '#7B7FFF', borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 10, color: '#5A6A88' }}>{stat.correct}/{stat.total}</span>
              </div>
            ))
          : <p style={{ fontSize: 10, color: '#3A4A65', fontStyle: 'italic' }}>Нажми «Загрузить»</p>
        }
      </>)}

      {/* Redis */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px', background: '#0d1424',
        borderRadius: 10, border: '1px solid #1E2A45',
      }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="#5A6A88" strokeWidth="1.2" fill="none"/>
          <path d="M4 6h4M6 4v4" stroke="#5A6A88" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: 10, color: '#5A6A88' }}>Профиль синхронизирован · Redis</span>
        <div style={{ marginLeft: 'auto', width: 6, height: 6, background: '#00D4AA', borderRadius: '50%' }} />
      </div>

      {/* MinIO */}
      <button onClick={handleSaveReport} disabled={saveStatus === 'saving'} style={{
        width: '100%', padding: '11px', borderRadius: 12, fontFamily: 'inherit',
        border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        background: saveStatus === 'saved' ? '#0d2b1e' : saveStatus === 'error' ? '#2b0a18' : '#1E2A45',
        color: saveStatus === 'saved' ? '#3dd68c' : saveStatus === 'error' ? '#f472a0' : '#8892A4',
        transition: 'all .2s',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2v7M4 6l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 10v1a1 1 0 001 1h8a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        {saveStatus === 'saved' ? 'Сохранено в MinIO!'
          : saveStatus === 'error' ? 'Ошибка MinIO'
          : saveStatus === 'saving' ? 'Сохраняю...'
          : 'Сохранить отчёт в MinIO'}
      </button>
    </div>
  );
};

// Мини иконки для карточек метрик
const IconPredictionMini = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <polyline points="2,12 5,8 8,10 14,3" stroke="#4F8EF7" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="11,3 14,3 14,6" stroke="#4F8EF7" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconAccuracyMini = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="#00D4AA" strokeWidth="1.5" fill="none"/>
    <path d="M5 8l2 2 4-4" stroke="#00D4AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
