import React, {useState} from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Import Styles
import { Colors } from '../../../../styles/theme';
import { TextStyles } from '../../../../styles/Text';
import { ButtonStyles } from '../../../../styles/Button';
import { ViewsStyles } from '../../../../styles/Views';
// Import Components
import LabelBubble from '../../../../Components/LabelsBuble';
import PopInModifyPost from './PopIn/PopInModifyPost';


interface PostsProps {
    id: number,
    title: string,
    reload: boolean,
    actionAfterDelete: () => void,
};

export default function Posts({id, title, reload, actionAfterDelete}: PostsProps) {
    const navigation = useNavigation<any>();

    const [PopInModifyPost_Visible, setPopInModifyPost_Visible] = useState(false)

    return(
        <View style={[ViewsStyles.Row_space, { paddingVertical: 10 }]}>
            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Pressable
                    style={({ pressed }) => [
                        ButtonStyles.Elements,
                        pressed && { backgroundColor:Colors.Background_Elements } // Ajoute un style quand pressé
                    ]}
                    onPress={() => { navigation.navigate("EditPost", { id, title }); }}
                    onLongPress={() => {setPopInModifyPost_Visible(true)}}
                >
                    {/* Labels Bubles -----------------------------------------------------------*/}
                    <LabelBubble SizeRound={18} idPost={id} reLoadLabels={reload}/>
                    {/* Title -------------------------------------------------------------------*/}
                    <Text style={TextStyles.TextBlack}>{title}</Text>
                </Pressable>

                {/* PopIn --------------------------------*/}
                <PopInModifyPost idPost={id} namePost={title} visible={PopInModifyPost_Visible} onClose={() => setPopInModifyPost_Visible(false)} actionAfterDelete={actionAfterDelete}/>
            </View>
        </View>
    );
}