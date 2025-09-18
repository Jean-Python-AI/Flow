import React from 'react';
import { View, Text } from 'react-native';

type InfoBubbleProps = {
    visible: boolean;
};

export default function InfoBubble({ visible }: InfoBubbleProps) {
    if (!visible) return null;
    return (
        <View style={{ padding: 10, backgroundColor: '#E0E0E0', borderRadius: 10, maxWidth: '80%' }}/>
    );
}