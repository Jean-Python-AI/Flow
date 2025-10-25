// IMPORTS ==============================================================
import React, {useState, useEffect, useCallback} from 'react';
import { View, Text, ScrollView, StatusBar, Pressable } from 'react-native';
// Navigation récupération des données --------------------------------
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../App';
// Import Styles ----------------------------------------
import { Screens } from '../../../styles/screens';
import { Colors } from '../../../styles/theme';
import { TextStyles } from '../../../styles/Text';
import { ViewsStyles } from '../../../styles/Views';
// Import Compoenents -----------------------------------
import HeaderPostRead from './Components/Header';
import LabelBubble from '../../../Components/LabelsBuble';
import PopInLabels from './Components/PopInLabels';
// Import DataBase --------------------------------------
import { ReadPostById } from '../../../DataBase/Posts/ReadPost';



type Props = NativeStackScreenProps<RootStackParamList, 'OnePostReading'>;

// FUNCTION =============================================================
function OnePostReading({ route }: Props) {
    const { id } = route.params;

    // Read Posts
    const [post, addPosts] = useState<{id: number, parentId: number, title: string, text: string, createdAt: number}>();
    const [labelsReload, setLabelsReload] = useState(false);

    // Refresh on screen focus
    useFocusEffect(
        useCallback(() => {
            ReadPostById(id, addPosts);
            setLabelsReload(set=> !set)
        }, [])
    );

    const [PopInLabelsVisible, setPopInLabelsVisible] = useState(false)

    return (
        <View style={Screens.editPost}>
            {/* Phone Barr style */}
            <StatusBar backgroundColor={Colors.Background_Elements}/>

            {/* Header */}
            <HeaderPostRead date={post?.createdAt ?? 0} id={id} title={post?.title ?? ''}/>

            <View style={Screens.editPost_TextZone}>
                 <View>
                    <View style={[ViewsStyles.Row_space, {alignItems:'flex-start', marginBottom:15, margin:10}]}>
                        {/* Title */}
                        <Text style={[TextStyles.TitlePost, {maxWidth:'85%'}]}>{post?.title}</Text>
                        {/* Labels Bubles */}
                        <Pressable
                            onPress={()=>setPopInLabelsVisible(true)}
                            style={({pressed})=>({backgroundColor: pressed?Colors.Background_Elements:Colors.Background_Primary, padding:3, borderRadius:15, borderWidth:1, borderColor:pressed ? Colors.Button:Colors.Background_Primary})}
                        >
                            <LabelBubble SizeRound={20} idPost={id} reLoadLabels={labelsReload}/>
                        </Pressable>
                    </View>

                    <ScrollView style={{height:'100%', width:'100%', paddingHorizontal:20, borderTopWidth:2, borderColor:Colors.Background_Elements,}} showsVerticalScrollIndicator={true} >
                        {/* Text */}
                        <Text style={[TextStyles.TextWriting, {marginTop:20}]}>{post?.text}</Text>
                        <View style={{height:250}}/>
                    </ScrollView>
                    
                </View>
            </View>


            <PopInLabels idPost={id} visible={PopInLabelsVisible} reLoadLabels={labelsReload} onClose={()=>setPopInLabelsVisible(false)}/>
        </View>
    );
}

export default OnePostReading;