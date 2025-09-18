import React, {useState} from 'react';
import { Pressable, View, Text, TextInput } from 'react-native';
// Database
import { DeleteCategory } from '../../DataManager/DeleteCategory';
import { ModifyCategory } from '../../DataManager/ModifyCategory';
// Import components
import PopIn from './GlobalPopIn';
// Import Styles
import { Colors } from '../../../../../styles/theme';
import { PopInStyles } from '../../../../../styles/PopIn';
import { ViewsStyles } from '../../../../../styles/Views';
import { ButtonStyles } from '../../../../../styles/Button';
import { TextStyles } from '../../../../../styles/Text';





interface NewProjectPopInProps {
  CategoryId: number;
  CategoryName: string;
  visible: boolean;
  onClose: () => void;
  onChanged?: () => void;
}



export default function ModifyCategoryPopIn({ CategoryId, CategoryName, visible, onClose, onChanged }: NewProjectPopInProps) {

  // Stocke le nom du projet
  const [categoryName_New, setcategoryName_New] = useState(CategoryName);

  const _DeleteProject = () => {
    DeleteCategory(CategoryId, () => { onClose(); if (onChanged) onChanged(); });
  };

  const ModifyCategory_Action = () => {
    ModifyCategory(CategoryId, categoryName_New, () => { onClose(); if (onChanged) onChanged(); })
  };

  return (
    <PopIn visible={visible} onClose={onClose}>

      {/* Pop-In ----------------------------------------------------------------------------------*/}
      <View style={PopInStyles.NewProject}>

        <View style={[ViewsStyles.Row_space, {width:'100%'}]}>
            <Text style={[TextStyles.Paragraph, TextStyles.medium, TextStyles.subText]}>Modify</Text>

            <Pressable onPress={_DeleteProject} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
                <View style={{backgroundColor:Colors.Red_Background, paddingHorizontal:10, paddingVertical:2, borderRadius:10}}>
                    <Text style={[TextStyles.Paragraph, TextStyles.light, TextStyles.semiBold, {color:Colors.Background_Primary}]}>Delete</Text>
                </View>
            </Pressable>
        </View>

        {/* Modify here the new project options --------------------------------------------------*/}
        <View style={{flexDirection:'row', gap:10, width:'100%'}}>
            <TextInput style={[TextStyles.TextInput, TextStyles.Paragraph, TextStyles.medium, TextStyles.normal, {width:'100%'}]} value={categoryName_New} onChangeText={setcategoryName_New}/>
        </View>

        <Pressable onPress={ModifyCategory_Action} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, width:'100%' }]}>
          <View style={ButtonStyles.ButtonBase}>
              <Text style={[TextStyles.Paragraph, TextStyles.semiBold, TextStyles.normal]}>Modify</Text>
          </View>
        </Pressable>

      </View>
    </PopIn>
  );
}