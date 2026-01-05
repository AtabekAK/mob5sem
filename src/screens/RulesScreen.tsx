// src/screens/RulesScreen.tsx

import React from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RuleItem = ({ title, description }: { title: string; description: string }) => (
    <View style={styles.ruleItem}>
        <Text style={styles.ruleTitle}>• {title}</Text>
        <Text style={styles.ruleDescription}>{description}</Text>
    </View>
);

const RulesScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.headerTitle}>Правила Игры</Text>
                
                <RuleItem
                    title="Управление привычками"
                    description="Создавайте, редактируйте и удаляйте привычки на главном экране. Каждой привычке можно задать название, длительность, дни недели, иконку и цвет."
                />
                <RuleItem
                    title="Ограничение — фокус на важном"
                    description="В один день не может быть больше 5 активных привычек. Это помогает концентрироваться на самом главном и не распыляться."
                />
                <RuleItem
                    title="Выполнение — таймер или вручную"
                    description="Запустите таймер для концентрации или отметьте привычку выполненной вручную. За выполнение с таймером начисляется больше очков (10), чем за ручное (5)."
                />
                <RuleItem
                    title="Система очков"
                    description="Очки начисляются за каждое выполнение. Соревнуйтесь с собой и ставьте новые рекорды!"
                />
                <RuleItem
                    title="Стрики (серии)"
                    description="Стрик — это количество дней подряд, в течение которых вы выполняете привычку. Пропуск дня сбрасывает стрик для этой привычки. Следите за сериями, чтобы выработать стабильность!"
                />
                <RuleItem
                    title="Статистика и прогресс"
                    description="На экране 'Прогресс' отслеживайте общую статистику и детальную информацию по каждой привычке, включая календарь выполнений."
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
    container: { padding: 20, paddingBottom: 40 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
    ruleItem: { marginBottom: 25 },
    ruleTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#333' },
    ruleDescription: { fontSize: 16, color: '#6B7280', lineHeight: 24, },
});

export default RulesScreen;