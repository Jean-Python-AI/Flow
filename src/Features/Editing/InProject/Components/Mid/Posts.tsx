import React, {useState} from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Import Styles
import { Colors } from '../../../../../styles/theme';
import { TextStyles } from '../../../../../styles/Text';
import { ButtonStyles } from '../../../../../styles/Button';
// Import Components
import Element from './elements';
import LabelBubble from './LabelsBuble';
import PopInModifyPost from '../PopIn/PopInModifyPost';


interface PostsProps {
    id: number,
    title: string,
    dots?: boolean,
    actionAfterDelete: () => void,
};

export default function Posts({id, title, dots, actionAfterDelete}: PostsProps) {
    const navigation = useNavigation<any>();

    const [PopInModifyPost_Visible, setPopInModifyPost_Visible] = useState(false)

    return(
        <Element dots={dots}>
            <Pressable
                style={({ pressed }) => [
                    ButtonStyles.Posts_InProject,
                    pressed && { backgroundColor:Colors.Background_Elements } // Ajoute un style quand pressé
                ]}
                onPress={() => { navigation.navigate("EditPost", { id, title }); }}
                onLongPress={() => {setPopInModifyPost_Visible(true)}}
            >
                {/* Labels Bubles -----------------------------------------------------------*/}
                <LabelBubble visible={true} idList={['#c92305ff','rgba(43, 49, 164, 1)']}/>
                {/* Title -------------------------------------------------------------------*/}
                <Text style={[TextStyles.Paragraph, TextStyles.semiBold, TextStyles.normal]}>{title}</Text>
            </Pressable>

            {/* PopIn --------------------------------*/}
            <PopInModifyPost idPost={id} namePost={title} visible={PopInModifyPost_Visible} onClose={() => setPopInModifyPost_Visible(false)} actionAfterDelete={actionAfterDelete}/>
        </Element>
    );
}