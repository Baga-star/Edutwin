import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

// ─── Иконки предметов ────────────────────────────────────────────────────────
export const IconGeo: React.FC<IconProps> = ({ size = 40, color = '#1DE9B6' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="20" stroke={color} strokeWidth="2" fill="none"/>
    <ellipse cx="26" cy="26" rx="20" ry="9" stroke={color} strokeWidth="1.5" fill="none"/>
    <line x1="6" y1="26" x2="46" y2="26" stroke={color} strokeWidth="1.5"/>
    <line x1="26" y1="6" x2="26" y2="46" stroke={color} strokeWidth="1.5"/>
    <circle cx="26" cy="26" r="2.5" fill={color}/>
  </svg>
);

export const IconEnglish: React.FC<IconProps> = ({ size = 40, color = '#FF6B9D' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
    <text x="6" y="36" fontSize="32" fontFamily="Georgia,serif" fill={color} fontWeight="700">A</text>
    <text x="27" y="27" fontSize="20" fontFamily="Georgia,serif" fill={color} fontWeight="700" opacity="0.65">A</text>
    <path d="M37 12 L45 12 M41 8 L41 16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M35 34 Q39 29 43 34 Q39 39 35 34Z" fill={color} opacity="0.7"/>
  </svg>
);

export const IconMath: React.FC<IconProps> = ({ size = 40, color = '#7B7FFF' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
    <text x="11" y="40" fontSize="36" fontFamily="Georgia,serif" fill={color} fontStyle="italic">π</text>
    <line x1="8" y1="45" x2="44" y2="45" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="9" x2="44" y2="9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const IconPhysics: React.FC<IconProps> = ({ size = 40, color = '#FFD600' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="5" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="26" cy="26" r="2" fill={color}/>
    <ellipse cx="26" cy="26" rx="20" ry="8" stroke={color} strokeWidth="1.5" fill="none" transform="rotate(-30 26 26)"/>
    <ellipse cx="26" cy="26" rx="20" ry="8" stroke={color} strokeWidth="1.5" fill="none" transform="rotate(30 26 26)"/>
    <ellipse cx="26" cy="26" rx="20" ry="8" stroke={color} strokeWidth="1.5" fill="none"/>
  </svg>
);

export const IconBiology: React.FC<IconProps> = ({ size = 40, color = '#4CAF50' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
    <path d="M20 8 L20 22 L10 38 Q10 44 16 44 L36 44 Q42 44 42 38 L32 22 L32 8 Z" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="16" y1="8" x2="36" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 28 Q26 22 36 28" stroke={color} strokeWidth="1.5" fill="none"/>
    <circle cx="22" cy="37" r="2.5" fill={color} opacity="0.8"/>
    <circle cx="30" cy="39" r="2" fill={color} opacity="0.6"/>
  </svg>
);

export const IconChemistry: React.FC<IconProps> = ({ size = 40, color = '#FF7043' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
    <path d="M18 6 L18 20 L10 36 Q10 46 26 46 Q42 46 42 36 L34 20 L34 6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/>
    <line x1="14" y1="6" x2="38" y2="6" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M15 30 Q20 26 26 28 Q32 30 37 26" stroke={color} strokeWidth="1.5" fill="none"/>
    <circle cx="26" cy="38" r="4" fill={color} opacity="0.4"/>
    <circle cx="26" cy="38" r="2" fill={color}/>
  </svg>
);

export const IconWorldHistory: React.FC<IconProps> = ({ size = 40, color = '#9575CD' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
    <rect x="10" y="10" width="32" height="36" rx="4" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="16" y1="20" x2="36" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="16" y1="27" x2="36" y2="27" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="16" y1="34" x2="28" y2="34" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 16 Q10 10 16 10 L36 10 Q42 10 42 16" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

export const IconInformatics: React.FC<IconProps> = ({ size = 40, color = '#29B6F6' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
    <rect x="8" y="12" width="36" height="24" rx="4" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="20" y1="36" x2="20" y2="43" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="32" y1="36" x2="32" y2="43" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="14" y1="43" x2="38" y2="43" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M14 28 L19 22 L24 28 L29 23 L36 28" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconHistoryKZ: React.FC<IconProps> = ({ size = 40, color = '#FFA726' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
    <path d="M26 6 L31 19 L46 19 L34 28 L39 42 L26 33 L13 42 L18 28 L6 19 L21 19 Z"
      stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round"/>
    <circle cx="26" cy="26" r="4" fill={color} opacity="0.3"/>
    <circle cx="26" cy="26" r="2" fill={color}/>
  </svg>
);

export const IconLaw: React.FC<IconProps> = ({ size = 40, color = '#FFB300' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
    <line x1="26" y1="8" x2="26" y2="44" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="14" x2="36" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="14" y1="44" x2="38" y2="44" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="14" y1="14" x2="10" y2="28" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="14" y1="14" x2="18" y2="28" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 28 Q14 32 19 28" stroke={color} strokeWidth="1.5" fill="none"/>
    <line x1="34" y1="14" x2="30" y2="28" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="34" y1="14" x2="38" y2="28" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M29 28 Q34 32 39 28" stroke={color} strokeWidth="1.5" fill="none"/>
  </svg>
);

export const IconLiterature: React.FC<IconProps> = ({ size = 40, color = '#F06292' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
    <rect x="9" y="8" width="22" height="30" rx="3" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="13" y1="16" x2="27" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="13" y1="22" x2="27" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="13" y1="28" x2="21" y2="28" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="21" y="14" width="22" height="30" rx="3" stroke={color} strokeWidth="2" fill="#111827"/>
    <line x1="25" y1="22" x2="39" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="25" y1="28" x2="39" y2="28" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="25" y1="34" x2="33" y2="34" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const IconRussian: React.FC<IconProps> = ({ size = 40, color = '#81C784' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
    <path d="M10 14 L10 38 L42 38 L42 14 Z" stroke={color} strokeWidth="2" fill="none" rx="4"/>
    <path d="M10 14 Q26 6 42 14" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="18" y1="22" x2="34" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="18" y1="29" x2="28" y2="29" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="36" cy="32" r="5" stroke={color} strokeWidth="1.5" fill="none"/>
    <path d="M39 35 L43 39" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const IconMathLit: React.FC<IconProps> = ({ size = 40, color = '#7986CB' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
    <rect x="8" y="8" width="36" height="36" rx="5" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="8" y1="22" x2="44" y2="22" stroke={color} strokeWidth="1.2" opacity="0.5"/>
    <line x1="8" y1="30" x2="44" y2="30" stroke={color} strokeWidth="1.2" opacity="0.5"/>
    <line x1="22" y1="8" x2="22" y2="44" stroke={color} strokeWidth="1.2" opacity="0.5"/>
    <path d="M12 38 L18 28 L24 34 L30 20 L36 26 L40 18" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="40" cy="18" r="2.5" fill={color}/>
  </svg>
);

export const IconReading: React.FC<IconProps> = ({ size = 40, color = '#4DD0E1' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
    <path d="M10 12 Q26 8 42 12 L42 40 Q26 36 10 40 Z" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="26" y1="10" x2="26" y2="38" stroke={color} strokeWidth="1.5"/>
    <line x1="16" y1="20" x2="24" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    <line x1="16" y1="26" x2="24" y2="26" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    <line x1="28" y1="20" x2="36" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    <line x1="28" y1="26" x2="36" y2="26" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
  </svg>
);

// ─── Карта иконок предметов ───────────────────────────────────────────────────
export const SUBJECT_ICONS: Record<string, React.FC<IconProps>> = {
  math:          IconMath,
  math_lit:      IconMathLit,
  reading:       IconReading,
  history_kz:    IconHistoryKZ,
  physics:       IconPhysics,
  chemistry:     IconChemistry,
  biology:       IconBiology,
  geography:     IconGeo,
  informatics:   IconInformatics,
  english:       IconEnglish,
  russian:       IconRussian,
  world_history: IconWorldHistory,
};

export const SUBJECT_COLORS: Record<string, string> = {
  math:          '#7B7FFF',
  math_lit:      '#7986CB',
  reading:       '#4DD0E1',
  history_kz:    '#FFA726',
  physics:       '#FFD600',
  chemistry:     '#FF7043',
  biology:       '#4CAF50',
  geography:     '#1DE9B6',
  informatics:   '#29B6F6',
  english:       '#FF6B9D',
  russian:       '#81C784',
  world_history: '#9575CD',
};

// ─── Иконки агентов ───────────────────────────────────────────────────────────
export const IconDiagnostic: React.FC<IconProps> = ({ size = 20, color = '#9B8AF5' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.8" fill="none"/>
    <line x1="16.5" y1="16.5" x2="21" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="11" x2="14" y2="11" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="11" y1="8" x2="11" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const IconCognitive: React.FC<IconProps> = ({ size = 20, color = '#60A0F0' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 3 C7 3 4 7 4 10 C4 14 7 16 9 16 L9 20 L15 20 L15 16 C17 16 20 14 20 10 C20 7 17 3 12 3Z" stroke={color} strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
    <line x1="9" y1="20" x2="15" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 11 Q12 8 15 11" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </svg>
);

export const IconTutor: React.FC<IconProps> = ({ size = 20, color = '#3DD68C' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="14" rx="2" stroke={color} strokeWidth="1.8" fill="none"/>
    <line x1="7" y1="9" x2="17" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="7" y1="13" x2="13" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 18 L12 21 L16 18" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconAssessment: React.FC<IconProps> = ({ size = 20, color = '#F5A623' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="4" y="3" width="16" height="20" rx="2" stroke={color} strokeWidth="1.8" fill="none"/>
    <path d="M8 11 L10.5 13.5 L16 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8" y1="17" x2="16" y2="17" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

export const IconPrediction: React.FC<IconProps> = ({ size = 20, color = '#F472A0' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <polyline points="3,17 8,11 13,14 21,5" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="17,5 21,5 21,9" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="3" y1="20" x2="21" y2="20" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

export const IconAnalytics: React.FC<IconProps> = ({ size = 20, color = '#60A0F0' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="12" width="4" height="9" rx="1" fill={color} opacity="0.9"/>
    <rect x="10" y="7" width="4" height="14" rx="1" fill={color} opacity="0.7"/>
    <rect x="17" y="3" width="4" height="18" rx="1" fill={color} opacity="0.5"/>
    <line x1="2" y1="21" x2="22" y2="21" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

export const AGENT_ICONS = {
  Diagnostic:    IconDiagnostic,
  CognitiveModel: IconCognitive,
  Tutor:         IconTutor,
  Assessment:    IconAssessment,
  Prediction:    IconPrediction,
  Analytics:     IconAnalytics,
};
