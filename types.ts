export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  joinedAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string; // e.g., Health, Productivity, Mindfulness
  frequency: string;
  createdAt: string;
  completedDates: string[]; // ISO Date strings YYYY-MM-DD
  color: string;
  reminderTime?: string;
}

export interface AIAdvice {
  text: string;
  type: 'motivation' | 'suggestion' | 'insight';
}

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  summary: string;
  mealName: string;
}

export type ThemeColor = 'blue' | 'green' | 'purple' | 'rose' | 'amber' | 'cyan';
