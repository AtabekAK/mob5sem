// src/hooks/useAsync-storage.ts

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function useAsyncStorage<T>(key: string, initialValue: T): [T, (value: T | ((prevState: T) => T)) => Promise<void>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    async function loadStoredValue() {
      try {
        const item = await AsyncStorage.getItem(key);
        // --- ИЗМЕНЕНИЕ №1: Защита от "битых" данных ---
        // Если item - null или undefined, используем initialValue и выходим
        if (item == null) {
          setStoredValue(initialValue);
          return;
        }
        // Пытаемся распарсить. Если не получается - используем initialValue
        const parsedItem = JSON.parse(item);
        setStoredValue(parsedItem);

      } catch (error) {
        console.warn(`Ошибка чтения из AsyncStorage ключа "${key}". Используется начальное значение. Ошибка:`, error);
        setStoredValue(initialValue);
      }
    }
    loadStoredValue();
  }, [key]);

  // Типизацию `setValue` делаем более гибкой, как у `setState`
  const setValue = async (value: T | ((prevState: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // --- ИЗМЕНЕНИЕ №2: Главная защита от записи undefined ---
      // Если по какой-то причине мы пытаемся сохранить undefined, мы этого не делаем.
      if (valueToStore === undefined) {
        console.warn(`Попытка сохранить undefined для ключа "${key}". Операция прервана.`);
        return;
      }

      setStoredValue(valueToStore);
      const jsonValue = JSON.stringify(valueToStore);
      await AsyncStorage.setItem(key, jsonValue);

    } catch (error) {
      console.error(`Ошибка сохранения в AsyncStorage по ключу "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export default useAsyncStorage;