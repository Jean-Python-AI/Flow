import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
// Database
import { ReadCategory } from '../../../../../DataBase/Category/Read';
// Import Style
import { HeadersStyle } from '../../../../../styles/Headers';
import { Colors } from '../../../../../styles/theme';
// Import Components
import CathegoryButton from './Button';
import NewCategoryPopIn from '../PopIn/NewCategory';



export default function CathegoryView({parentId, categoryActivate_info, onCategoryPress}: {parentId: number, categoryActivate_info:number, onCategoryPress: (categoryId: number) => void}) {
  // State for the Pop In Category
  const [NewCategoryPopIn_IsVisible, _NewCategoryPopIn_IsVisible] = useState(false);

  const [categorys, modifyCategory] = useState<{id: number, name: string}[]>([]);

  const [categoryActivate, setCategoryActivate] = useState<number | null>(null);

  const reloadCategories = () => ReadCategory(parentId, modifyCategory);

  // State to check if it's the first time the component is loaded
  const [firstTime, setFisrtTime] = useState(true);

  useEffect(() => {
    reloadCategories();
  }, [parentId]);

  // Activate the first category if nothing is activated and it's the first time
  useEffect(() => {
    if (categoryActivate_info == 0 && categoryActivate == null && firstTime && categorys.length > 0) {
      const firstCategory = categorys[0];
      onCategoryPress(firstCategory.id);
      setCategoryActivate(firstCategory.id);
      setFisrtTime(false);
    }
  }, [categorys, categoryActivate_info, categoryActivate, firstTime, onCategoryPress]);
  
  return (
    <View style={{height:50}}>
      {/* Scroll Container component */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={HeadersStyle.cathegoryViewContainer}>


        {/* List of all the buttons -------------------------------------------------------------------------*/}
        {categorys.map(category => {
          const activate = category.id === categoryActivate; // true si catégorie active

          return (
            <CathegoryButton
              key={category.id}
              id={category.id}
              title={category.name}
              activate={activate} // on passe true ou false
              onPress={() => {onCategoryPress(category.id); setCategoryActivate(category.id);}}
              onChanged={reloadCategories}
            />
          );
        })}

        {/* Last button for create a new cathegory */}
        <CathegoryButton key={-1} id={-1} title={' + New '} activate={false} onPress={() => _NewCategoryPopIn_IsVisible(true)} onChanged={reloadCategories}/>

      </ScrollView>

      {/* Pop In New Cathegory */}
      <NewCategoryPopIn parentId={parentId} visible={NewCategoryPopIn_IsVisible} onClose={() => {_NewCategoryPopIn_IsVisible(false)}} onCreated={reloadCategories}/>
    </View>
  );
}