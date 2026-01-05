// src/screens/ProgressScreen.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// --- ВОТ ИСПРАВЛЕНИЕ: МЫ ДОЛЖНЫ БЫЛИ ИМПОРТИРОВАТЬ ЭТО ---
import AsyncStorage from '@react-native-async-storage/async-storage';
// -----------------------------------------------------------
import useAsyncStorage from '../hooks/useAsyncStorage';
import { Habit, PlayerProfile, ICONS } from '../types/types';
import { calculateStreaks } from '../utils/streakUtils';
import HabitDetailModal from '../components/HabitDetailModal';

import { useIsFocused } from '@react-navigation/native';

import RunningIcon from '../assets/icons/RunningIcon';
import ReadingIcon from '../assets/icons/ReadingIcon';
import BrainIcon from '../assets/icons/BrainIcon';
import HealthIcon from '../assets/icons/HealthIcon';
import GuitarIcon from '../assets/icons/GuitarIcon';
import BedIcon from '../assets/icons/BedIcon';
import DumbbellIcon from '../assets/icons/DumbbellIcon';
import PlantIcon from '../assets/icons/PlantIcon';
import PencilIcon from '../assets/icons/PencilIcon';
import TranslateIcon from '../assets/icons/TranslateIcon';
import LaptopIcon from '../assets/icons/LaptopIcon';
import MusicIcon from '../assets/icons/MusicIcon';

const IconComponents: { [key: string]: React.FC<any> } = {
  [ICONS.Running]: RunningIcon, [ICONS.Reading]: ReadingIcon, [ICONS.Brain]: BrainIcon,
  [ICONS.Health]: HealthIcon, [ICONS.Guitar]: GuitarIcon, [ICONS.Bed]: BedIcon,
  [ICONS.Dumbbell]: DumbbellIcon, [ICONS.Plant]: PlantIcon, [ICONS.Pencil]: PencilIcon,
  [ICONS.Translate]: TranslateIcon, [ICONS.Laptop]: LaptopIcon, [ICONS.Music]: MusicIcon,
};

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <View style={styles.statCard}><Text style={styles.statCardValue}>{value}</Text><Text style={styles.statCardLabel}>{label}</Text></View>
);

const ProgressHabitItem: React.FC<{ habit: Habit; onPress: () => void }> = ({ habit, onPress }) => {
    const IconComponent = IconComponents[habit.icon] || RunningIcon;
    return (
        <TouchableOpacity style={styles.habitItem} onPress={onPress}>
            <View style={[styles.habitIconContainer, { backgroundColor: habit.color }]}><IconComponent color="#FFF" width={24} height={24} /></View>
            <Text style={styles.habitName}>{habit.title}</Text><Text style={styles.arrowIcon}>›</Text>
        </TouchableOpacity>
    );
};

const ProgressScreen = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    const loadData = async () => {
      try {
        const habitsData = await AsyncStorage.getItem('habits');
        const profileData = await AsyncStorage.getItem('playerProfile');

        setHabits(habitsData ? JSON.parse(habitsData) : []);
        setProfile(profileData ? JSON.parse(profileData) : { totalPoints: 0, currentStreak: 0, bestStreak: 0, createdAt: '' });
      } catch (e) {
        console.error("Ошибка загрузки данных в ProgressScreen", e);
        setHabits([]);
        setProfile({ totalPoints: 0, currentStreak: 0, bestStreak: 0, createdAt: '' });
      }
    };

    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const playerStats = useMemo(() => {
    if (!habits || habits.length === 0) {
        return { totalCompletions: 0, bestStreakOverall: 0 };
    }
    const totalCompletions = habits.reduce((sum, habit) => (habit?.history ? sum + habit.history.filter(h => h.completed).length : sum), 0);
    const bestStreakOverall = habits.reduce((max, habit) => {
        if (habit?.history) {
            const { bestStreak } = calculateStreaks(habit.history.filter(h => h.completed));
            return bestStreak > max ? bestStreak : max;
        }
        return max;
    }, 0);
    return { totalCompletions, bestStreakOverall };
  }, [habits]);
  
  if (!profile) {
      return <SafeAreaView style={[styles.safeArea, {justifyContent: 'center'}]}><ActivityIndicator size="large" /></SafeAreaView>
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Общий Прогресс</Text>
            <View style={styles.statsContainer}>
                <StatCard label="Привычек выполнено" value={playerStats.totalCompletions} />
                <StatCard label="Лучший стрик (общий)" value={playerStats.bestStreakOverall} />
                <StatCard label="Всего очков" value={profile.totalPoints} />
            </View>
            <Text style={styles.listTitle}>Статистика по привычкам</Text>
             <FlatList
                data={habits || []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ProgressHabitItem habit={item} onPress={() => setSelectedHabit(item)}/>}
                 ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>У вас пока нет привычек.</Text>
                    <Text style={styles.emptySubText}>Создайте их на главном экране.</Text>
                  </View>
                }
             />
        </View>
        <HabitDetailModal visible={!!selectedHabit} onClose={() => setSelectedHabit(null)} habit={selectedHabit} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
    container: { flex: 1, paddingHorizontal: 15 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 5 },
    statCard: {
      flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 15, alignItems: 'center', marginHorizontal: 5,
      ...Platform.select({
        ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.41, },
        android: { elevation: 2, },
        web: { boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }
      })
    },
    statCardValue: { fontSize: 22, fontWeight: 'bold' },
    statCardLabel: { fontSize: 12, color: '#6B7280', textAlign: 'center', marginTop: 5 },
    listTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, paddingHorizontal: 5 },
    habitItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 10, },
    habitIconContainer: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    habitName: { flex: 1, fontSize: 16, fontWeight: '600' },
    arrowIcon: { fontSize: 20, color: '#C7C7CC' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
    emptyText: { fontSize: 18, fontWeight: '600', color: '#6B7280' },
    emptySubText: { fontSize: 14, color: '#9CA3AF', marginTop: 8 },
});

export default ProgressScreen;