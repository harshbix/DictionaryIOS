import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './home/homeScreen';
import SavedScreen from './saved/SavedScreen';
import WordListScreen from './words/WordsScreen';
import SettingsScreen from './settings/SettingScreen';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#1F2937' }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="bookmark" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Words"
        component={WordListScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="book-open" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
