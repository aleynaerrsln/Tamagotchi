import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: '#6c5ce7',
        tabBarInactiveTintColor: '#b2bec3',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Evcil Hayvan',
          tabBarIcon: () => <Text style={{ fontSize: 22 }}>🐱</Text>,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Mağaza',
          tabBarIcon: () => <Text style={{ fontSize: 22 }}>🛍️</Text>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Başarımlar',
          tabBarIcon: () => <Text style={{ fontSize: 22 }}>🏆</Text>,
        }}
      />
    </Tabs>
  );
}
