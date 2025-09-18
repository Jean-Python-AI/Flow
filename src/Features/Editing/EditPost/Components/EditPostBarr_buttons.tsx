import React, { Children } from 'react';
import { View, Text, Pressable } from 'react-native';
// Import Styles
import { ButtonStyles } from '../../../../styles/Button';


export default function EditPostBarr_Button({ children, onPress}: { children?: React.ReactNode, onPress: () => void}) {
    return(
        <View style={ButtonStyles.editPostBarr_Button} >
            {children}
        </View>
    )
}