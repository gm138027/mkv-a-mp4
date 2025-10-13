/**
 * SVG 图标组件集合
 * 现代化设计 - 使用翠绿、橙色、玫红等现代配色
 */

interface IconProps {
  className?: string;
}

export const FreeIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" fill="#d1fae5"/>
    <path d="M9 12L11 14L15 10" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const QualityIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#d1fae5" stroke="#10b981" strokeWidth="2"/>
    <path d="M12 8V12M12 16H12.01" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export const SpeedIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#fed7aa" stroke="#f97316" strokeWidth="2"/>
    <path d="M12 6V12L16 14" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PrivacyIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 6V11C4 16 7 20.5 12 22C17 20.5 20 16 20 11V6L12 2Z" 
      fill="#fce7f3" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const DevicesIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="13" height="10" rx="2" fill="#fed7aa" stroke="#f97316" strokeWidth="2"/>
    <rect x="6" y="14" width="7" height="1" fill="#f97316"/>
    <path d="M16 17H19C19.5523 17 20 16.5523 20 16V10C20 9.44772 19.5523 9 19 9H17" 
      stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
    <rect x="17" y="17" width="4" height="6" rx="1" fill="#fed7aa" stroke="#f97316" strokeWidth="2"/>
  </svg>
);

export const SubtitleIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="20" height="14" rx="2" fill="#fce7f3" stroke="#ec4899" strokeWidth="2"/>
    <rect x="5" y="14" width="4" height="2" rx="1" fill="#ec4899"/>
    <rect x="10" y="14" width="9" height="2" rx="1" fill="#ec4899"/>
    <path d="M5 8H19M5 11H15" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const UIIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="3" fill="#d1fae5" stroke="#10b981" strokeWidth="2"/>
    <path d="M3 9H21" stroke="#10b981" strokeWidth="2"/>
    <path d="M8 3V9M16 3V9" stroke="#10b981" strokeWidth="2"/>
  </svg>
);

export const BatchIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="7" height="7" rx="1.5" fill="#fed7aa" stroke="#f97316" strokeWidth="2"/>
    <rect x="13" y="4" width="7" height="7" rx="1.5" fill="#fed7aa" stroke="#f97316" strokeWidth="2"/>
    <rect x="4" y="13" width="7" height="7" rx="1.5" fill="#fed7aa" stroke="#f97316" strokeWidth="2"/>
    <rect x="13" y="13" width="7" height="7" rx="1.5" fill="#fed7aa" stroke="#f97316" strokeWidth="2"/>
  </svg>
);

export const SettingsIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" fill="#fce7f3" stroke="#ec4899" strokeWidth="2"/>
    <path d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" 
      stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CloudIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 10C19.6569 10 21 11.3431 21 13C21 14.6569 19.6569 16 18 16H7C4.79086 16 3 14.2091 3 12C3 9.79086 4.79086 8 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17.5523 8 18 8.44772 18 9V10Z" 
      fill="#d1fae5" stroke="#10b981" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 12V16M9 14L12 17L15 14" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const NoWatermarkIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="14" rx="2" fill="#d1fae5" stroke="#10b981" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="4" fill="white"/>
    <path d="M4 4L20 20" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export const NoRegisterIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" fill="#d1fae5" stroke="#10b981" strokeWidth="2"/>
    <path d="M6 21C6 17.6863 8.68629 15 12 15C15.3137 15 18 17.6863 18 21" 
      stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
    <path d="M15 7L17 9" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// 用途场景图标
export const MobileIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="2" width="12" height="20" rx="3" fill="#fed7aa" stroke="#f97316" strokeWidth="2"/>
    <circle cx="12" cy="19" r="1.5" fill="#f97316"/>
    <rect x="8" y="5" width="8" height="11" rx="1" fill="white" stroke="#f97316" strokeWidth="1.5"/>
  </svg>
);

export const TVIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="13" rx="2" fill="#fce7f3" stroke="#ec4899" strokeWidth="2"/>
    <rect x="4" y="8" width="16" height="9" rx="1" fill="white" stroke="#ec4899" strokeWidth="1.5"/>
    <path d="M9 19V21H15V19" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
    <line x1="7" y1="21" x2="17" y2="21" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const SocialIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#d1fae5" stroke="#10b981" strokeWidth="2"/>
    <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="10" r="1.5" fill="#10b981"/>
    <circle cx="15" cy="10" r="1.5" fill="#10b981"/>
  </svg>
);

export const EditIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 20H21" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16.5 3.5C17.3284 2.67157 18.6716 2.67157 19.5 3.5C20.3284 4.32843 20.3284 5.67157 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" 
      fill="#fce7f3" stroke="#ec4899" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

export const CompressIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="2" fill="#fed7aa" stroke="#f97316" strokeWidth="2"/>
    <path d="M14 10L12 12L10 10M10 14L12 12L14 14" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 4L2 2M20 4L22 2M4 20L2 22M20 20L22 22" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
