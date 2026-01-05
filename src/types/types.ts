// src/types/types.ts

// Тип для дней недели, как и был. 0 - Пн, 6 - Вс для удобства работы с массивами.
export type DayOfWeek = 'Пн' | 'Вт' | 'Ср' | 'Чт' | 'Пт' | 'Сб' | 'Вс';

// 2.3 Выполнение привычки (HabitCompletion)
export interface HabitCompletion {
  date: string; // 'YYYY-MM-DD'
  completed: boolean;
  completedAt?: string; // ISO-8601 string, время завершения
  usedTimer: boolean;
}

// 2.2 Привычка (Habit)
export interface Habit {
  id: string;
  title: string; // было 'name'
  durationMinutes: number; // было 'duration'
  daysOfWeek: DayOfWeek[]; // было 'days'
  icon: string;
  color: string;
  createdAt: string; // ISO-8601 string, дата создания
  history: HabitCompletion[];
}

// 2.1 Пользователь (локальный профиль)
export interface PlayerProfile {
  totalPoints: number;
  currentStreak: number;
  bestStreak: number;
  createdAt: string; // ISO-8601 string
}

// Константы для иконок и цветов остаются, они полезны
export const ICONS = {
  Running: 'Running',
  Reading: 'Reading',
  Brain: 'Brain',
  Health: 'Health',
  Guitar: 'Guitar',
  Bed: 'Bed',
  Dumbbell: 'Dumbbell',
  Plant: 'Plant',
  Pencil: 'Pencil',
  Translate: 'Translate',
  Laptop: 'Laptop',
  Music: 'Music',
};

export const COLORS = {
  blue: '#5A8DEE',
  green: '#3DD598',
  orange: '#FF9F43',
  red: '#FF4D4D',
  purple: '#A076F9',
  teal: '#00C6AE',
  yellow: '#FFCB2B',
  pink: '#F778A1',
  indigo: '#727CF5',
  gray: '#A0A0A0',
};
export interface User {
  username: string;
  // пароль мы не храним напрямую в AsyncStorage по соображениям безопасности,
  // в реальном приложении был бы хеш. Для нашего случая храним просто для логики входа.
  password?: string;
  registrationDate: string; // ISO-8601 string
  avatarUri?: string; // URI для изображения аватарки (локальный или base64)
}