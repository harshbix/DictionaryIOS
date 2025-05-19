import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create notification context
export const NotificationContext = createContext({
  pushNotificationsEnabled: true,
  doNotDisturb: false,
  togglePushNotifications: () => {},
  toggleDoNotDisturb: () => {},
});

// Notification context provider
export const NotificationProvider = ({ children }) => {
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);

  // Load notification preferences on mount
  useEffect(() => {
    const loadNotificationPreferences = async () => {
      try {
        // Load push notification preference
        const savedPushNotifications = await AsyncStorage.getItem('pushNotifications');
        if (savedPushNotifications !== null) {
          setPushNotificationsEnabled(savedPushNotifications === 'true');
        }

        // Load do not disturb preference
        const savedDoNotDisturb = await AsyncStorage.getItem('doNotDisturb');
        if (savedDoNotDisturb !== null) {
          setDoNotDisturb(savedDoNotDisturb === 'true');
        }
      } catch (error) {
        console.error('Error loading notification preferences:', error);
      }
    };

    loadNotificationPreferences();
  }, []);

  // Toggle push notifications
  const togglePushNotifications = async () => {
    try {
      const newState = !pushNotificationsEnabled;
      setPushNotificationsEnabled(newState);
      await AsyncStorage.setItem('pushNotifications', String(newState));
    } catch (error) {
      console.error('Error saving push notification preference:', error);
    }
  };

  // Toggle do not disturb
  const toggleDoNotDisturb = async () => {
    try {
      const newState = !doNotDisturb;
      setDoNotDisturb(newState);
      await AsyncStorage.setItem('doNotDisturb', String(newState));
    } catch (error) {
      console.error('Error saving do not disturb preference:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        pushNotificationsEnabled,
        doNotDisturb,
        togglePushNotifications,
        toggleDoNotDisturb,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};