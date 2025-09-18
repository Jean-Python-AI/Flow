import React, {useState} from 'react';
import { Modal, Pressable, View, Text, Image, TextInput } from 'react-native';
// Database
import { DeleteProject } from '../DataManager/DeleteProject';
// Import components
import PopIn from './GlobalPopIn';
// Import Styles
import { Colors } from '../../../../styles/theme';
import { PopInStyles } from '../../../../styles/PopIn';
import { ViewsStyles } from '../../../../styles/Views';
import { ButtonStyles } from '../../../../styles/Button';
import { TextStyles } from '../../../../styles/Text';






interface NewProjectPopInProps {
  ProjectId: number;
  visible: boolean;
  onClose: () => void;
  onChanged?: () => void;
}



export default function DeleteProject_PopIn({ ProjectId, visible, onClose, onChanged }: NewProjectPopInProps) {

  // Stocke le nom du projet
  const [projectName, setProjectName] = useState('');

  const _DeleteProject = () => {
    DeleteProject(ProjectId, () => { onClose(); if (onChanged) onChanged(); });
  };

  return (
    <PopIn visible={visible} onClose={onClose}>

      {/* Pop-In */}
      <View style={PopInStyles.DeleteProject}>

        <Text style={[TextStyles.SubTitle, TextStyles.semiBold, TextStyles.align_center]}>Delete this project ?</Text>

        <View style={{gap:20, flexDirection:'row'}}>
          <Pressable onPress={onClose} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
            <View style={{paddingHorizontal:30, paddingVertical:5, borderRadius:10}}>
              <Text style={[TextStyles.Paragraph, TextStyles.medium, TextStyles.normal, TextStyles.subText]}>Cancel</Text>
            </View>
          </Pressable>

          <Pressable onPress={_DeleteProject} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
            <View style={{backgroundColor:Colors.Red_Background, paddingHorizontal:30, paddingVertical:5, borderRadius:10}}>
              <Text style={[TextStyles.Paragraph, TextStyles.medium, TextStyles.normal, {color:Colors.Background_Primary}]}>Delete</Text>
            </View>
          </Pressable>
        </View>

      </View>

    </PopIn>
  );
}