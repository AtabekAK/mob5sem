// src/screens/GameScreen.tsx

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Habit, DayOfWeek, PlayerProfile, HabitCompletion } from '../types/types';
import useAsyncStorage from '../hooks/useAsyncStorage';
import AddHabitModal from '../components/AddHabitModal';
import ConfirmationModal from '../components/ConfirmationModal';
import HabitItem from '../components/HabitItem';
import ProgressBar from '../components/ProgressBar';
import { getTodayDayOfWeek, getTodayDateString } from '../utils/dateUtils';

const DAYS_OF_WEEK: DayOfWeek[] = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const GameScreen: React.FC = () => {
  const [habits, setHabits] = useAsyncStorage<Habit[]>('habits', []);
  const [profile, setProfile] = useAsyncStorage<PlayerProfile>('playerProfile', { totalPoints: 0, currentStreak: 0, bestStreak: 0, createdAt: new Date().toISOString(), });
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getTodayDayOfWeek());
  
  const [addHabitModalVisible, setAddHabitModalVisible] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
  const [habitToDeleteId, setHabitToDeleteId] = useState<string | null>(null);
  
  const todayDateString = useMemo(() => getTodayDateString(), []);
  // --- ИЗМЕНЕНИЕ: Определяем, является ли выбранный день сегодняшним ---
  const isTodaySelected = useMemo(() => selectedDay === getTodayDayOfWeek(), [selectedDay]);
  
  const habitsForSelectedDay = useMemo(() => {
    if (!habits) return [];
    return habits.filter(habit => habit && habit.daysOfWeek && habit.daysOfWeek.includes(selectedDay));
  }, [habits, selectedDay]);

  const dailyProgress = useMemo(() => {
    if (!habits) return 0;
    const todayHabits = habits.filter(h => h && h.daysOfWeek && h.daysOfWeek.includes(getTodayDayOfWeek()));
    if (todayHabits.length === 0) return 0;
    
    const completedToday = todayHabits.filter(h => h.history && h.history.some(entry => entry.date === todayDateString && entry.completed));
    return completedToday.length / todayHabits.length;
  }, [habits, todayDateString]);
  
  const addPoints = useCallback((amount: number) => { setProfile(prev => ({...prev, totalPoints: prev.totalPoints + amount})); }, [setProfile]);

  const handleToggleComplete = useCallback(async (habitId: string, completionData: Omit<HabitCompletion, 'date' | 'completedAt'>) => {
    setHabits(prevHabits => {
        const newHabits = prevHabits.map(habit => {
            if (habit.id === habitId) {
                const updatedHabit = { ...habit, history: [...habit.history] };
                const historyIndex = updatedHabit.history.findIndex(h => h.date === todayDateString);

                if (historyIndex > -1) {
                    if (!completionData.completed) {
                        updatedHabit.history.splice(historyIndex, 1);
                        addPoints(-10);
                    } else {
                        updatedHabit.history[historyIndex] = { ...updatedHabit.history[historyIndex], ...completionData, completed: true };
                    }
                } else {
                    if (completionData.completed) {
                        updatedHabit.history.push({
                            date: todayDateString,
                            completedAt: new Date().toISOString(),
                            ...completionData
                        });
                        addPoints(completionData.usedTimer ? 10 : 5);
                    }
                }
                return updatedHabit;
            }
            return habit;
        });
        return newHabits;
    });
  }, [setHabits, addPoints, todayDateString]);
  
  const handleSaveHabit = useCallback(async (habitToSave: Habit) => {
    setHabits(prev => habitToEdit ? prev.map(h => (h.id === habitToSave.id ? habitToSave : h)) : [...prev, habitToSave]);
    setAddHabitModalVisible(false);
    setHabitToEdit(null);
  }, [setHabits, habitToEdit]);
  
  const handleDeletePress = useCallback((id: string) => { setHabitToDeleteId(id); setDeleteConfirmationVisible(true); }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (habitToDeleteId) {
      setHabits(prev => prev.filter(h => h.id !== habitToDeleteId));
      setDeleteConfirmationVisible(false);
      setHabitToDeleteId(null);
    }
  }, [setHabits, habitToDeleteId]);

  const handleEditHabit = useCallback((habit: Habit) => { setHabitToEdit(habit); setAddHabitModalVisible(true); }, []);
  const handleCloseModal = useCallback(() => { setAddHabitModalVisible(false); setHabitToEdit(null); }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Трекер Привычек</Text>
        <Text style={styles.headerSubtitle}>Формируйте полезные привычки, достигайте целей.</Text>
        <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Сегодня</Text>
            <Text style={styles.progressPercentage}>{Math.round(dailyProgress * 100)}%</Text>
            <ProgressBar progress={dailyProgress} />
        </View>
        <View style={styles.daySelectorContainer}>
          {DAYS_OF_WEEK.map(day => (
            <TouchableOpacity key={day} style={[styles.dayButton, selectedDay === day && styles.selectedDayButton]} onPress={() => setSelectedDay(day)}>
              <Text style={[styles.dayText, selectedDay === day && styles.selectedDayText]}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
            data={habitsForSelectedDay || []}
            renderItem={({ item }) => (
                <HabitItem
                    habit={item}
                    todayCompletion={item.history.find(h => h.date === todayDateString)}
                    onDelete={handleDeletePress}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditHabit}
                    // --- ИЗМЕНЕНИЕ: Передаем флаг в компонент ---
                    isToday={isTodaySelected}
                />
            )}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>На {selectedDay.toLowerCase()} привычек нет.</Text>
                <Text style={styles.emptySubText}>Нажмите «+», чтобы добавить новую.</Text>
              </View>
            }
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        />
        <TouchableOpacity style={styles.fab} onPress={() => setAddHabitModalVisible(true)}><Text style={styles.fabIcon}>+</Text></TouchableOpacity>
        <AddHabitModal visible={addHabitModalVisible} onClose={handleCloseModal} onSave={handleSaveHabit} habitToEdit={habitToEdit} habitsOnSelectedDayCount={habitsForSelectedDay.length} />
        <ConfirmationModal visible={deleteConfirmationVisible} title="Удалить привычку" message="Вы уверены? Это действие необратимо." onCancel={() => setDeleteConfirmationVisible(false)} onConfirm={handleConfirmDelete} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flex: 1, paddingHorizontal: 15 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  headerSubtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 20 },
  progressCard: { backgroundColor: 'white', borderRadius: 16, padding: 15, marginBottom: 20 },
  progressTitle: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
  progressPercentage: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginTop: 4 },
  daySelectorContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, backgroundColor: 'white', borderRadius: 30, padding: 5 },
  dayButton: { flex: 1, paddingVertical: 10, borderRadius: 20, alignItems: 'center' },
  selectedDayButton: { backgroundColor: '#5A8DEE' },
  dayText: { fontSize: 14, fontWeight: 'bold', color: '#6B7280' },
  selectedDayText: { color: 'white' },
  fab: { position: 'absolute', right: 25, bottom: 25, width: 60, height: 60, borderRadius: 30, backgroundColor: '#5A8DEE', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  fabIcon: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#6B7280' },
  emptySubText: { fontSize: 14, color: '#9CA3AF', marginTop: 8 },
});

export default GameScreen;