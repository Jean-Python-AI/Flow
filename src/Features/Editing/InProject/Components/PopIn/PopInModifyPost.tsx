import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, View, Text, Animated, Easing, Image } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { PopInStyles } from '../../../../../styles/PopIn';
import { TextStyles } from '../../../../../styles/Text';
import { ViewsStyles } from '../../../../../styles/Views';
import { ButtonStyles } from '../../../../../styles/Button';
// Styles -----------------------------------------------
import { Colors } from '../../../../../styles/theme';
// Component --------------------------------------------
import DeletePost_PopIn from './DeletePost_PopIn';



interface PopInLabelsProps {
  idPost: number;
  namePost: string;
  visible: boolean;
  onClose: () => void;
  actionAfterDelete: () => void;
}


// FUNCTION ====================================================================================
export default function PopInModifyPost({ idPost, namePost, visible, onClose, actionAfterDelete }: PopInLabelsProps) {
  // PopIn Delete Visible ?
  const [DeletePopInVisible, setDeletePopInVisible] = useState(false)

  const opacityAnim = useRef(new Animated.Value(0)).current;   // pour le fond
  const translateYAnim = useRef(new Animated.Value(300)).current; // pour la popin (hors écran)

  const [labels, modifyLabels] = useState<{id: number, name: string, color: string}[]>([]);
  
  // Animation at open and close
  useEffect(() => {
    if (visible) {
      // Animation d'apparition
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animation de disparition
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 300,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // for the animation if er is no post
  const [showFallback, setShowFallback] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const fallbackTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (labels.length === 0 && visible) {
      fadeAnim.setValue(0); // reset
      
      // ⏱ attendre que la pop-in ait fini (300ms)
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 250);

      return () => clearTimeout(timer);
    } else {
      fadeAnim.setValue(0);
    }
  }, [labels, visible]);
  
  useEffect(() => {
    if (showFallback) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [showFallback]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      {/* Fond flou animé */}
      <Animated.View style={{ flex: 1, opacity: opacityAnim }}>
        <Pressable style={{ flex: 1 }} onPress={onClose}>
          <BlurView
            style={{ flex: 1 }}
            blurType="light"
            blurAmount={1}
            reducedTransparencyFallbackColor="white"
          />
        </Pressable>
      </Animated.View>

      {/* Pop-in animée depuis le bas */}
      <Animated.View
        style={[
          PopInStyles.Background_Bottom,
          { transform: [{ translateY: translateYAnim }] },
        ]}
        pointerEvents="box-none"
      >
        {/* POPIN ---------------------------------------------------------------------------------------------*/}
        <View style={[PopInStyles.Bottom, {paddingBottom:50, gap:10}]}>

          {/* Title ----------------------------------------------*/}
          <Text style={[TextStyles.TextPost, {paddingBottom:10, marginLeft:10}]}>{namePost}</Text>


          {/* Button move Project --------------------------------*/}
          <Pressable style={({pressed})=>([ButtonStyles.Elements, {backgroundColor: pressed?Colors.Background_Elements:Colors.Background_Primary}])}>
            <Text style={TextStyles.TextBlack}>Move Post</Text>
          </Pressable>

          {/* Button delete Project ------------------------------*/}
          <Pressable style={({pressed})=>([ButtonStyles.Elements, {backgroundColor: pressed?Colors.Red_transparent:Colors.Background_Primary}])}
            onPress={() => { setDeletePopInVisible(true), onClose}}>
            <Text style={[TextStyles.TextBlack, {color:Colors.Red}]}>Delete Post</Text>
          </Pressable>


        </View>
      </Animated.View>

      {/* PopIn Delete Post -------------------------------------------*/}
      <DeletePost_PopIn PostId={idPost} namePost={namePost} visible={DeletePopInVisible} onClose={() => setDeletePopInVisible(false)} onChanged={() => {setDeletePopInVisible(false); onClose(); actionAfterDelete()}}/>
    </Modal>
  );
}