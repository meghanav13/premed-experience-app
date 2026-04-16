import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { COLORS, FONTS } from '@/constants/theme';
import { CalendarBlank, House, PencilLine } from 'phosphor-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: '#F0EDE8',
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.sans,
          fontSize: 11,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <House size={24} color={color} weight="fill" />,
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Timeline',
          tabBarIcon: ({ color }) => (
            <CalendarBlank size={24} color={color} weight="fill" />
          ),
        }}
      />
      <Tabs.Screen
        name="essays"
        options={{
          title: 'Essays',
          tabBarIcon: ({ color }) => (
            <PencilLine size={24} color={color} weight="fill" />
          ),
        }}
      />
    </Tabs>
  );
}
