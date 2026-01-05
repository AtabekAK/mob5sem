// src/components/HabitItem.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Habit, HabitCompletion, ICONS } from '../types/types';
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
  [ICONS.Running]: RunningIcon, [ICONS.Reading]: ReadingIcon, [ICONS.Brain]: BrainIcon, [ICONS.Health]: HealthIcon,
  [ICONS.Guitar]: GuitarIcon, [ICONS.Bed]: BedIcon, [ICONS.Dumbbell]: DumbbellIcon, [ICONS.Plant]: PlantIcon,
  [ICONS.Pencil]: PencilIcon, [ICONS.Translate]: TranslateIcon, [ICONS.Laptop]: LaptopIcon, [ICONS.Music]: MusicIcon,
};

interface HabitItemProps {
  habit: Habit;
  todayCompletion: HabitCompletion | undefined;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completion: Omit<HabitCompletion, 'date' | 'completedAt'>) => void;
  onEdit: (habit: Habit) => void;
  // --- ИЗМЕНЕНИЕ: Добавляем новый проп ---
  isToday: boolean;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, todayCompletion, onDelete, onToggleComplete, onEdit, isToday }) => {
  const isCompleted = !!todayCompletion?.completed;
  const totalSeconds = habit.durationMinutes * 60;
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalSeconds);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0 && !isCompleted) {
      interval = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      onToggleComplete(habit.id, { completed: true, usedTimer: true });
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, timeLeft, isCompleted, habit.id, onToggleComplete]);
  
  useEffect(() => {
    if (isCompleted) {
      setIsActive(false);
      setTimeLeft(totalSeconds);
    }
  }, [isCompleted, totalSeconds]);

  const handlePlayPause = () => { if (isCompleted) return; setIsActive(prev => !prev); };
  const handleManualToggle = () => {
    if (!isCompleted) { onToggleComplete(habit.id, { completed: true, usedTimer: false }); }
    else { onToggleComplete(habit.id, { completed: false, usedTimer: false }); }
  };
  
  const progress = isCompleted ? 1 : isActive ? (totalSeconds - timeLeft) / totalSeconds : 0;
  
  const size = 56, strokeWidth = 5, radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;
  const IconComponent = IconComponents[habit.icon] || RunningIcon;

  return (
    <TouchableOpacity onPress={() => onEdit(habit)} activeOpacity={0.8} style={[styles.container, isCompleted && styles.completedContainer, !isToday && styles.disabledItem]}>
      <View style={styles.iconWrapper}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle stroke={isCompleted ? habit.color : '#E6E6E6'} fill="none" cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} opacity={0.4}/>
          <Circle stroke={habit.color} fill="none" cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
        </Svg>
        <View style={styles.icon}><IconComponent color={isCompleted ? '#FFF' : habit.color} width={28} height={28}/></View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{habit.title}</Text>
        <Text style={styles.durationText}>{habit.durationMinutes} мин.</Text>
      </View>
      <View style={styles.actionsContainer}>
        {/* --- ИЗМЕНЕНИЕ: Добавляем disabled и стиль для неактивных кнопок --- */}
        {!isCompleted && (
          <TouchableOpacity style={[styles.actionButton, !isToday && styles.disabledButton]} onPress={handlePlayPause} disabled={!isToday}>
            <Text style={styles.actionIcon}>{isActive ? '❚❚' : '▶'}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.actionButton, !isToday && styles.disabledButton]} onPress={handleManualToggle} disabled={!isToday}>
          <Text style={styles.actionIcon}>{isCompleted ? '✕' : '✓'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(habit.id)}>
          <Text style={styles.actionIcon}>🗑</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 16, padding: 12, marginBottom: 12, ...Platform.select({ ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84 }, android: { elevation: 5 }, web: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } }) },
  disabledItem: { opacity: 0.5 },
  completedContainer: { backgroundColor: '#F0FDF4' },
  iconWrapper: { width: 56, height: 56, justifyContent: 'center', alignItems: 'center' },
  icon: { position: 'absolute' },
  infoContainer: { flex: 1, marginLeft: 16 },
  nameText: { fontSize: 17, fontWeight: '600' },
  durationText: { fontSize: 14, color: '#888' },
  actionsContainer: { flexDirection: 'row', alignItems: 'center' },
  actionButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  actionIcon: { fontSize: 18, color: '#555' },
  disabledButton: { backgroundColor: '#E5E7EB' }, // Стиль для заблокированной кнопки
});

export default HabitItem;