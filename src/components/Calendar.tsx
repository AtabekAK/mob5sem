// src/components/Calendar.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CalendarProps {
  highlightedDates: string[];
  highlightColor: string;
}

const MONTH_NAMES = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const todayDateString = new Date().toISOString().split('T')[0];

const Calendar: React.FC<CalendarProps> = ({ highlightedDates, highlightColor }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeMonth = (amount: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const renderCells = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: JSX.Element[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      cells.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isHighlighted = highlightedDates.includes(dateString);
      const isToday = dateString === todayDateString;

      cells.push(
        <View key={day} style={styles.dayCell}>
          <View style={[styles.dayWrapper, isHighlighted && { backgroundColor: highlightColor }, isToday && styles.todayWrapper ]}>
            <Text style={[styles.dayText, isHighlighted && styles.highlightedDayText, isToday && styles.todayText]}>{day}</Text>
          </View>
        </View>
      );
    }
    return <View style={styles.daysContainer}>{cells}</View>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrow}><Text style={styles.arrowText}>‹</Text></TouchableOpacity>
        <Text style={styles.monthText}>{`${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`}</Text>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrow}><Text style={styles.arrowText}>›</Text></TouchableOpacity>
      </View>
      <View style={styles.weekContainer}>{WEEK_DAYS.map(day => <Text key={day} style={styles.dayNameText}>{day}</Text>)}</View>
      {renderCells()}
    </View>
  );
};

const styles = StyleSheet.create({
    container: { padding: 10, backgroundColor: '#fff', borderRadius: 12, marginTop: 10 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    arrow: { padding: 10 },
    arrowText: { fontSize: 24, fontWeight: 'bold', color: '#5A8DEE' },
    monthText: { fontSize: 18, fontWeight: 'bold' },
    weekContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
    dayNameText: { color: '#999', fontWeight: '600', width: 40, textAlign: 'center' },
    daysContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    dayCell: { width: `${100/7}%`, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' },
    dayWrapper: { width: '85%', height: '85%', borderRadius: 100, justifyContent: 'center', alignItems: 'center'},
    todayWrapper: { borderWidth: 2, borderColor: '#5A8DEE' },
    dayText: { fontSize: 14 },
    todayText: { fontWeight: 'bold', color: '#5A8DEE' },
    highlightedDayText: { color: 'white', fontWeight: 'bold' },
});

export default Calendar;