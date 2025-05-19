import React, { JSX } from 'react';
import { Tabs } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Define tab screen type
type TabScreen = {
  name: string;
  title: string;
  icon: JSX.Element;
};

// Tab configuration
const tabScreens: TabScreen[] = [
  {
    name: 'home/index',
    title: 'Home',
    icon: <Feather name="home" size={22} />,
  },
  {
    name: 'saved/index',
    title: 'Saved',
    icon: <Feather name="bookmark" size={22} />,
  },
  {
    name: 'words/index',
    title: 'Words',
    icon: <MaterialCommunityIcons name="book-outline" size={22} />,
  },
  {
    name: 'settings/index',
    title: 'Settings',
    icon: <Feather name="settings" size={22} />,
  },
];

// Styles
const tabBarStyle = {
  backgroundColor: '#fff',
  borderTopColor: '#E5E7EB',
  borderTopWidth: 0.5,
  height: 65,
  paddingTop: 5,
};

// Function to render tab icons
const renderTabIcon = (icon: JSX.Element, color: string, size: number) =>
  React.cloneElement(icon, { color, size });

// Tab layout component
export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#1F2937',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle,
        }}
      >
        {tabScreens.map(({ name, title, icon }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title,
              tabBarIcon: ({ color, size }) => renderTabIcon(icon, color, size),
            }}
          />
        ))}
      </Tabs>
    </GestureHandlerRootView>
  );
}
