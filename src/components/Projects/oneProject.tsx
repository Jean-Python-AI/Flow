import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Import Styles
import { Colors } from '../../styles/theme';
import { ViewsStyles } from '../../styles/Views';
import { TextStyles } from '../../styles/Text';
// Import Components
import Element from './elements';
import ModifyProjectPopIn from '../PopIns/ModifyProject';


interface OneProjectProps {
    id: number,
    title: string,
    dots?: boolean,
    onChanged?: () => void,
};

export default function OneProject({id, title, dots, onChanged}: OneProjectProps) {
    const navigation = useNavigation<any>();

    // PopIn
    const [ModifyProjectPopIn_IsVisible, _ModifyProjectPopIn_IsVisible] = React.useState(false);

    return(
        <Element dots={dots}>
            <Pressable
                style={({ pressed }) => [
                    { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10, paddingRight:50, paddingVertical:10, width:'100%' },
                    pressed && { opacity:0.4 } // Ajoute un style quand pressé
                ]}
                onPress={() => { navigation.navigate("Category", { id, title }); }}
                onLongPress={() => { _ModifyProjectPopIn_IsVisible(true); }}
            >
                <Image source={require('../../../assets/icons/Pen.png')} style={{ width: 20, height: 20, tintColor: Colors.Text_Secondary }} />
                <Text style={[TextStyles.Paragraph, TextStyles.semiBold, TextStyles.normal]}>{title}</Text>
            </Pressable>
            <ModifyProjectPopIn ProjectId={id} visible={ModifyProjectPopIn_IsVisible} onClose={() => {_ModifyProjectPopIn_IsVisible(false)}} onChanged={onChanged}/>
        </Element>
    );
}