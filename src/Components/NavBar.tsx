import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Style ------------------------------------------------------------
import { navBarStyle } from '../styles/NavBars';
import { Colors } from '../styles/theme';
// Screen -----------------------------------------------------------
import PostScroll from '../Features/Reading/Principal/screen_clean';
import ProjectsView from '../Features/Editing/Principal/screen';


// Navigation in the NavBar init
const NavBarNavigation = createBottomTabNavigator();

export function NavBar() {
  return (
    <NavBarNavigation.Navigator
      screenOptions={{
        tabBarStyle: navBarStyle.simpleTab,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.text,
        tabBarInactiveTintColor: Colors.ItemSecondary,
        tabBarItemStyle: {
          paddingHorizontal: 0,
          marginHorizontal: -5,
        },
        tabBarIconStyle: {
          marginTop:15
        },
      }}
    >
      <NavBarNavigation.Screen 
        name="Read" 
        component={PostScroll} 
        options={{ animation: 'shift',
          tabBarIcon: ({ color }) => (
            <Image source={require('../../assets/icons/Home.png')} style={{ tintColor:color, height:40, width:40 }} /> 
          )
        }}
      />
      <NavBarNavigation.Screen 
        name="Edit" 
        component={ProjectsView} 
        options={{ animation: 'shift',
          tabBarIcon: ({ color }) => ( 
            <Image source={require('../../assets/icons/Pen.png')} style={{ tintColor:color, height:30, width:30 }} /> 
          )
        }}
      />
    </NavBarNavigation.Navigator>
  );
}