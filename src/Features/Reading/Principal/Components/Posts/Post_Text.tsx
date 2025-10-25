// IMPORTS =============================================================
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
// Import Navigation ------------------------------------
import { useNavigation } from '@react-navigation/native';
// Import Styles ----------------------------------------
import { PostsStyles } from '../../../../../styles/Posts';
import { TextStyles } from '../../../../../styles/Text';
import { ViewsStyles } from '../../../../../styles/Views';
// Components -------------------------------------------
import LabelBubble from '../../../../../Components/LabelsBuble';



type Post_TextProps = {
    id: number;
    title: string;
    text: string;
    date: number;
    animationSeed?: number;
    reload:number;
};

// FUNCTION =============================================================
export default function Post_Text({id, title, text, date, reload}: Post_TextProps ) {
    const navigation = useNavigation<any>();

    const [reloadLabels, setReloadLabels]= useState(false)

    // J'ai retirer l'annimation en attendan de régler des bug suite aux chargement de nouveaux posts

    useEffect(() => {
        // opacity.setValue(1);
        setReloadLabels(set=> !set);
    }, [reload]);

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
        <Animated.View style={[PostsStyles.Post_Text]}>
            {/* Title and Date */}
            <View style={[ViewsStyles.Row_space, {width:'100%',  gap:'10%'}]}>
                <View style={{flexDirection:'row', alignItems:'center', gap:10, flex:1, minWidth:0}}>
                    <LabelBubble SizeRound={18} idPost={id} reLoadLabels={reloadLabels}/>
                    <Text style={[TextStyles.TextBlack, ]} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
                </View>
                <Text style={[TextStyles.TextPost, {fontSize:14, flexShrink:0}]}>{formatDate(date)}</Text>
            </View>

            {/* Content */}
            <Text style={[TextStyles.TextPost, { marginTop: 10 }]} numberOfLines={5} ellipsizeMode="tail">
                {text}
            </Text>
            <Pressable
                style={({pressed})=>({height:20, justifyContent:'flex-start', width:'30%', opacity: pressed? 0.3:1})}
                onPress={() => { navigation.navigate("OnePostReading", { id, reload:1 }); }}>
                <Text style={TextStyles.MoreButton}>more</Text>
            </Pressable>
        </Animated.View>
    );
}