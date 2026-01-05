// src/screens/RegisterScreen.tsx

import React, { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateUsername = (text: string) => {
    setUsername(text);
    const regex = /^[a-zA-Z]+$/;
    if (!text) {
        setUsernameError('Логин не может быть пустым');
    } else if (!regex.test(text)) {
        setUsernameError('Логин должен состоять только из английских букв');
    } else {
        setUsernameError('');
    }
  };
  
  const validatePassword = (text: string) => {
    setPassword(text);
    if (!text) {
        setPasswordError('Пароль не может быть пустым');
    } else if (text.length < 6) {
        setPasswordError('Пароль должен быть не менее 6 символов');
    } else {
        setPasswordError('');
    }
  }

  const handleRegister = async () => {
    validateUsername(username);
    validatePassword(password);
    
    if (usernameError || passwordError || !username || !password) {
        Alert.alert('Ошибка', 'Пожалуйста, исправьте ошибки в форме');
        return;
    }
    
    setIsLoading(true);
    try {
        const existingUsersString = await AsyncStorage.getItem('users-list');
        const users = existingUsersString ? JSON.parse(existingUsersString) : [];

        if (users.some((user: User) => user.username === username.trim())) {
            Alert.alert('Ошибка', 'Пользователь с таким логином уже существует');
            setIsLoading(false);
            return;
        }
        
        const newUser: User = {
          username: username.trim(),
          password,
          registrationDate: new Date().toISOString(),
        };

        users.push(newUser);
        await AsyncStorage.setItem('users-list', JSON.stringify(users));
        
        Alert.alert('Успех!', 'Вы зарегистрированы. Теперь можете войти.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось сохранить данные');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
      
      <View style={styles.inputContainer}>
          <TextInput 
              style={[styles.input, !!usernameError && styles.inputError]} 
              placeholder="Придумайте логин" 
              value={username} 
              onChangeText={validateUsername} 
              autoCapitalize="none"
          />
          {!!usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
      </View>

      <View style={styles.inputContainer}>
          <TextInput 
              style={[styles.input, !!passwordError && styles.inputError]} 
              placeholder="Придумайте пароль" 
              value={password} 
              onChangeText={validatePassword} 
              secureTextEntry
          />
          {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
      </View>
      
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
  inputContainer: { marginBottom: 15 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: 'transparent' },
  inputError: { borderColor: '#E53E3E' },
  errorText: { color: '#E53E3E', marginTop: 5, marginLeft: 5 },
  button: { backgroundColor: '#5A8DEE', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { backgroundColor: '#A9C4F7' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#5A8DEE', textAlign: 'center', marginTop: 20 },
});

export default RegisterScreen;