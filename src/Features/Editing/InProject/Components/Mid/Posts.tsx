import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Import Styles
import { Colors } from '../../../../../styles/theme';
import { TextStyles } from '../../../../../styles/Text';
// Import Components
import Element from './elements';
import LabelBubble from './LabelsBuble';


interface PostsProps {
    id: number,
    title: string,
    dots?: boolean
};

export default function Posts({id, title, dots}: PostsProps) {
    const navigation = useNavigation<any>();

    return(
        <Element dots={dots}>
            <Pressable
                style={({ pressed }) => [
                    { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10, paddingRight:50, paddingVertical:10, width:'100%', borderRadius:10, paddingHorizontal:10 },
                    pressed && { backgroundColor:Colors.Background_Elements } // Ajoute un style quand pressé
                ]}
                onPress={() => { navigation.navigate("EditPost", { id, title }); }}
            >
                {/* Labels Bubles -----------------------------------------------------------*/}
                <LabelBubble visible={true} idList={['#c92305ff','rgba(43, 49, 164, 1)']}/>
                {/* Title -------------------------------------------------------------------*/}
                <Text style={[TextStyles.Paragraph, TextStyles.semiBold, TextStyles.normal]}>{title}</Text>
            </Pressable>
        </Element>
    );
}