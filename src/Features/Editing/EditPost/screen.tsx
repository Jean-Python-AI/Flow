// IMPORTS ====================================================================
import React, { useState, useEffect, useRef, use } from 'react';
import { View, Text, StatusBar, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
// Navigation ------------------------------------------------------------
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// Import Styles ---------------------------------------------------------
import { Colors } from '../../../styles/theme';
import { Screens } from '../../../styles/screens';
import { TextStyles } from '../../../styles/Text';
import { ViewsStyles } from '../../../styles/Views';
// Import Components -----------------------------------------------------
import HeaderEdit from './Components/Header';
import PopInLabels from './Components/PopIn/PopInLabels';
import LabelBubble from '../../../Components/LabelsBuble';
// Import Data -----------------------------------------------------------
import { ReadPostById } from '../../../DataBase/Posts/ReadPost';
import { ModifyPost } from '../../../DataBase/Posts/ModifyPost';



// For extract the params after ------------------------------------------
type Props = NativeStackScreenProps<RootStackParamList, 'EditPost'>;


// FUNCTION ====================================================================
function EditPosts({ route, navigation }: Props) {
    const { id, title } = route.params;
    // Post States ----------------------------------------------------
    const [postTitle, setPostTitle] = useState(title);
    const [postText, setPostText] = useState('');
    const [postDate, setPostDate] = useState<number>(0)
    // For the cancel modification
    const [originalTitle, setOriginalTitle] = useState(title);
    const [originalText, setOriginalText] = useState('');
    useEffect(() => {
        ReadPostById(id, (postData) => {
            setOriginalText(postData.text);
        });
    }, [id, title]);
    // Cancal modification function
    const cancelModification = () => {
        setPostTitle(originalTitle);
        setPostText(originalText);
    };
    // PopIn state ---------------------------------------------------
    const [labelsVisible, setLabelsVisible] = useState(false);

    // Load the post data if the ID alredy exists --------------------
    useEffect(() => {
        if (id) {
            ReadPostById(id, (postData) => {
                 setPostTitle(postData.title);
                 setPostText(postData.text);
                 setPostDate(postData.createdAt)
            });
        }
    }, [id]);
    // Save the changes after a delay --------------------------------
    useEffect(() => {
        const timeout = setTimeout(() => {
            ModifyPost(id, postTitle, postText);
        }, 500); // Save 1s after the last change

        return () => clearTimeout(timeout);
    }, [postTitle, postText]);


    // for a automatic scroll when we writing
    const [height, setHeight] = useState(400)
    const scrollRef = useRef<ScrollView>(null);


    // RETURN THE COMPONENT ------------------------------------------------------
    return(
        <View style={Screens.editPost}>
            {/* Phone Barr style */}
            <StatusBar backgroundColor={Colors.Background_Elements}/>

            {/* Header */}
            <HeaderEdit date={postDate} onCancelModify={()=>{cancelModification();}}/>

            
            {/* Editing section */}
            <View style={Screens.editPost_TextZone}>
                <View style={{flex:1}}>

                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <ScrollView
                            contentContainerStyle={{ paddingBottom: 20 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Header */}
                            <View style={[ViewsStyles.Row_space, {alignItems:'center', marginBottom:10, marginHorizontal:10}]}>
                                {/* Title */}
                                <TextInput
                                    style={[TextStyles.Title, {maxWidth:'80%', paddingRight:'10%'}]}
                                    placeholder="Title" // Description text
                                    placeholderTextColor={Colors.ItemSecondary} // Color of the description text
                                    multiline={true} // Enable multiline
                                    numberOfLines={10}
                                    textAlignVertical='top'
                                    cursorColor={Colors.ItemSecondary} // Modify the cursor color
                                    underlineColorAndroid="transparent" // Remove underline on Android
                                    selectionColor={Colors.Button} // Color of the selection highlight
                                    value={postTitle}
                                    onChangeText={setPostTitle}
                                    blurOnSubmit={true} // Prevent new lines on Enter key
                                    onSubmitEditing={() => {}} // Handle Enter key without creating new line
                                />
                                {/* Labels Bubles */}
                                <Pressable
                                    onPress={() =>setLabelsVisible(true)}
                                    style={({pressed}) => ([{backgroundColor: pressed?Colors.Background_Elements : Colors.Background_Primary, padding:5, borderRadius:20}])}>
                                        <LabelBubble SizeRound={20} idPost={id} reLoadLabels={labelsVisible}/>
                                </Pressable>
                            </View>

                            {/* POST */}
                            <View
                                style={{
                                    //flexShrink: 0, // supprime flex:1
                                    width: '100%',
                                    paddingHorizontal: 10,
                                    borderTopWidth: 3,
                                    borderColor: Colors.Background_Elements,
                                }}
                            >
                                {/* Text */}
                                <TextInput
                                    style={{ ...TextStyles.TextWriting, marginTop: 10, minHeight: height }}
                                    placeholder="Edit your post..."
                                    placeholderTextColor={Colors.ItemSecondary}
                                    multiline={true}
                                    textAlignVertical="top"
                                    cursorColor={Colors.ItemSecondary}
                                    underlineColorAndroid="transparent"
                                    selectionColor={Colors.Button}
                                    value={postText}
                                    onChangeText={setPostText}
                                    scrollEnabled={true}
                                    onContentSizeChange={(event) => {
                                        setHeight(event.nativeEvent.contentSize.height);
                                        scrollRef.current?.scrollToEnd({ animated: true });
                                    }}
                                />
                                <View style={{ height: 200 }} />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>


                    

                </View>

                {/* Labels Barr */}
                {/*<EditPostsBarr/>*/}
            </View>

            {/* PopIn placed at screen level to avoid clipping */}
            <PopInLabels idPost={id} visible={labelsVisible} onClose={() => {setLabelsVisible(false)}} />

        </View>
    )
}


export default EditPosts;