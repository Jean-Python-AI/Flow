import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
// Database
import { ReadCategory } from '../../DataBase/Category/Read';
// Import Style
import { HeadersStyle } from '../../styles/Headers';
import { Colors } from '../../styles/theme';
// Import Components
import CathegoryButton from './CathegoryButton';
import NewCategoryPopIn from '../PopIns/NewCategory';



export default function CathegoryFilter({parentId, onCategoryPress}: {parentId: number, onCategoryPress: (categoryId: number) => void}) {
  // State for the Pop In Category
  const [NewCategoryPopIn_IsVisible, _NewCategoryPopIn_IsVisible] = useState(false);

  const [categorys, modifyCategory] = useState<{id: number, name: string}[]>([]);

  const [categoryActivate, setCategoryActivate] = useState<number | null>(null);

  const reloadCategories = () => ReadCategory(parentId, modifyCategory);

  useEffect(() => {
    reloadCategories();
  }, [parentId]);
  
  return (
    <View style={{height:50}}>
      {/* Scroll Container component */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={HeadersStyle.cathegoryViewContainer}>


        {/* List of all the buttons */}
        {categorys.map(category => {
          const activate = category.id === categoryActivate; // true si catégorie active
          return (
            <CathegoryButton
              key={category.id}
              title={category.name}
              activate={activate} // on passe true ou false
              onPress={() => {onCategoryPress(category.id); setCategoryActivate(category.id);}}
            />
          );
        })}

        {/* Last button for create a new cathegory */}
        <CathegoryButton key={-1} title={' + New '} activate={false} onPress={() => _NewCategoryPopIn_IsVisible(true)}/>

      </ScrollView>

      {/* Pop In New Cathegory */}
      <NewCategoryPopIn
        parentId={parentId}
        visible={NewCategoryPopIn_IsVisible}
        onClose={() => {_NewCategoryPopIn_IsVisible(false)}}
        onCreated={reloadCategories}
      />
    </View>
  );
}