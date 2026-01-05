// src/components/DaySelector.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { DayOfWeek } from '../types/types';

interface DaySelectorProps {
  selectedDays: DayOfWeek[];
  onSelectDay: (day: DayOfWeek) => void;
  style?: StyleProp<ViewStyle>;
}

const DAYS: DayOfWeek[] = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const DaySelector: React.FC<DaySelectorProps> = ({ selectedDays, onSelectDay, style }) => {
  return (
    <View style={[styles.container, style]}>
      {DAYS.map((day) => {
        const isSelected = selectedDays.includes(day);
        return (
          <TouchableOpacity
            key={day}
            style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
            onPress={() => onSelectDay(day)}
          >
            <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
              {day}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', },
  dayButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0', borderWidth: 1, borderColor: '#E0E0E0', },
  dayButtonSelected: { backgroundColor: '#5A8DEE', borderColor: '#5A8DEE', },
  dayText: { fontSize: 14, fontWeight: 'bold', color: '#888', },
  dayTextSelected: { color: '#FFFFFF', },
});

export default DaySelector;