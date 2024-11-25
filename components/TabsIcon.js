import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabsIcon({ label, focused }) {
  let iconName;
  if (label === 'Notes') iconName = 'document-text';
  else if (label === 'Journal') iconName = 'journal';

  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={30} color={focused ? 'white' : 'gray'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
});
