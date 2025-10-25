import React, {useState} from 'react';
import { Modal, Pressable, View, Text } from 'react-native';
import { BlurView } from '@react-native-community/blur';
// Database
import { DeleteProject } from '../../../../../DataBase/Projects/DeleteProject';
// Import Styles
import { Colors } from '../../../../../styles/theme';
import { PopInStyles } from '../../../../../styles/PopIn';
import { TextStyles } from '../../../../../styles/Text';






interface NewProjectPopInProps {
  ProjectId: number;
  visible: boolean;
  onClose: () => void;
  onChanged?: () => void;
}



export default function DeleteProject_PopIn({ ProjectId, visible, onClose, onChanged }: NewProjectPopInProps) {

  const _DeleteProject = () => {
    DeleteProject(ProjectId, () => { onClose(); if (onChanged) onChanged(); });
  };

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

      {/* The pop-in */}
      <View style={[PopInStyles.Background, { opacity: visible ? 1 : 0 }]} pointerEvents="box-none">
        {/* Pop-In */}
        <View style={PopInStyles.DeleteProject}>

          <Text style={TextStyles.SubTitle}>Delete project ?</Text>

          <View style={{gap:20, flexDirection:'row'}}>
            <Pressable onPress={onClose} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
              <View style={{paddingHorizontal:30, paddingVertical:5, borderRadius:10}}>
                <Text style={TextStyles.TextBlack}>Cancel</Text>
              </View>
            </Pressable>

            <Pressable onPress={_DeleteProject} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
              <View style={{backgroundColor:Colors.Red, paddingHorizontal:30, paddingVertical:5, borderRadius:10}}>
                <Text style={[TextStyles.TextBlack, {color:Colors.Background_Primary}]}>Delete</Text>
              </View>
            </Pressable>
          </View>

        </View>
      </View>

    </Modal>
  );
}