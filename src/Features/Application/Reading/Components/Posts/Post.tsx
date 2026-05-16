// IMPORTS =============================================================
import React, { useEffect, useState, useRef, useCallback, useLayoutEffect } from 'react';
import { View, Text, Pressable, Image, Animated } from 'react-native';
// DataBase ---------------------------------------------
import { useTableU } from '../../../../../DATA/Hooks/Algorithme/TableU';
import { updateDfForViewedPost } from '../../../../../DATA/Hooks/Algorithme/Df';
// Navigation -------------------------------------------
import { useNavigation } from '@react-navigation/native';
// Import Styles ----------------------------------------
import { PostsStyles } from '../../../../../styles/Posts';
import { TextStyles } from '../../../../../styles/Text';
import { ViewsStyles } from '../../../../../styles/Views';
import { Colors } from '../../../../../styles/theme';
// Components -------------------------------------------
import LabelBubbles from '../../../../../Components/LabelsBubble';
import Bin from '../../../../../../assets/icons/Bin.svg';
import LabelsPopover from '../PopIn/LabelsPopover';
import ImagePost from './Image';



type Post_TextProps = {
    id: number;
    title: string;
    text: string;
    date: string;
    reload:number;
    LabelsPopInVisible: (idPost:number)=> void;
    DeletePopInVisible: (idPost:number)=> void;
    showPopover?: boolean;
    onClosePopover?: () => void;
};


function Post_Text({id, title, text, date, reload, LabelsPopInVisible, DeletePopInVisible, showPopover = false, onClosePopover}: Post_TextProps ) {
    const navigation = useNavigation<any>();
    // Hook TableU - doit être appelé au niveau du composant
    const { ClickPost } = useTableU();
    // Clicks MORE
    const [more, setMore] = useState(false);
    // Click modify
    const [modify, setModify] = useState(false);
    const [visibleModify, setVisibleModify] = useState(false)
    // Position du bouton des labels pour le popover
    const labelButtonRef = useRef<View>(null);
    const [buttonLayout, setButtonLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

    const [reloadLabels, setReloadLabels]= useState(false)
    const hasUpdatedDf = useRef(false); // Pour éviter de mettre à jour Df plusieurs fois
    
    useEffect(() => {
        setReloadLabels(set=> !set);
        setMore(false);
        setModify(false);
        hasUpdatedDf.current = false; // Réinitialiser quand le post est rechargé
    }, [reload]);

    // Mettre à jour Df quand le post devient visible (au montage du composant)
    useEffect(() => {
        // Mettre à jour Df une seule fois quand le composant est monté
        if (!hasUpdatedDf.current) {
            updateDfForViewedPost(id)
                .then(() => {
                    hasUpdatedDf.current = true;
                    console.log(`Df mis à jour pour le post ${id}`);
                })
                .catch((error) => {
                    console.error(`Erreur mise à jour Df pour post ${id}:`, error);
                });
        }
    }, [id]);

    // Handler pour ouvrir le popover
    const handleLabelPress = useCallback(() => {
        LabelsPopInVisible(id);
    }, [id, LabelsPopInVisible]);

    // Fermer le popover
    const handleClosePopover = useCallback(() => {
        if (onClosePopover) {
            onClosePopover();
        }
    }, [onClosePopover]);

    // Animation des boutons modify
    const opacity = useRef(new Animated.Value(0)).current;
    const translateX = useRef(new Animated.Value(-40)).current;

    useLayoutEffect(() => {
        if (modify) {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 400, // Adjust duration for speed
                useNativeDriver: true,
            }),
            Animated.timing(translateX, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: -40,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(()=>setVisibleModify(false))          
        }
    }, [modify]);

    return (
        <View style={[PostsStyles.Post_Text]}>

            {/* Image Post }
            {title === "Untitle" ? (
                <ImagePost idPost={id}/>
            ) : null*/}

            {/* Title, Bubbles and Date */}
            <View style={[ViewsStyles.Row_space, {width:'100%',  gap:10}]}>
                <View style={{flexDirection:'row', alignItems:'center', gap:10, flex:1, minWidth:0}}>
                    <View 
                        ref={labelButtonRef} 
                        collapsable={false}
                        onLayout={(event) => {
                            const { x, y, width, height } = event.nativeEvent.layout;
                            setButtonLayout({ x, y, width, height });
                        }}
                    >
                        <Pressable onPress={handleLabelPress} style={({pressed})=>({backgroundColor:pressed?Colors.Background_Elements:undefined, padding:4, margin:-4, borderRadius:25})}>
                            <LabelBubbles SizeRound={18} idPost={id} reLoadLabels={reloadLabels} showWhenNoting={false}/>
                        </Pressable>
                    </View>

                    <Text style={[TextStyles.TextBlack, {flexShrink: 1, minWidth: 0}]} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
                    {/* SUPPRIMER L'ID DU TITRE */}
                </View>
                <Text style={[TextStyles.TextPost, {fontSize:14, flexShrink:0}]}>{date || 'Date inconnue'}</Text>
            </View>

            {/* Content */}
            <Text style={[TextStyles.TextPost, { marginBottom: 10 }]} numberOfLines={more ? undefined :  4} ellipsizeMode="tail">
                {text}
            </Text>

            { !more ? (
                <Pressable
                    style={({pressed})=>({width:'20%', borderRadius:20, justifyContent:'center', alignItems:'flex-start', opacity: pressed? 0.6:1, height:35})}
                    onPress={async() => { 
                        setMore(true); 
                        try {
                            // Enregistrer le clic dans TableU (intention utilisateur)
                            await ClickPost(id);
                            // Mettre à jour Df (le post vient d'être vu)
                            await updateDfForViewedPost(id);
                        } catch (error) {
                            console.error('Erreur lors du clic sur le post:', error);
                        }
                    }}>
                    <Text style={TextStyles.MoreButton}>more</Text>
                </Pressable>

            ) : (
                <View style={{ alignSelf: 'flex-start', alignItems:'center', justifyContent:'center', flexDirection:'row', gap:20, height:35}}>
                    <Pressable
                        onPress={()=>{setModify(!modify); visibleModify?undefined:setVisibleModify(true)}}
                        style={({pressed})=> ({ justifyContent:'center', height:'100%', paddingHorizontal:10, borderRadius:20, backgroundColor: pressed?Colors.Button:Colors.Background_Elements })}
                    >
                        <Text style={TextStyles.MoreButton}>{modify?"cancel":"modify"}</Text>
                    </Pressable>


                    { visibleModify ? (
                        <Animated.View style={{opacity, transform: [{ translateX }], alignSelf: 'flex-start', alignItems:'center', justifyContent:'center', flexDirection:'row', gap:20, height:'100%'}}>
                            <Pressable
                                onPress={()=> navigation.navigate("EditPost", { id:id })}
                                style={({pressed})=> ({height:'100%', alignItems:'center', paddingHorizontal:10, backgroundColor:pressed?Colors.Background_Elements:undefined, borderWidth:2, borderColor:Colors.Background_Elements, borderRadius:20, flexDirection:'row', gap:10})}
                            >
                                <Image source={require('../../../../../../assets/icons/Pen.png')} style={{height:20, width:20, tintColor:Colors.Text_Posts}}/>
                                <Text style={TextStyles.TextPost}>Edit Post</Text>
                            </Pressable>

                            <Pressable
                                onPress={()=>DeletePopInVisible(id)}
                                style={({pressed})=> ({height:'100%', justifyContent:'center', paddingHorizontal:10, marginRight:10, backgroundColor:pressed?Colors.Red_transparent:undefined, borderWidth:2, borderColor:Colors.Red_transparent, borderRadius:20})}
                            >
                                <Bin width={25} height={25} color={Colors.Red}/>
                            </Pressable>
                        </Animated.View>
                    ) : null}
                </View>
            )}

            {/* Popover contextuel pour les labels */}
            {showPopover && buttonLayout && (
                <LabelsPopover
                    idPost={id}
                    visible={showPopover}
                    buttonLayout={buttonLayout}
                    onClose={handleClosePopover}
                />
            )}
        </View>
    );
}

// Cela dit à réact de le réactuliser, si c'est valeurs change réelement
export default React.memo(Post_Text);