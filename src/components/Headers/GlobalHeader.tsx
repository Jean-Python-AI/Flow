import React from 'react';
import { View, Text } from 'react-native';
// Import Styles
import { Colors } from '../../styles/theme';
import { HeadersStyle } from '../../styles/Headers';

interface HeadersProps {
  children: React.ReactNode;
}

export default function Headers({children} : HeadersProps) {
    return (
        <View style={HeadersStyle.basic}>
            { children }
        </View>
    );
}