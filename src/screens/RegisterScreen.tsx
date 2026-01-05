// src/screens/RegisterScreen.tsx

import React, { useState } from 'react';
// --- ИЗМЕНЕНИЕ: Импортируем ActivityIndicator ---
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/types';

type RegisterScreenProps = {
  navigation: {
    goBack: () => void;
  };
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // --- ИЗМЕНЕНИЕ: Состояние для отслеживания загрузки ---
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert('Ошибка', 'Все поля должны быть заполнены');
      return;
    }
    
    setIsLoading(true); // Включаем индикатор
    try {
        const existingUser = await AsyncStorage.getItem('user-profile');
        if (existingUser && JSON.parse(existingUser).username === username.trim()) {
            Alert.alert('Ошибка', 'Пользователь с таким логином уже существует');
            setIsLoading(false);
            return;
        }
        
        const newUser: User = {
          username: username.trim(),
          password,
          registrationDate: new Date().toISOString(),
        };

        await AsyncStorage.setItem('user-profile', JSON.stringify(newUser));
        Alert.alert('Успех!', 'Вы зарегистрированы. Теперь можете войти.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось сохранить данные');
    } finally {
      setIsLoading(false); // Выключаем индикатор
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
      <TextInput style={styles.input} placeholder="Придумайте логин" value={username} onChangeText={setUsername} autoCapitalize="none"/>
      <TextInput style={styles.input} placeholder="Придумайте пароль" value={password} onChangeText={setPassword} secureTextEntry/>
      
      {/* --- ИЗМЕНЕНИЕ: Кнопка теперь показывает индикатор загрузки --- */}
      <TouchableOpacity style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleRegister} disabled={isLoading}>
        {isLoading ? (
            <ActivityIndicator color="white"/>
        ) : (
            <Text style={styles.buttonText}>Зарегистрироваться</Text>
        )}
      </TouchableOpacity>
      
       <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
        <Text style={styles.linkText}>Уже есть аккаунт? Войти</Text>
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

export default RegisterScreen;