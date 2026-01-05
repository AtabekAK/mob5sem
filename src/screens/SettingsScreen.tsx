// src/screens/SettingsScreen.tsx

import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, View, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { User } from '../types/types';
import ConfirmationModal from '../components/ConfirmationModal';

// Добавляем onLogout в пропсы
const SettingsScreen = ({ onLogout }: { onLogout: () => void }) => {
    const [user, setUser] = useState<User | null>(null);
    const [resetModalVisible, setResetModalVisible] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            const userDataString = await AsyncStorage.getItem('user-profile');
            if (userDataString) {
                setUser(JSON.parse(userDataString));
            }
        };
        loadUserData();
    }, []);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Ошибка', 'Необходимо разрешение на доступ к галерее!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true,
            aspect: [1, 1], quality: 1,
        });

        if (!result.canceled && user) {
            const newUser = { ...user, avatarUri: result.assets[0].uri };
            setUser(newUser);
            await AsyncStorage.setItem('user-profile', JSON.stringify(newUser));
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('user-session');
        // Вызываем функцию из App.tsx, чтобы он обновил интерфейс
        onLogout();
    };
    
    const handleResetProgress = async () => {
        await AsyncStorage.removeItem('habits');
        await AsyncStorage.removeItem('playerProfile');
        setResetModalVisible(false);
        Alert.alert("Прогресс сброшен", "Все ваши привычки и очки удалены.");
    };
    
    if (!user) {
        return <SafeAreaView style={styles.safeArea}><ActivityIndicator/></SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Профиль и Настройки</Text>
                <View style={styles.profileSection}>
                    <TouchableOpacity onPress={pickImage}>
                        <Image 
                           source={user.avatarUri ? { uri: user.avatarUri } : require('../assets/icons/default-avatar.png')} 
                           style={styles.avatar} 
                        />
                         <View style={styles.avatarEditHint}><Text style={styles.avatarEditText}>✎</Text></View>
                    </TouchableOpacity>
                    <Text style={styles.username}>{user.username}</Text>
                    <Text style={styles.registrationDate}>
                        Дата регистрации: {new Date(user.registrationDate).toLocaleDateString()}
                    </Text>
                </View>

                <View style={styles.settingsGroup}>
                    <Text style={styles.groupTitle}>Управление данными</Text>
                    <TouchableOpacity style={styles.settingButton} onPress={() => setResetModalVisible(true)}>
                        <Text style={styles.settingButtonText}>Сбросить прогресс привычек</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.settingsGroup}>
                    <Text style={styles.groupTitle}>Аккаунт</Text>
                    <TouchableOpacity style={[styles.settingButton, styles.logoutButton]} onPress={handleLogout}>
                        <Text style={[styles.settingButtonText, styles.logoutButtonText]}>Выйти из аккаунта</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ConfirmationModal 
                visible={resetModalVisible} title="Подтвердите сброс"
                message="Вы уверены, что хотите удалить все привычки и очки? Это действие необратимо."
                confirmText="Да, сбросить"
                onCancel={() => setResetModalVisible(false)} onConfirm={handleResetProgress}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
    container: { flex: 1, padding: 20 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    profileSection: { alignItems: 'center', marginBottom: 30, backgroundColor: 'white', borderRadius: 16, padding: 20 },
    avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#5A8DEE' },
    avatarEditHint: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'white', padding: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ccc'},
    avatarEditText: { fontSize: 18 },
    username: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
    registrationDate: { fontSize: 14, color: 'gray', marginTop: 4 },
    settingsGroup: { marginBottom: 20 },
    groupTitle: { fontSize: 18, fontWeight: '600', color: '#4B5563', marginBottom: 10 },
    settingButton: { backgroundColor: '#FEE2E2', borderRadius: 10, padding: 15, alignItems: 'center' },
    settingButtonText: { color: '#B91C1C', fontSize: 16, fontWeight: 'bold' },
    logoutButton: { backgroundColor: '#E0E7FF' },
    logoutButtonText: { color: '#4338CA'},
});

export default SettingsScreen;