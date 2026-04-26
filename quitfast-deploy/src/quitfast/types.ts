export type Step = 'onboarding' | 'auth' | 'dashboard' | 'blogs' | 'mood_selection' | 'mood_report' | 'profile' | 'character_selection' | 'avatar_customizer' | 'rewards' | 'add_reward' | 'edit_rewards' | 'program' | 'crisis' | 'ranking' | 'settings' | 'habit_edit' | 'audio_prototype' | 'goals' | 'health_goals' | 'account_info' | 'notifications' | 'legal' | 'badges' | 'premium' | 'puzzle';

export interface OnboardingData {
  age: number;
  dailyCigarettes: number;
  packsPerDay: number;
  cigarettesPerPack: number;
  pricePerPack: number;
}

export interface Reward {
  id: string;
  name: string;
  price: number;
  currentAmount: number;
  image?: string;
  icon?: any;
  isCompleted?: boolean;
}

export interface ProgramDay {
  day: number;
  title: string;
  scientificStatus: string;
  task: string;
  suggestion: string;
  tip: string;
}

export interface NotificationSettings {
  dailyCheck: boolean;
  programNotifs: boolean;
  goalNotifs: boolean;
  updateNotifs: boolean;
  dailyTime: string;
  programTime: string;
}
