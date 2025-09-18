import React, {useState} from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
// Import Styles
import { ButtonStyles } from '../../../../../styles/Button';
import { Colors } from '../../../../../styles/theme';
import { TextStyles } from '../../../../../styles/Text';
// Import Components
import ModifyCategoryPopIn from '../PopIn/ModifyCategory';


export default function CathegoryButton({id, title, activate, onPress, onChanged}: {id:number, title: string, activate?: boolean, onPress: () => void, onChanged: () => void}) {
    const [PopInModify_Visible, setPopInModify_Visible] = useState(false);

    return (
        <Pressable
            onPress={onPress}
            onLongPress={() => setPopInModify_Visible(true)}
            style={({ pressed }) => [
            { marginRight: 3 },
            pressed && { opacity: 0.6 } // Ajoute un style quand pressé
        ]}>
            <View style={[ButtonStyles.cathegoryFilter, activate ? {backgroundColor:Colors.Background_Elements} : {}]}>
                <Text style={[TextStyles.Paragraph, TextStyles.medium, activate ? TextStyles.normal : TextStyles.subText]}>{title}</Text>
            </View>

            <ModifyCategoryPopIn CategoryId={id} CategoryName={title} visible={PopInModify_Visible} onClose={() => {setPopInModify_Visible(false)}} onChanged={onChanged}/>

        </Pressable>
    );
}