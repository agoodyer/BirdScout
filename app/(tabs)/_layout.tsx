import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform, TouchableOpacity } from 'react-native';


import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const router = useRouter(); 

  const color = useThemeColor({},'text');

  return (
    <>
      <ThemedView style={{ height: 120, padding: 0, alignItems: 'flex-end', flexDirection: 'row' }}>

        <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingBlock: 10, paddingInline: 20, alignItems:'center' }}>
         
          <ThemedView style={{flexDirection:'row', alignItems:'center'}}>
           <Image
                    source={require('@/assets/images/icon_silhouette.png')}
                    style={{height:40, width:40, tintColor:color}}
                    resizeMode="contain"
                  />

            <ThemedText style={{paddingLeft:5}} type="subtitle">BirdScout</ThemedText>
            </ThemedView>

          <TouchableOpacity onPress={() => router.push("/account")} >
           <Ionicons name="person-circle-sharp" size={32} color={color} />
          </TouchableOpacity>
         
        </ThemedView>

      </ThemedView>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>

        <Tabs.Screen
          name="map"
          options={{
            title: 'Map',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
          }}
        />

        <Tabs.Screen
          name="index"
          options={{
            title: 'Identify',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="camera.fill" color={color} />,
          }}
        />


        <Tabs.Screen
          name="journal"
          options={{
            title: 'Journal',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="book.fill" color={color} />,
          }}
        />

<Tabs.Screen
          name="achievements"
          options={{
            title: 'Achievements',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="star.fill" color={color} />,
          }}
        />

      </Tabs>
    </>
  );
}
