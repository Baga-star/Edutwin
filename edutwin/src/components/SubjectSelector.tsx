import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Subject } from '../types';
import { cn } from '../lib/utils';
import { SUBJECT_ICONS, SUBJECT_COLORS } from './SubjectIcon';

interface Props {
  subjects: Subject[];
  selectedSubjects: string[];
  onConfirm: (subjects: string[]) => void;
  onSkip: () => void;
}

export const SubjectSelector: React.FC<Props> = ({ subjects, selectedSubjects, onConfirm, onSkip }) => {
  const [selected, setSelected] = React.useState<string[]>(selectedSubjects);

  const required = subjects.filter(s => s.required);
  const optional = subjects.filter(s => !s.required);

  const toggle = (id: string, isRequired: boolean) => {
    if (isRequired) return;
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const questionsCount = selected.length * 2;

  const SubjectCard = ({
    s, isRequired, isSelected
  }: { s: Subject; isRequired: boolean; isSelected: boolean }) => {
    const Icon = SUBJECT_ICONS[s.id];
    const color = SUBJECT_COLORS[s.id] || '#4F8EF7';

    const baseStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      padding: '20px 12px',
      borderRadius: '16px',
      border: `1.5px solid ${isSelected ? color + '70' : '#1E2A45'}`,
      background: isSelected ? color + '12' : '#111827',
      cursor: isRequired ? 'default' : 'pointer',
      transition: 'all .2s',
      textAlign: 'center',
    };

    const content = (
      <>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: isSelected ? color + '20' : '#0d1424',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${isSelected ? color + '40' : '#1a2540'}`,
        }}>
          {Icon && <Icon size={34} color={isSelected ? color : color + '90'} />}
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: isSelected ? '#E8EEFF' : '#8892A4', lineHeight: 1.3 }}>
            {s.label}
          </p>
          {isRequired && (
            <p style={{ fontSize: 10, color: color, fontWeight: 600, marginTop: 3 }}>
              Обязательный
            </p>
          )}
        </div>
        {isSelected && (
          <div style={{
            width: 16, height: 16, borderRadius: '50%',
            background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#0A0E1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </>
    );

    if (isRequired) {
      return <div style={baseStyle}>{content}</div>;
    }

    return (
      <motion.button
        onClick={() => toggle(s.id, false)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{ ...baseStyle, fontFamily: 'inherit' }}
      >
        {content}
      </motion.button>
    );
  };

  return (
    <div style={{
      height: '100%', background: '#111827', borderRadius: 24,
      border: '1px solid #1E2A45', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Шапка */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1f40, #1a1545)',
        borderBottom: '1px solid #1E2A45', padding: '24px 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #4F8EF7, #6C63FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L10 6L14 6.5L11 9.5L11.5 14L8 12L4.5 14L5 9.5L2 6.5L6 6L8 2Z"
                stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#E8EEFF', letterSpacing: -0.5 }}>
            Выбери предметы ЕНТ
          </h2>
        </div>
        <p style={{ fontSize: 13, color: '#5A6A88', marginBottom: 16 }}>
          4 обязательных + профильные предметы по специальности
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            background: '#ffffff15', borderRadius: 8, padding: '7px 14px',
            fontSize: 12, color: '#E8EEFF', fontWeight: 700,
          }}>
            {selected.length} предметов
          </div>
          <div style={{
            background: '#ffffff15', borderRadius: 8, padding: '7px 14px',
            fontSize: 12, color: '#E8EEFF', fontWeight: 700,
          }}>
            ~{questionsCount} вопросов
          </div>
        </div>
      </div>

      {/* Контент */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 0' }}>

        {/* Обязательные */}
        <div style={{ marginBottom: 24 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: '#5A6A88',
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
          }}>
            Обязательные
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {required.map(s => (
              <SubjectCard key={s.id} s={s} isRequired={true} isSelected={true} />
            ))}
          </div>
        </div>

        {/* Профильные */}
        <div style={{ marginBottom: 20 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: '#5A6A88',
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
          }}>
            Профильные — выбери нужные
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {optional.map(s => (
              <SubjectCard key={s.id} s={s} isRequired={false} isSelected={selected.includes(s.id)} />
            ))}
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #1E2A45',
        display: 'flex', gap: 10,
      }}>
        <button
          onClick={onSkip}
          style={{
            flex: 1, padding: '12px', borderRadius: 12, fontFamily: 'inherit',
            border: '1px solid #1E2A45', background: 'transparent',
            color: '#5A6A88', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Пропустить
        </button>
        <motion.button
          onClick={() => onConfirm(selected)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            flex: 2, padding: '12px', borderRadius: 12, fontFamily: 'inherit',
            border: 'none',
            background: 'linear-gradient(135deg, #4F8EF7, #6C63FF)',
            color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          Начать диагностику ({questionsCount} вопр.)
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  );
};
