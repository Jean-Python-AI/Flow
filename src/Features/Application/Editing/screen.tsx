// IMPORTS ====================================================================
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, StatusBar, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform, InteractionManager } from 'react-native';
// Navigation ------------------------------------------------------------
import {  useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// Import Styles ---------------------------------------------------------
import { Colors } from '../../../styles/theme';
// Utils ---------------------------------------------------------
import { setStatusBarColorNative } from '../../../utils/StatusBarNative';
import { Screens } from '../../../styles/screens';
import { TextStyles } from '../../../styles/Text';
import { ViewsStyles } from '../../../styles/Views';
// Import Components -----------------------------------------------------
import HeaderEdit from './Components/Header';
import PopInLabels from './Components/PopIn/Labels';
import LabelBubbles from '../../../Components/LabelsBubble';
import ExtractText from './Components/ExtractText';
import PopInExtractText from './Components/PopIn/ExtractText';
// Import Data -----------------------------------------------------------
import { Post } from '../../../DATA/types/Post';
import { usePost } from '../../../DATA/Hooks/Posts/Posts';
import { useEditPost } from '../../../DATA/Hooks/Posts/PostEdit';
import { useTableS } from '../../../DATA/Hooks/Algorithme/TableS';



// For extract the params after ------------------------------------------
type Props = NativeStackScreenProps<RootStackParamList, 'EditPost'>;


// FUNCTION ====================================================================
function EditPosts({ route, navigation }: Props) {
    const { id } = route.params;
    // Modification des liens Algorithm -------------------------------
    const { updateModifiedAfterOthers, ReadLink, updateTextLength } = useTableS();
    useEffect(() => {
        console.log(id);
        updateModifiedAfterOthers(id);
        ReadLink(id);
    }, [id]);

    // Hooks  ---------------------------------------------------------
    const { getPostByIdHook } = usePost(0);
    const { UpdatePostHook, DeletePostHook } = useEditPost();

    // Post States ----------------------------------------------------
    const [post, setPost] = useState<Post | null>(null);
    // For the cancel modification
    const [originalTitle, setOriginalTitle] = useState('');
    const [originalText, setOriginalText] = useState('');
    useEffect(() => {
        getPostByIdHook(id).then((postData) => {
            if (postData) {
                setPost(postData.data);
            }
        });
    }, [id]);
    // Cancal modification function
    const cancelModification = () => {
        setPost(post ? { ...post, title: originalTitle, text: originalText } : null);
    };
    // PopIn state ---------------------------------------------------
    const [labelsVisible, setLabelsVisible] = useState(false);
    const [ExtractVisible, setExtractVisible] = useState(false);

    // Load the post data if the ID alredy exists --------------------
    useEffect(() => {
        if (id) {
            getPostByIdHook(id).then((postData) => {
                if (postData) {
                    setPost(postData.data);
                }
            });
        }
    }, [id]);
    // Save the changes after a delay --------------------------------
    useEffect(() => {
        const timeout = setTimeout(() => {
            UpdatePostHook(id, post?.title || '', post?.text || '');
        }, 500); // Save 1s after the last change

        return () => clearTimeout(timeout);
    }, [post?.title, post?.text]);
    // for a automatic scroll when we writing
    const [height, setHeight] = useState(400)
    const scrollRef = useRef<ScrollView>(null);

    // Click Go Back
    const Back = () => {
        // Suppression du poste si il est vide
        if (post?.text === '') {
            DeletePostHook(id).then(()=>{navigation.goBack();});
        } else {
            // Retours en arrière si il est remplis
            navigation.goBack();
        };
    };

    // ──────────────────────── CONFIGURER LA STATUSBAR QUAND L'ÉCRAN EST FOCUS ────────────────────────
    // Utiliser useLayoutEffect pour s'assurer que la configuration se fait avant le rendu
    useLayoutEffect(() => {
        if (Platform.OS === 'android') {
            StatusBar.setTranslucent(false);
            StatusBar.setBarStyle('dark-content', true);
            setStatusBarColorNative(Colors.Background_Elements);
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            // Configuration de la StatusBar pour cet écran
            if (Platform.OS === 'android') {
                // Configuration immédiate
                StatusBar.setTranslucent(false);
                StatusBar.setBarStyle('dark-content', true);
                
                // Fonction pour appliquer la couleur de la StatusBar
                const applyStatusBarColor = async () => {
                    try {
                        await setStatusBarColorNative(Colors.Background_Elements);
                    } catch (error) {
                        console.warn('Erreur lors de la configuration de la StatusBar:', error);
                    }
                };
                
                // Appliquer immédiatement
                applyStatusBarColor();
                
                // Appliquer aussi après les interactions pour garantir l'application
                const interactionHandle = InteractionManager.runAfterInteractions(() => {
                    applyStatusBarColor();
                });
                
                // Appliquer aussi après un court délai supplémentaire
                const timeoutId = setTimeout(() => {
                    applyStatusBarColor();
                }, 150);
                
                // Cleanup: restaurer la StatusBar par défaut quand on quitte l'écran
                return () => {
                    interactionHandle.cancel();
                    clearTimeout(timeoutId);
                    StatusBar.setTranslucent(false);
                    StatusBar.setBarStyle('dark-content', true);
                    setStatusBarColorNative(Colors.Background_Primary);
                };
            } else {
                StatusBar.setBarStyle('dark-content', true);
                return () => {
                    StatusBar.setBarStyle('dark-content', true);
                };
            }
        }, [])
    );

    // RETURN THE COMPONENT ------------------------------------------------------
    return(
        <>
        <View style={Screens.editPost}>

            {/* Header */}
            <HeaderEdit date={post?.formatedDate || 'Date inconnue'} onCancelModify={()=>{cancelModification();}} back={()=>{updateTextLength(id, post?.text || ''); Back();}}/>

            
            {/* Editing section */}
            <View style={Screens.editPost_TextZone}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 20 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Header */}
                        <View style={[ViewsStyles.Row_space, {alignItems:'center', justifyContent:'space-between', marginBottom:10, marginHorizontal:10, paddingTop:6}]}>
                            {/* Title */}
                            <TextInput
                                style={[TextStyles.Title, {flexShrink: 1, minWidth:'50%', height:'100%', paddingHorizontal: 10}]}
                                placeholder="Title" // Description text
                                placeholderTextColor={Colors.ItemSecondary} // Color of the description text
                                multiline={true} // Enable multiline
                                numberOfLines={10}
                                textAlignVertical='center'
                                cursorColor={Colors.ItemSecondary} // Modify the cursor color
                                underlineColorAndroid="transparent" // Remove underline on Android
                                selectionColor={Colors.Button} // Color of the selection highlight
                                value={post?.title || ''}
                                onChangeText={(newTitle) => setPost(post ? { ...post, title: newTitle } : null)}
                                blurOnSubmit={true} // Prevent new lines on Enter key
                                onSubmitEditing={() => {}} // Handle Enter key without creating new line
                            />
                            {/* Labels Bubles */}
                            <Pressable
                                onPress={() =>setLabelsVisible(true)}
                                style={({pressed}) => ([{borderRadius:20, borderWidth:2, borderColor: pressed ? Colors.Button : Colors.Background_Primary}] )}>
                                    <LabelBubbles SizeRound={20} idPost={id} reLoadLabels={labelsVisible}/>
                            </Pressable>
                        </View>

                        {/* POST */}
                        <View
                            style={{
                                //flexShrink: 0, // supprime flex:1
                                width: '100%',
                                paddingHorizontal: 10,
                                paddingTop: 20,
                                borderTopWidth: 3,
                                borderColor: Colors.Background_Elements,
                            }}
                        >
                            {/* Text */}
                            <TextInput
                                style={{ ...TextStyles.TextWriting, minHeight: height, paddingBottom:100, paddingHorizontal: 10 }}
                                placeholder="Edit your post..."
                                placeholderTextColor={Colors.ItemSecondary}
                                multiline={true}
                                textAlignVertical="top"
                                cursorColor={Colors.ItemSecondary}
                                underlineColorAndroid="transparent"
                                selectionColor={Colors.Button}
                                value={post?.text || ''}
                                onChangeText={(newText) => setPost(post ? { ...post, text: newText } : null)}
                                scrollEnabled={true}
                                onContentSizeChange={(event) => {
                                    setHeight(event.nativeEvent.contentSize.height);
                                    scrollRef.current?.scrollToEnd({ animated: true });
                                }}
                            />

                            <View style={{ height: 150 }} />
                        </View>
                    </ScrollView>

                    <ExtractText visible={post?.text === ''} onClick={() => { setExtractVisible(true); }} />
                </KeyboardAvoidingView>
            </View>

            {/* PopIn placed at screen level to avoid clipping */}
            <PopInLabels idPost={id} visible={labelsVisible} onClose={() => {setLabelsVisible(false)}} />
            <PopInExtractText onSuccess={(ExtractedData)=>setPost(post ? { ...post , text:ExtractedData}: null)} visible={ExtractVisible} onClose={() => {setExtractVisible(false);}} />

        </View>
        </>
    )
}


export default EditPosts;