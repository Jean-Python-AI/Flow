import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated as RNAnimated } from 'react-native';
import BottomSheet from '../../../../../Components/BottomSheet';
import { ScrollView } from 'react-native-gesture-handler';
// Styles -----------------------------------------------
import { ViewsStyles } from '../../../../../styles/Views';
import { TextStyles } from '../../../../../styles/Text';
import { Colors } from '../../../../../styles/theme';
// Data Base --------------------------------------------
// Component --------------------------------------------


interface PostsPopInProps {
  visible: boolean;
  onClose: () => void;
  numberPosts: number;
}

export default function PostsPopIn({ visible, onClose, numberPosts }: PostsPopInProps) {
  
  return (
    <BottomSheet 
      visible={visible} 
      EntireScreenSpace={true} 
      HEIGHT={250} 
      onClose={async () => {
        onClose();
      }}
    >
      {/* List of information */}
      <ScrollView style={{width:'90%', marginTop:20, gap:20}}>
        <Text style={[TextStyles.Title, {fontSize:30}]}>{numberPosts} <Text style={{fontSize:20}}>posts</Text></Text>
      </ScrollView>
      
    </BottomSheet>
  );
};
