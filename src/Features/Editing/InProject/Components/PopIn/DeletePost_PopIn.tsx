import React, {useState} from 'react';
import { Modal, Pressable, View, Text, Image, TextInput } from 'react-native';
// Database
import { DeletePost } from '../../../../../DataBase/Posts/DeletePost';
// Import components
import PopIn from './GlobalPopIn';
// Import Styles
import { Colors } from '../../../../../styles/theme';
import { PopInStyles } from '../../../../../styles/PopIn';
import { ViewsStyles } from '../../../../../styles/Views';
import { ButtonStyles } from '../../../../../styles/Button';
import { TextStyles } from '../../../../../styles/Text';






interface NewProjectPopInProps {
  PostId: number;
  namePost:string;
  visible: boolean;
  onClose: () => void;
  onChanged?: () => void;
}



export default function DeletePost_PopIn({ PostId, namePost, visible, onClose, onChanged }: NewProjectPopInProps) {

  const _DeletePost = () => {
    DeletePost(PostId, () => { onClose(); if (onChanged) onChanged(); });
  };

  return (
    <PopIn visible={visible} onClose={onClose}>

      {/* Pop-In */}
      <View style={PopInStyles.DeleteProject}>

        <Text style={TextStyles.SubTitle}>Delete "{namePost}" post ?</Text>

        <View style={{gap:20, flexDirection:'row'}}>
          <Pressable onPress={onClose} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
            <View style={{paddingHorizontal:30, paddingVertical:5, borderRadius:10}}>
              <Text style={TextStyles.TextBlack}>Cancel</Text>
            </View>
          </Pressable>

          <Pressable onPress={_DeletePost} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
            <View style={{backgroundColor:Colors.Red, paddingHorizontal:30, paddingVertical:5, borderRadius:10}}>
              <Text style={[TextStyles.TextBlack, {color:Colors.Background_Primary}]}>Delete</Text>
            </View>
          </Pressable>
        </View>

      </View>

    </PopIn>
  );
}