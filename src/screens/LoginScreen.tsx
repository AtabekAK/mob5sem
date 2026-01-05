// src/screens/LoginScreen.tsx

import React, { useState } from 'react';
//  Импортируем ActivityIndicator для спиннера загрузки ---
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/types';

type LoginScreenProps = {
  onLoginSuccess: () => void;
  navigation: {
    navigate: (screen: string) => void;
  };
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Состояние для отслеживания загрузки ---
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Ошибка', 'Все поля должны быть заполнены');
      return;
    }
    setIsLoading(true); // Включаем индикатор
    try {
      const storedUser = await AsyncStorage.getItem('user-profile');
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        if (user.username === username.trim() && user.password === password) {
          await AsyncStorage.setItem('user-session', 'active');
          onLoginSuccess();
        } else {
          Alert.alert('Ошибка', 'Неверный логин или пароль');
        }
      } else {
        Alert.alert('Ошибка', 'Пользователь не найден. Пожалуйста, зарегистрируйтесь.');
      }
    } catch (e) {
      Alert.alert('Ошибка', 'Произошла ошибка при входе');
    } finally {
      setIsLoading(false); // Выключаем индикатор в любом случае
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Вход</Text>
      
      <TextInput style={styles.input} placeholder="Логин" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Пароль" value={password} onChangeText={setPassword} secureTextEntry />

      {/* --- ИЗМЕНЕНИЕ: Кнопка теперь показывает индикатор загрузки --- */}
      <TouchableOpacity style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Войти</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={isLoading}>
        <Text style={styles.linkText}>Нет аккаунта? Зарегистрироваться</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F3F4F6' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#5A8DEE', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { backgroundColor: '#A9C4F7' }, // Стиль для неактивной кнопки
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#5A8DEE', textAlign: 'center', marginTop: 20 },
});

export default LoginScreen;