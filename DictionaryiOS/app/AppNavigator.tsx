import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // To wrap the whole app
import { createStackNavigator } from '@react-navigation/stack'; // Import the Stack Navigator

import HomeScreen from './(tabs)/home/index'; // Your Home screen component
import WordDetailScreen from './(tabs)/home/WordDetail'; // Your WordDetail screen component

// Create a Stack Navigator instance
const Stack = createStackNavigator();

// Create the AppNavigator using Stack.Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="WordDetail" component={WordDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
