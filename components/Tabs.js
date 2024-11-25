import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Journal from '../(tabs)/JournalTab';
import Notes from '../(tabs)/NotesTab';
import TabsIcon from './TabsIcon';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabsIcon label={route.name} focused={focused} />
        ),
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#131316',
          borderRadius:50,
          height: 60,
          borderTopWidth: 0, // Quitar el borde superior
          shadowOpacity: 0, // Quitar la sombra en iOS
          margin:20
        },
        tabBarItemStyle: {
            justifyContent: 'center',   // Centra el contenido verticalmente
            alignItems: 'center',       // Centra el contenido horizontalmente
            paddingTop:7
          }
          ,
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Notes" component={Notes} />
      <Tab.Screen name="Journal" component={Journal} />
    </Tab.Navigator>
  );
}
