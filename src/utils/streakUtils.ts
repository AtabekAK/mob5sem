// src/utils/streakUtils.ts

import { HabitCompletion } from '../types/types';

/**
 * Вычисляет текущий и лучший стрик (серию) на основе истории выполнений.
 * @param {HabitCompletion[]} history - Массив объектов выполнений привычки.
 * @returns {{ currentStreak: number, bestStreak: number }} - Объект с текущим и лучшим стриком.
 */
export const calculateStreaks = (history: HabitCompletion[]): { currentStreak: number; bestStreak: number } => {
  // --- ИСПРАВЛЕНИЕ: Проверяем, что history - это массив ---
  if (!Array.isArray(history)) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const completedDates = history
    .filter(h => h.completed)
    .map(h => h.date)
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (completedDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  let bestStreak = 0;
  let localCurrentStreak = 0;

  for (let i = 0; i < completedDates.length; i++) {
    if (i === 0) {
      localCurrentStreak = 1;
    } else {
      const currentDate = new Date(completedDates[i]);
      const prevDate = new Date(completedDates[i - 1]);
      const diffTime = prevDate.getTime() - currentDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        localCurrentStreak++;
      } else {
        if (localCurrentStreak > bestStreak) {
          bestStreak = localCurrentStreak;
        }
        localCurrentStreak = 1;
      }
    }
  }
  if (localCurrentStreak > bestStreak) {
    bestStreak = localCurrentStreak;
  }
  
  let currentStreak = 0;
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const lastCompletionDate = completedDates[0];

  if (lastCompletionDate === todayStr || lastCompletionDate === yesterdayStr) {
    currentStreak = 1;
     for (let i = 0; i < completedDates.length - 1; i++) {
        const currentDate = new Date(completedDates[i + 1]);
        const prevDate = new Date(completedDates[i]);
        const diffTime = prevDate.getTime() - currentDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
     }
  }

  return { currentStreak, bestStreak };
};