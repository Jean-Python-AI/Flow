import React from 'react';
import { View, Text, Pressable } from 'react-native';
// Import Styles
import { ButtonStyles } from '../../../../Components/UI/Button';
import { Colors } from '../../../../styles/theme';
import { TextStyles } from '../../../../styles/Text';


const CathegoryButton = React.memo(({title, activate, onPress}: {title: string, activate?: boolean, onPress: () => void}) => {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [
            { marginRight: 3 },
            pressed && { opacity: 0.6 } // Ajoute un style quand pressé
        ]}>
            <View style={[ButtonStyles.cathegoryFilter, activate ? {backgroundColor:Colors.Background_Elements} : {}]}>
                <Text style={[TextStyles.TextPost, activate ? TextStyles.TextBlack : TextStyles.TextPost]}>{title}</Text>
            </View>
        </Pressable>
    );
});

export default CathegoryButton;