import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import Tabs from './components/Tabs';
import { StatusBar } from 'expo-status-bar';
export default function App() {
  return (
      <NavigationContainer>
        <StatusBar style="light" /> 
        <Tabs />
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Esto asegura que SafeAreaView ocupe todo el espacio disponible
  },
});