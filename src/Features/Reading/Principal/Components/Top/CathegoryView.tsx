import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
// Database
import { ReadCategory } from '../../../../../DataBase/Category/Read';
// Import Style
import { HeadersStyle } from '../../../../../styles/Headers';
import { Colors } from '../../../../../styles/theme';
// Import Components
import CathegoryButton from './Button';


// Liste des Labels en attendant la BDD
const labels = [
  {id: 1, name: 'All'},
  {id: 2, name: 'Work'},
  {id: 3, name: 'Personal'},
  {id: 4, name: 'Shopping'},
  {id: 5, name: 'Wishlist'},
  {id: 6, name: 'Travel'},
  {id: 7, name: 'Ideas'},
  {id: 8, name: 'Projects'},
];



export default function CathegoryView({ categoryActivate_info, onCategoryPress}: { categoryActivate_info:number, onCategoryPress: (categoryId: number) => void}) {

  const [categorys, modifyCategory] = useState<{id: number, name: string}[]>([]);

  const [categoryActivate, setCategoryActivate] = useState<number | null>(null);

  // State to check if it's the first time the component is loaded
  const [firstTime, setFisrtTime] = useState(true);

  // Activate the first category if nothing is activated and it's the first time
  useEffect(() => {
    if (categoryActivate_info == -1 && categoryActivate == null && firstTime && labels.length > 0) {
      const firstLabel = labels[0];
      onCategoryPress(firstLabel.id);
      setCategoryActivate(firstLabel.id);
      setFisrtTime(false);
    }
  }, [categorys, categoryActivate_info, categoryActivate, firstTime, onCategoryPress]);
  
  return (
    <View style={{height:50}}>
      {/* Scroll Container component */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={HeadersStyle.cathegoryViewContainer}>


        {/* List of all the buttons -------------------------------------------------------------------------*/}
        {labels.map(category => {
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

      </ScrollView>
    </View>
  );
}