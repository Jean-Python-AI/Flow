// IMPORTS ====================================================================
import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Pressable, TextInput, ScrollView, Alert } from 'react-native';
// Navigation ------------------------------------------------------------
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../App';
// Import Styles ---------------------------------------------------------
import { Colors } from '../../../styles/theme';
import { Screens } from '../../../styles/screens';
import { TextStyles } from '../../../styles/Text';
// Import Components -----------------------------------------------------
import HeaderEdit from './Components/Header';
import EditPostsBarr from './Components/EditPostBarr';
import PopInLabels from './Components/PopInLabels';
// Import Data -----------------------------------------------------------
import { ReadPostById } from './DataManager/ReadPost';
import { ModifyPost } from './DataManager/ModifyPost';



// For extract the params after ------------------------------------------
type EditPostRouteProp = RouteProp<RootStackParamList, 'EditPost'>;


// FUNCTION ====================================================================
function EditPosts() {
    // Extract the data from navigation -------------------------------
    const route = useRoute<EditPostRouteProp>();
    const { id, title } = route.params;
    // Post States ----------------------------------------------------
    const [postTitle, setPostTitle] = useState(title);
    const [postText, setPostText] = useState('');
    const [postDate, setPostDate] = useState('')
    // PopIn state ---------------------------------------------------
    const [labelsVisible, setLabelsVisible] = useState(false);

    // Load the post data if the ID alredy exists --------------------
    useEffect(() => {
        if (id) {
            ReadPostById(id, (postData) => {
                 setPostTitle(postData.title);
                 setPostText(postData.text);
                 setPostDate(postData.date)
            });
        }
    }, [id]);
    // Save the changes after a delay --------------------------------
    useEffect(() => {
        const timeout = setTimeout(() => {
            ModifyPost(id, postTitle, postText);
        }, 1000); // Save 1s after the last change

        return () => clearTimeout(timeout);
    }, [postTitle, postText]);


    // RETURN THE COMPONENT ------------------------------------------------------
    return(
        <View style={Screens.editPost}>
            {/* Phone Barr style */}
            <StatusBar backgroundColor={Colors.Background_Secondary}/>

            {/* Header */}
            <HeaderEdit date={postDate}/>

            <View style={Screens.editPost_TextZone}>
                 <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={true}>
                    {/* Title */}
                    <TextInput
                        style={[TextStyles.Title, TextStyles.bold]}
                        placeholder="Title" // Description text
                        placeholderTextColor={Colors.Text_Secondary} // Color of the description text
                        multiline={true} // Enable multiline
                        numberOfLines={10}
                        textAlignVertical='top'
                        cursorColor={Colors.Text_Secondary} // Modify the cursor color
                        underlineColorAndroid="transparent" // Remove underline on Android
                        selectionColor={Colors.Button} // Color of the selection highlight
                        value={postTitle}
                        onChangeText={setPostTitle}
                        blurOnSubmit={true} // Prevent new lines on Enter key
                        onSubmitEditing={() => {}} // Handle Enter key without creating new line
                    />

                     {/* Text */}
                     <TextInput
                         style={{...TextStyles.Paragraph, minHeight: 200, maxHeight: 1000}}
                         placeholder="Edit your post..."
                         placeholderTextColor={Colors.Text_Secondary}
                         multiline={true}
                         textAlignVertical='top'
                         cursorColor={Colors.Text_Secondary}
                         underlineColorAndroid="transparent" // Remove underline on Android
                         selectionColor={Colors.Button} // Color of the selection highlight
                         value={postText}
                         onChangeText={setPostText}
                         scrollEnabled={false} // Disable internal scrolling
                         onContentSizeChange={(event) => {
                             // This allows the TextInput to grow with content
                             const { height } = event.nativeEvent.contentSize;
                             // The TextInput will automatically adjust its height
                         }}
                     />

                </ScrollView>

                {/* Labels Barr */}
                <EditPostsBarr onOpenLabels={() => setLabelsVisible(true)} />
            </View>

            {/* PopIn placed at screen level to avoid clipping */}
            <PopInLabels idPost={id} visible={labelsVisible} onClose={() => {setLabelsVisible(false)}} />

        </View>
    )
}


export default EditPosts;