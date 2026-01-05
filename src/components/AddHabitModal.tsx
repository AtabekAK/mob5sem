// src/components/AddHabitModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, } from 'react-native';
import { Habit, DayOfWeek, ICONS, COLORS } from '../types/types';
import DaySelector from './DaySelector';

// Импорты иконок
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
  [ICONS.Running]: RunningIcon,
  [ICONS.Reading]: ReadingIcon,
  [ICONS.Brain]: BrainIcon,
  [ICONS.Health]: HealthIcon,
  [ICONS.Guitar]: GuitarIcon,
  [ICONS.Bed]: BedIcon,
  [ICONS.Dumbbell]: DumbbellIcon,
  [ICONS.Plant]: PlantIcon,
  [ICONS.Pencil]: PencilIcon,
  [ICONS.Translate]: TranslateIcon,
  [ICONS.Laptop]: LaptopIcon,
  [ICONS.Music]: MusicIcon,
};

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (habit: Habit) => void;
  habitToEdit: Habit | null;
  habitsOnSelectedDayCount: number;
}

const MAX_HABITS_PER_DAY = 5;

const AddHabitModal: React.FC<AddHabitModalProps> = ({ visible, onClose, onSave, habitToEdit, habitsOnSelectedDayCount }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('30');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string>(Object.keys(ICONS)[0]);
  const [selectedColor, setSelectedColor] = useState<string>(Object.values(COLORS)[0]);

  useEffect(() => {
    if (habitToEdit) {
      setTitle(habitToEdit.title);
      setDuration(String(habitToEdit.durationMinutes));
      setSelectedDays(habitToEdit.daysOfWeek);
      setSelectedIcon(habitToEdit.icon);
      setSelectedColor(habitToEdit.color);
    } else {
      resetForm();
    }
  }, [habitToEdit]);

  const resetForm = () => {
    setTitle('');
    setDuration('30');
    setSelectedDays([]);
    setSelectedIcon(Object.keys(ICONS)[0]);
    setSelectedColor(Object.values(COLORS)[0]);
  };

  const handleSelectDay = (day: DayOfWeek) => {
    const isEditing = !!habitToEdit;
    const currentCount = isEditing ? habitsOnSelectedDayCount - 1 : habitsOnSelectedDayCount;

    if (!selectedDays.includes(day) && currentCount >= MAX_HABITS_PER_DAY && !isEditing) {
        Alert.alert('Ограничение', `Вы уже добавили ${MAX_HABITS_PER_DAY} привычек на этот день.`);
        return;
    }
    
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Название привычки не может быть пустым.');
      return;
    }
    const durationNum = parseInt(duration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('Ошибка', 'Длительность должна быть положительным числом.');
      return;
    }
    if (selectedDays.length === 0) {
      Alert.alert('Ошибка', 'Выберите хотя бы один день недели.');
      return;
    }
    
    const newHabit: Habit = {
      id: habitToEdit ? habitToEdit.id : Date.now().toString(),
      title: title.trim(),
      durationMinutes: durationNum,
      daysOfWeek: selectedDays,
      icon: selectedIcon,
      color: selectedColor,
      createdAt: habitToEdit ? habitToEdit.createdAt : new Date().toISOString(),
      history: habitToEdit ? habitToEdit.history : [],
    };

    onSave(newHabit);
    resetForm();
    onClose();
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>{habitToEdit ? 'Редактировать привычку' : 'Новая привычка'}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}><Text style={styles.closeButtonText}>✕</Text></TouchableOpacity>
            </View>
            <Text style={styles.label}>Название</Text>
            <TextInput style={styles.input} placeholder="Например, Чтение" value={title} onChangeText={setTitle}/>
            <Text style={styles.label}>Длительность (минут)</Text>
            <TextInput style={styles.input} value={duration} onChangeText={setDuration} keyboardType="numeric"/>
            <Text style={styles.label}>Дни недели</Text>
            <DaySelector selectedDays={selectedDays} onSelectDay={handleSelectDay} />
            <Text style={styles.label}>Иконка</Text>
            <View style={styles.gridContainer}>
              {Object.entries(IconComponents).map(([key, IconComponent]) => (
                <TouchableOpacity key={key} style={[ styles.iconButton, selectedIcon === key && { backgroundColor: selectedColor, borderColor: selectedColor }]} onPress={() => setSelectedIcon(key)}>
                  <IconComponent color={selectedIcon === key ? '#FFF' : '#555'} width={28} height={28} />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Цвет</Text>
            <View style={styles.gridContainer}>
              {Object.values(COLORS).map((color) => (
                <TouchableOpacity key={color} style={[ styles.colorButton, { backgroundColor: color }, selectedColor === color && styles.selectedColor ]} onPress={() => setSelectedColor(color)}/>
              ))}
            </View>
          </ScrollView>
           <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{habitToEdit ? 'Сохранить' : 'Создать'}</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)', },
    container: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%', },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, },
    title: { fontSize: 22, fontWeight: 'bold', },
    closeButton: { padding: 8, },
    closeButtonText: { fontSize: 24, color: '#888', },
    label: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 10, color: '#333', },
    input: { backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB', },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', },
    iconButton: { width: '15%', aspectRatio: 1, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10, },
    colorButton: { width: '15%', aspectRatio: 1, borderRadius: 50, marginBottom: 10, },
    selectedColor: { borderWidth: 3, borderColor: '#333', },
    saveButton: { backgroundColor: '#5A8DEE', borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 20, },
    saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', },
});

export default AddHabitModal;