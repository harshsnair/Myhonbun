export interface PolaroidItem {
  id: string;
  title: string;
  caption: string;
  date: string;
  src: string;
  noteOnBack: string;
  rotation: number; // degrees
  tapeColor: 'pink' | 'yellow' | 'lavender';
  liked: boolean;
  category: 'favorite' | 'candid' | 'silly' | 'date';
  xOffset?: number; // relative scatter offset
  yOffset?: number;
}

export interface LoveCoupon {
  id: string;
  title: string;
  description: string;
  category: 'pamper' | 'adventure' | 'comfort' | 'food' | 'chaos';
  icon: string;
  isRedeemed: boolean;
  redeemedAt?: string;
  terms: string;
}

export interface AdoreReason {
  id: number;
  title: string;
  description: string;
  category: 'sweet' | 'heart' | 'chaos' | 'comfort';
  emoji: string;
  isUnlocked: boolean;
}

export interface Milestone {
  id: string;
  period: string;
  title: string;
  date: string;
  description: string;
  highlight: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  sweetMessage: string;
}
