import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
// Navigation -------------------------------------------
import { useNavigation } from '@react-navigation/native';
// Import Icon ------------------------------------------
import User from '../../../../../assets/icons/User.svg';
// Database ---------------------------------------------
import { useEditPost } from '../../../../DATA/Hooks/Posts/PostEdit';
// Import Style
import { ViewsStyles } from '../../../../styles/Views';
import { ButtonStyles } from '../../../../Components/UI/Button';
import { Colors } from '../../../../styles/theme';
import { TextStyles } from '../../../../styles/Text';


interface BottomBarProps {
  empty?: boolean;
}

// FUNCTION ================================================================
export default function BottomBar({empty}: BottomBarProps) {
  const navigation = useNavigation<any>();
  const [isEmpty, setIsEmpty] = useState(false);
  const { AddPostHook } = useEditPost();

  const handleNewPost = useCallback(async () => {
    console.log('BottomBar: +Post pressed');
    try {
      const newId = await AddPostHook('', '');
      console.log('BottomBar: navigating to EditPost with id', newId);
      navigation.navigate('EditPost', { id: newId });
    } catch (error) {
      console.error('Erreur insertPost depuis BottomBar (handleNewPost):', error);
    }
  }, [AddPostHook, navigation]);

  if (empty) {
    console.log('BottomBar: not empty, returning null');
  }

  // Waiter for the empty button to be visible
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsEmpty(empty || false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [empty]);

  
  return (
    <View style={ViewsStyles.BottomBar}>
        {/* SETTINGS */}
        <Pressable
            onPress={()=>{
                navigation.navigate("SettingGlobal");
            }}
            style={({pressed})=>([ButtonStyles.Settings, { borderWidth:2, borderColor: pressed ? Colors.Button : Colors.Background_Elements}])}
        >
            <User width={25} height={25} color={Colors.Text_Posts}/>
        </Pressable>

        {/* New POST */}
        <Pressable
            onPress={handleNewPost}
            style={({pressed})=>([ButtonStyles.AddPost, { borderWidth:2, borderColor: pressed || empty ? Colors.Button : empty ? Colors.text : Colors.Background_Elements, backgroundColor: empty ? Colors.Button : Colors.Background_Elements}])}
        >
            <Text style={TextStyles.TextBlack}>{empty?"Write a first Post":"+ Post"}</Text>
        </Pressable>
    </View>
  );
}