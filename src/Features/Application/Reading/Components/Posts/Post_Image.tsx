// IMPORTS =============================================================
import React, {useCallback, useState} from 'react';
import { View, Text, Pressable, ImageBackground, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Pour le dégradé
// Navigation -------------------------------------------
import { useNavigation } from '@react-navigation/native';
// Import Styles ------------------------------------------
import { PostsStyles } from '../../../../../styles/Posts';
import { TextStyles } from '../../../../../styles/Text';
import { ViewsStyles } from '../../../../../styles/Views';
import { Colors } from '../../../../../styles/theme';
// Import Components -------------------------------------------
import LabelBubbles from '../../../../../Components/LabelsBubble';
import Bin from '../../../../../../assets/icons/Bin.svg';


type Post_ImageProps = {
    id: number;
    title: string;
    text: string;
    date: number;
    reload:number;
    timecapsul:Boolean;
    LabelsPopInVisible: (idPost:number)=> void;
    DeletePopInVisible: (idPost:number)=> void;
    showPopover?: boolean;
    onClosePopover?: () => void;
};

// FUNCTION =============================================================
export default function Post_Image({id, title, text, date, LabelsPopInVisible, DeletePopInVisible}: Post_ImageProps ) {
    const navigation = useNavigation<any>();
    // Size auto of the image
    const source = require('../../../../../../assets/img/Post1.jpg');
    const { width, height } = Image.resolveAssetSource(source);

    // Clicks MORE
    const [more, setMore] = useState(false);
    // Click modify
    const [modify, setModify] = useState(false);



    const [reloadLabels, setReloadLabels]= useState(false)

    // Handler pour ouvrir le popover
    const handleLabelPress = useCallback(() => {
        LabelsPopInVisible(id);
    }, [id, LabelsPopInVisible]);

    // Formater la date
    const formatDate = (timestamp: number) => {
        if (!timestamp || timestamp === 0) return 'Date inconnue';
        try {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) return 'Date inconnue';
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            });
        } catch (error) {
            console.log('Error formatting date:', error);
            return 'Date inconnue';
        }
    };

    return (
        <View style={PostsStyles.Post_ImageText}>
            <ImageBackground
                source={source}
                style={{ width: "100%", aspectRatio: width/height, borderRadius: 20, overflow: "hidden", justifyContent:'flex-end' }}
            >
                <LinearGradient
                    colors={['rgba(0, 0, 0, 1)', 'transparent']} // du bas (noir semi-transparent) vers le haut (transparent)
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0.6 }}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        top: 0,
                    }}
                />

                {/* Container ------------------------------*/}
                <View style={{margin:10, backgroundColor:Colors.Background_Primary, borderRadius:15, padding:20}}>
                    {/* Title and Date */}
                    <View style={ViewsStyles.Row_space}>
                        <View style={{flexDirection:'row', gap:10, alignItems:'center'}}>
                            <Pressable onPress={handleLabelPress} style={({pressed})=>({backgroundColor:pressed?Colors.Background_Elements:undefined, padding:4, margin:-4, borderRadius:25})}>
                                <LabelBubbles SizeRound={18} idPost={id} reLoadLabels={reloadLabels} showWhenNoting={false}/>
                            </Pressable>
                            <Text style={TextStyles.TitlePost}>{title}</Text>
                        </View>
                        <Text style={[TextStyles.TextPost, {fontSize:14}]}>{formatDate(date)}</Text>
                    </View>

                    {/* Content */}
                    <Text style={[TextStyles.TextPost, { marginBottom: 10 }]} numberOfLines={more ? undefined :  4} ellipsizeMode="tail">
                        {text}
                    </Text>
                    
                    { !more ? (
                        <Pressable
                            style={({pressed})=>({width:'20%', borderRadius:20, justifyContent:'center', alignItems:'flex-start', opacity: pressed? 0.6:1, height:35})}
                            onPress={() => { setMore(true); }}>
                            <Text style={TextStyles.MoreButton}>more</Text>
                        </Pressable>

                    ) : (

                        <View style={{backgroundColor:Colors.Background_Elements, borderRadius:20, alignSelf: 'flex-start', alignItems:'center', justifyContent:'center', flexDirection:'row', gap:20}}>
                            <Pressable
                                onPress={()=>{setModify(!modify);}}
                                style={({pressed})=> ({padding:7, paddingHorizontal:10, borderRadius:20, backgroundColor: pressed?Colors.Button:Colors.Background_Elements })}
                            >
                                <Text style={TextStyles.MoreButton}>{modify?"cancel":"modify"}</Text>
                            </Pressable>


                            { modify ? (
                                <>
                                    <Pressable
                                        onPress={()=> navigation.navigate("EditPost", { id:id })}
                                        style={({pressed})=> ({padding:4, paddingHorizontal:20, backgroundColor:pressed?undefined:Colors.Background_Primary, borderRadius:20, flexDirection:'row', gap:10})}
                                    >
                                        <Image source={require('../../../../../../assets/icons/Pen.png')} style={{height:20, width:20, tintColor:Colors.Text_Posts}}/>
                                        <Text style={TextStyles.TextPost}>Edit Post</Text>
                                    </Pressable>

                                    <Pressable
                                        onPress={()=>DeletePopInVisible(id)}
                                        style={({pressed})=> ({padding:3, paddingHorizontal:2, marginRight:10, backgroundColor:Colors.Background_Elements, borderRadius:20})}
                                    >
                                        <Bin width={25} height={25} color={Colors.Red}/>
                                    </Pressable>
                                </>
                            ) : null}
                        </View>
                    )}
                </View>
            </ImageBackground>
        </View>
    );
}