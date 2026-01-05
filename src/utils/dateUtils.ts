// src/utils/dateUtils.ts

import { DayOfWeek } from '../types/types';

/**
 * Возвращает сегодняшний день недели в формате 'Пн', 'Вт' и т.д.
 * @returns {DayOfWeek} - Строка с коротким названием дня недели.
 */
export const getTodayDayOfWeek = (): DayOfWeek => {
  // В JS getDay() 0=Вс, 1=Пн. Скорректируем, чтобы Вс был последним
  const days: DayOfWeek[] = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return days[new Date().getDay()];
};

/**
 * Возвращает сегодняшнюю дату в формате 'YYYY-MM-DD'.
 * Это необходимо для хранения истории выполнений.
 * @returns {string} - Дата в виде строки.
 */
export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};