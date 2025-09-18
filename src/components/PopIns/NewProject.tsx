import React, {useState} from 'react';
import { Modal, Pressable, View, Text, Image, TextInput, Alert } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import db from '../../DataBase/dataBase'; // Assure-toi d'importer db ici
// Database
import { NewProject } from '../../DataBase/Projects/New';
// Import components
import PopIn from './GlobalPopIn';
// Import Styles
import { Colors } from '../../styles/theme';
import { PopInStyles } from '../../styles/PopIn';
import { ViewsStyles } from '../../styles/Views';
import { ButtonStyles } from '../../styles/Button';
import { TextStyles } from '../../styles/Text';






interface NewProjectPopInProps {
  visible: boolean;
  onClose: () => void;
  onCreated?: () => void;
}



export default function NewProjectPopIn({ visible, onClose, onCreated }: NewProjectPopInProps) {

  // Stocke le nom du projet
  const [projectName, setProjectName] = useState('');

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
      if (onCreated) onCreated();
    });
  };

  return (
    <PopIn visible={visible} onClose={onClose}>

      {/* Pop-In */}
      <View style={PopInStyles.NewProject}>

        <View style={ViewsStyles.Row_space}>
            <Text style={[TextStyles.Paragraph, TextStyles.medium, TextStyles.subText]}>New Project</Text>
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
              <Text style={[TextStyles.Paragraph, TextStyles.semiBold, TextStyles.normal]}>Create</Text>
          </View>
        </Pressable>

      </View>
    </PopIn>
  );
}