import React from 'react';
import { Tabs } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// Tab configuration
const tabScreens = [
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

// Tab layout component
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1F2937',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 0.5,
          height: 65,
          paddingTop: 5,
        },
      }}
    >
      {tabScreens.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name} // Use just the screen name
          options={{
            title,
            tabBarIcon: ({ color, size }) =>
              React.cloneElement(icon, { color, size }), // dynamically set color and size
          }}
        />
      ))}
    </Tabs>
  );
}
