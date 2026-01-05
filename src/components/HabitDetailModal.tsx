// src/components/HabitDetailModal.tsx

import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Habit } from '../types/types';
import { calculateStreaks } from '../utils/streakUtils';
import Calendar from './Calendar';

interface HabitDetailModalProps {
  visible: boolean;
  onClose: () => void;
  habit: Habit | null;
}

const StatBox: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
  <View style={styles.statBox}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>
);

const HabitDetailModal: React.FC<HabitDetailModalProps> = ({ visible, onClose, habit }) => {
  const stats = useMemo(() => {
    if (!habit) return null;
    
    const completedHistory = habit.history.filter(h => h.completed);
    const { currentStreak, bestStreak } = calculateStreaks(completedHistory);
    const totalCompletions = completedHistory.length;
    
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const completionsThisMonth = completedHistory.filter(h => {
       const date = new Date(h.date);
       return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    }).length;
    
    return { currentStreak, bestStreak, totalCompletions, completionsThisMonth };
  }, [habit]);

  if (!habit || !stats) return null;

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
           <View style={styles.header}>
              <Text style={styles.title} numberOfLines={1}>{habit.title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}><Text style={styles.closeButtonText}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.statsGrid}>
                    <StatBox label="Текущий стрик" value={stats.currentStreak} />
                    <StatBox label="Лучший стрик" value={stats.bestStreak} />
                    <StatBox label="Выполнено (месяц)" value={stats.completionsThisMonth} />
                    <StatBox label="Выполнено (всего)" value={stats.totalCompletions} />
                </View>
                 <Text style={styles.calendarTitle}>История выполнений</Text>
                 <Calendar 
                    highlightedDates={habit.history.filter(h => h.completed).map(h => h.date)} 
                    highlightColor={habit.color} 
                 />
            </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)', },
    modalContainer: { backgroundColor: '#F3F4F6', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, height: '85%', },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, },
    title: { fontSize: 22, fontWeight: 'bold', flex: 1, marginRight: 10 },
    closeButton: { padding: 8 },
    closeButtonText: { fontSize: 24, color: '#888' },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    statBox: { width: '48%', backgroundColor: 'white', borderRadius: 12, padding: 15, alignItems: 'center', marginBottom: 12 },
    statValue: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
    statLabel: { fontSize: 14, color: '#6B7280', marginTop: 4, textAlign: 'center' },
    calendarTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
});

export default HabitDetailModal;