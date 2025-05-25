import React, { JSX } from 'react';
import { Tabs } from 'expo-router';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
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
    icon: <Ionicons name="heart" size={22} />,
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

// Dark theme styles
const tabBarStyle = {
  backgroundColor: '#111827', // Dark gray background
  borderTopColor: 'rgba(255,255,255,0.1)', // Subtle white border
  borderTopWidth: 0.5,
  height: 65,
  paddingTop: 5,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: -2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
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
          tabBarActiveTintColor: '#3B82F6', // Blue active color
          tabBarInactiveTintColor: 'rgba(255,255,255,0.6)', // Light gray inactive color
          tabBarStyle,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
          },
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