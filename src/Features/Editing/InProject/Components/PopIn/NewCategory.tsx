import React, {useState} from 'react';
import { Modal, Pressable, View, Text, Image, TextInput, Alert } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import db from '../../../../../DataBase/dataBase'; // Assure-toi d'importer db ici
// Database
import { NewCategory } from '../../../../../DataBase/Category/New';
// Import components
import PopIn from './GlobalPopIn';
// Import Styles
import { Colors } from '../../../../../styles/theme';
import { PopInStyles } from '../../../../../styles/PopIn';
import { ViewsStyles } from '../../../../../styles/Views';
import { ButtonStyles } from '../../../../../styles/Button';
import { TextStyles } from '../../../../../styles/Text';






interface NewProjectPopInProps {
  parentId: number;
  visible: boolean;
  onClose: () => void;
  onCreated?: () => void;
}



export default function NewCategoryPopIn({ parentId, visible, onClose, onCreated }: NewProjectPopInProps) {

  // Stocke le nom de la catégorie
  const [CategoryName, _CategoryName] = useState('');

  const AddNewCategory = () => {
    NewCategory(CategoryName, parentId, () => {
      _CategoryName(''); // reset
      onClose(); // fermer la pop-in après insertion
      if (onCreated) onCreated();
    });
  };

  return (
    <PopIn visible={visible} onClose={onClose}>

      {/* Pop-In */}
      <View style={PopInStyles.NewProject}>

        <View style={ViewsStyles.Row_space}>
            <Text style={TextStyles.TextPost}>New Category</Text>
        </View>

        {/* Modify here the new project options */}
        <View style={{flexDirection:'row', gap:10}}>

            <TextInput style={[TextStyles.TextInput, TextStyles.TextBlack, {width:"100%"}]} value={CategoryName} onChangeText={_CategoryName}/>

        </View>

        <Pressable onPress={AddNewCategory} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, width:'100%' }]}>
          <View style={ButtonStyles.Base_maxWidth}>
              <Text style={TextStyles.TextBlack}>Create</Text>
          </View>
        </Pressable>

      </View>
    </PopIn>
  );
}