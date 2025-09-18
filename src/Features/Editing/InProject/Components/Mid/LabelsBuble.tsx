import React from 'react';
import { View } from 'react-native';
// Import Styles
import { Colors } from '../../../../../styles/theme';




type InfoBubbleProps = {
    visible: boolean;
    idList: string[];
};

export default function LabelBubble({ visible, idList }: InfoBubbleProps) {
    if (!visible) return null;
    return (
        <View style={{ position: 'relative', width: 18 + (idList.length - 1) * 8, height: 18 }}>
            {idList.map((dot, index) => (
                <View 
                    key={dot} 
                    style={{position: 'absolute',
                        left: index * 8,  // décalage horizontal progressif
                        width: 18,
                        height: 18,
                        borderRadius: 20,
                        backgroundColor: dot, // à changer après
                        borderWidth:2,
                        borderColor:Colors.Background_Primary,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                />
            ))}
        </View>        
    );
}