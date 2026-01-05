// App.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GameScreen from './src/screens/GameScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import RulesScreen from './src/screens/RulesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabNavigator = ({ onLogout }: { onLogout: () => void }) => {
    const TabBarIcon = ({ focused, name }: { name: string, focused: boolean }) => {
        let icon;
        if (name === "Игра") icon = '🎮';
        else if (name === "Прогресс") icon = '📊';
        else if (name === "Правила") icon = '📜';
        else if (name === "Настройки") icon = '⚙️';
        return <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused }) => <TabBarIcon name={route.name} focused={focused} />,
                tabBarActiveTintColor: '#5A8DEE',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: { height: 60, paddingBottom: 5, paddingTop: 5, backgroundColor: 'white', borderTopColor: '#E0E0E0', borderTopWidth: 1, },
                tabBarLabelStyle: { fontSize: 12, fontWeight: '600' }
            })}
        >
          <Tab.Screen name="Игра" component={GameScreen} />
          <Tab.Screen name="Прогресс" component={ProgressScreen} />
          <Tab.Screen name="Правила" component={RulesScreen} />
          {/* Передаем функцию выхода в экран настроек */}
          <Tab.Screen name="Настройки">
            {props => <SettingsScreen {...props} onLogout={onLogout} />}
          </Tab.Screen>
        </Tab.Navigator>
    );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const checkSession = useCallback(async () => {
      try {
        const session = await AsyncStorage.getItem('user-session');
        setIsLoggedIn(session === 'active');
      } catch (e) {
        setIsLoggedIn(false);
      }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // --- ГЛАВНЫЕ ИСПРАВЛЕНИЯ ---
  const handleLoginSuccess = useCallback(() => {
      setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
      setIsLoggedIn(false);
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isLoggedIn ? (
          <MainTabNavigator onLogout={handleLogout}/>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login">
               {props => <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}