// jest-setup.js

// Глушим предупреждения, которые могут появляться в тестах
jest.spyOn(console, 'warn').mockImplementation(() => {});

// Мок для AsyncStorage, так как в тестовой среде нет нативного хранилища
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);