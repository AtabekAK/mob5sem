// src/screens/LoginScreen.tsx

import React, { useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Ошибка', 'Все поля должны быть заполнены');
      return;
    }
    setIsLoading(true);
    try {
        const usersDataString = await AsyncStorage.getItem('users-list');
        const users = usersDataString ? JSON.parse(usersDataString) : [];
        const user: User | undefined = users.find((u: User) => u.username === username.trim());

      if (user && user.password === password) {
          const userForSession = { ...user };
          delete userForSession.password; // Не храним пароль в активной сессии
          await AsyncStorage.setItem('user-session-profile', JSON.stringify(userForSession));
          onLoginSuccess();
      } else {
        Alert.alert('Ошибка', 'Неверный логин или пароль');
      }
    } catch (e) {
      Alert.alert('Ошибка', 'Произошла ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Вход</Text>
      
      <TextInput style={styles.input} placeholder="Логин" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Пароль" value={password} onChangeText={setPassword} secureTextEntry />

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
  buttonDisabled: { backgroundColor: '#A9C4F7' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#5A8DEE', textAlign: 'center', marginTop: 20 },
});

export default LoginScreen;