import React, {useState} from 'react';
import { Modal, Pressable, View, Text, Image, TextInput, Alert } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import db from '../../DataBase/dataBase'; // Assure-toi d'importer db ici
// Database
import { NewProject } from '../../DataBase/Projects/New';
import { DeleteProject } from '../../DataBase/Projects/Delete';
// Import components
import PopIn from './GlobalPopIn';
import InfoBubble from '../Inof_buble';
// Import Styles
import { Colors } from '../../styles/theme';
import { PopInStyles } from '../../styles/PopIn';
import { ViewsStyles } from '../../styles/Views';
import { ButtonStyles } from '../../styles/Button';
import { TextStyles } from '../../styles/Text';






interface NewProjectPopInProps {
  ProjectId: number;
  visible: boolean;
  onClose: () => void;
  onChanged?: () => void;
}



export default function ModifyProjectPopIn({ ProjectId, visible, onClose, onChanged }: NewProjectPopInProps) {

  // Stocke le nom du projet
  const [projectName, setProjectName] = useState('');

  const _DeleteProject = () => {
    DeleteProject(ProjectId, () => { onClose(); if (onChanged) onChanged(); });
  };

  const handleCreate = () => {
    console.log("Callback appelé !");
    const name = projectName.trim();
    if (!name) {
      Alert.alert('Nom requis', 'Entrez un nom de projet.');
      return;
    }
    NewProject(name, () => {
      // Log des projets après l'insertion
      console.log("Callback appelé !");
      db.transaction(tx => {
        tx.executeSql(
          "SELECT * FROM projects;",
          [],
          (_, results) => {
            console.log("Projects après insert:", results.rows.raw());
          },
          (_, error) => {
            console.log("Erreur SELECT:", error);
            return false;
          }
        );
      });

      setProjectName(''); // reset
      onClose(); // fermer la pop-in après insertion
    });
  };

  return (
    <PopIn visible={visible} onClose={onClose}>

      {/* Pop-In */}
      <View style={PopInStyles.NewProject}>

        <View style={ViewsStyles.Row_space}>
            <Text style={[TextStyles.Paragraph, TextStyles.medium, TextStyles.subText]}>Modify</Text>

            <Pressable onPress={_DeleteProject} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
                <View style={{backgroundColor:Colors.Red_Background, paddingHorizontal:10, paddingVertical:2, borderRadius:10}}>
                    <Text style={[TextStyles.Paragraph, TextStyles.medium, TextStyles.normal, {color:Colors.Background_Primary}]}>Delete</Text>
                </View>
            </Pressable>
        </View>

        {/* Modify here the new project options */}
        <View style={{flexDirection:'row', gap:10}}>

            <Pressable
              onPress={() => {}}
              style={({ pressed }) => [
                  {
                  opacity: pressed ? 0.5 : 1,
                  },
              ]}
              >
                <View style={{width:44, height:44, padding:8, backgroundColor:Colors.Button, borderRadius:10, justifyContent:'center', alignItems:'center'}}>
                    <Image source={require('../../../assets/icons/Pen.png')} style={{width:'100%', height:'100%'}} />
                </View>
            </Pressable>

            <TextInput style={[TextStyles.TextInput, TextStyles.Paragraph, TextStyles.medium, TextStyles.normal]} value={projectName} onChangeText={setProjectName}/>

        </View>

        <Pressable onPress={handleCreate} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <View style={ButtonStyles.ButtonBase}>
              <Text style={[TextStyles.Paragraph, TextStyles.semiBold, TextStyles.normal]}>Modify</Text>
          </View>
        </Pressable>

      </View>
    </PopIn>
  );
}