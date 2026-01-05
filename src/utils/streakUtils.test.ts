// src/utils/streakUtils.test.ts

import { calculateStreaks } from './streakUtils';
import { HabitCompletion } from '../types/types';

// describe - это группа тестов для одного модуля
describe('calculateStreaks', () => {

  // it или test - это один конкретный тест-кейс
  it('should return 0 streaks for an empty history', () => {
    const history: HabitCompletion[] = [];
    expect(calculateStreaks(history)).toEqual({ currentStreak: 0, bestStreak: 0 });
  });

  it('should return a streak of 1 if completed only today', () => {
    const today = new Date().toISOString().split('T')[0];
    const history: HabitCompletion[] = [{ date: today, completed: true, usedTimer: false }];
    expect(calculateStreaks(history)).toEqual({ currentStreak: 1, bestStreak: 1 });
  });

  it('should calculate a continuous current streak correctly', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dayBefore = new Date(today);
    dayBefore.setDate(today.getDate() - 2);

    const history: HabitCompletion[] = [
      { date: dayBefore.toISOString().split('T')[0], completed: true, usedTimer: false },
      { date: yesterday.toISOString().split('T')[0], completed: true, usedTimer: false },
      { date: today.toISOString().split('T')[0], completed: true, usedTimer: false },
    ];
    expect(calculateStreaks(history)).toEqual({ currentStreak: 3, bestStreak: 3 });
  });

  it('should reset current streak if there is a gap of more than one day', () => {
    const today = new Date();
    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(today.getDate() - 2); // Пропуск вчерашнего дня

    const history: HabitCompletion[] = [
      { date: dayBeforeYesterday.toISOString().split('T')[0], completed: true, usedTimer: false },
    ];
    expect(calculateStreaks(history)).toEqual({ currentStreak: 0, bestStreak: 1 });
  });
  
  it('should correctly identify the best streak when it is not the current one', () => {
    const history: HabitCompletion[] = [
      // Последний стрик (текущий) - 2 дня
      { date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], completed: true, usedTimer: false },
      { date: new Date().toISOString().split('T')[0], completed: true, usedTimer: false },
      // Старый, но более длинный стрик - 3 дня
      { date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], completed: true, usedTimer: false },
      { date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], completed: true, usedTimer: false },
      { date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0], completed: true, usedTimer: false },
    ];
    
    expect(calculateStreaks(history)).toEqual({ currentStreak: 2, bestStreak: 3 });
  });

  it('should ignore non-completed entries in history', () => {
    const today = new Date().toISOString().split('T')[0];
    const history: HabitCompletion[] = [
        { date: today, completed: false, usedTimer: false }
    ];
    expect(calculateStreaks(history)).toEqual({ currentStreak: 0, bestStreak: 0 });
  });
});