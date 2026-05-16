import React from 'react';
import { Modal, Pressable, View, Text } from 'react-native';
import { BlurView } from '@react-native-community/blur';
// Database
import { useEditPost } from '../../../../../DATA/Hooks/Posts/PostEdit';
// Import Styles
import { Colors } from '../../../../../styles/theme';
import { PopInStyles } from '../../../../../Components/UI/PopIn';
import { ViewsStyles } from '../../../../../styles/Views';
import { ButtonStyles } from '../../../../../Components/UI/Button';
import { TextStyles } from '../../../../../styles/Text';






interface DeletePopinProps {
  idPost: number;
  visible: boolean;
  onDelete: () => void;
  onClose: () => void;
}



export default function PopInDelete({ idPost, visible, onDelete, onClose }: DeletePopinProps) {
  const { DeletePostHook } = useEditPost(); 
  
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
        {/* Fond flou */}
        <Pressable style={{ flex: 1 }} onPress={onClose}>
          <BlurView
            style={{ flex: 1 }}
            blurType="light"   // "light", "dark", "xlight", etc.
            blurAmount={1}   // intensité du flou
            reducedTransparencyFallbackColor="white" // fallback Android
          />
        </Pressable>
    
        
        <View style={[PopInStyles.Background, { opacity: visible ? 1 : 0 }]} pointerEvents="box-none">
          

            {/* Pop-In ------------------------------------*/}
            <View style={[PopInStyles.NewProject]}>

                <Text style={TextStyles.TextPost}>Delete Post</Text>
                <Text style={TextStyles.TextBlack}>Do you want to delete this Post ?</Text>

                <View style={[ViewsStyles.Row_space, {gap:15}]}>
                  <Pressable
                    style={[ButtonStyles.Base, {flex:1, height:40}]}
                    onPress={onClose}
                  >
                    <Text style={TextStyles.TextBlack}>Cancel</Text>
                  </Pressable>

                  <Pressable
                    style={[ButtonStyles.Base, {flex:1, backgroundColor:Colors.Red, height:40}]}
                    onPress={()=> DeletePostHook(idPost).then(()=>{onClose(); onDelete();})}
                  >
                    <Text style={[TextStyles.TextBlack, {color:Colors.Background_Primary}]}>Delete</Text>
                  </Pressable>
                </View>

            </View>
            

        </View>
    
    </Modal>
  );
}