import React from 'react';
import { View, Text } from 'react-native';
// Import Styles
import { Colors } from '../../../../../styles/theme';
import { navBarStyle } from '../../../../../styles/NavBars';

interface NavBarProps {
  children: React.ReactNode;
}

export default function NavBar({children} : NavBarProps) {
    return (
        <View style={navBarStyle.basic}>
            { children }
        </View>
    );
}