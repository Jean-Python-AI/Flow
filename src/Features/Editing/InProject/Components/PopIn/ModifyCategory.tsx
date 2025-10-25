import React, {useEffect, useState} from 'react';
import { Pressable, View, Text, TextInput } from 'react-native';
// Database
import { DeleteCategory } from '../../../../../DataBase/Category/DeleteCategory';
import { ModifyCategory } from '../../../../../DataBase/Category/ModifyCategory';
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

  // Delete the category
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  useEffect(() => {
    if (!visible) {
        setShowConfirmDelete(false); // reset confirmation when pop-in is closed
    }
  }, [visible]);

  return (
    <PopIn visible={visible} onClose={onClose}>

      {/* Pop-In ----------------------------------------------------------------------------------*/}
      <View style={PopInStyles.NewProject}>

        {showConfirmDelete ? (
            <>
                <Text style={[TextStyles.TitlePost, {textAlign:'center', marginBottom:0, color:Colors.Text_Posts}]}>Delete the category with all the posts inside ?</Text>
                <View style={{flexDirection:'row', gap:10, width:'100%'}}>
                    <Pressable onPress={() => setShowConfirmDelete(false)} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, flex:1 }]}>
                        <View style={{backgroundColor:Colors.Background_Elements, alignItems:'center', justifyContent:'center', paddingVertical:5, borderRadius:10}}>
                            <Text style={TextStyles.TextBlack}>Cancel</Text>
                        </View>
                    </Pressable>
                    <Pressable onPress={_DeleteProject} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, flex:1 }]}>
                        <View style={{backgroundColor:Colors.Red, alignItems:'center', justifyContent:'center', paddingVertical:5, borderRadius:10}}>
                            <Text style={[TextStyles.TextBlack, {color:Colors.Background_Primary}]}>Delete</Text>
                        </View>
                    </Pressable>
                </View>
            </>
        ) : (
            <>
              <View style={[ViewsStyles.Row_space, {width:'100%'}]}>
                <Text style={TextStyles.TextPost}>Modify</Text>

                <Pressable onPress={() => setShowConfirmDelete(true)} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
                    <View style={{backgroundColor:Colors.Red, paddingHorizontal:10, paddingVertical:2, borderRadius:10}}>
                        <Text style={[TextStyles.TextBlack, {color:Colors.Background_Primary}]}>Delete</Text>
                    </View>
                </Pressable>
              </View>

              {/* Modify here the new project options */}
              <View style={{flexDirection:'row', gap:10, width:'100%'}}>
                  <TextInput style={[TextStyles.TextInput, TextStyles.TextBlack, {width:'100%'}]} value={categoryName_New} onChangeText={setcategoryName_New}/>
              </View>

              <Pressable onPress={ModifyCategory_Action} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, width:'100%' }]}>
                <View style={ButtonStyles.Base_maxWidth}>
                    <Text style={TextStyles.TextBlack}>Modify</Text>
                </View>
              </Pressable>
            </>
        )}

        

      </View>
    </PopIn>
  );
}