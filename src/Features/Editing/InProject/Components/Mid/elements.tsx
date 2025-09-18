import React from 'react';
import { View, Image } from 'react-native';

// Import Styles
import { Colors } from '../../../../../styles/theme';
import { ViewsStyles } from '../../../../../styles/Views';

interface ElementProps {
    children: React.ReactNode,
    dots?: boolean,
};


export default function Element({children}: ElementProps) {
    return (
        <View style={[ViewsStyles.Row_space, { paddingVertical: 10 }]}>
            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                {children}
            </View>
        </View>
    );
}