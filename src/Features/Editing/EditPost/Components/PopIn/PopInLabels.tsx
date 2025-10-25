import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, View, Text, Animated, Easing, Image, ScrollView } from 'react-native';
import { BlurView } from '@react-native-community/blur';
// Styles -----------------------------------------------
import { Colors } from '../../../../../styles/theme';
import { PopInStyles } from '../../../../../styles/PopIn';
import { TextStyles } from '../../../../../styles/Text';
import { ViewsStyles } from '../../../../../styles/Views';
import { ButtonStyles } from '../../../../../styles/Button';
// Data Base --------------------------------------------
import { ReadAllLabels } from '../../../../../DataBase/Labels/ReadLabel';
import { ReadLabelsByPostId } from '../../../../../DataBase/Labels/Read_PostLabel';
// Component --------------------------------------------
import LabelElement from '../LabelElement';
import PopInNewLabel from './PopInNewLabels';




interface PopInLabelsProps {
  idPost: number;
  visible: boolean;
  onClose: () => void;
}


// FUNCTION ====================================================================================
export default function PopInLabels({ idPost, visible, onClose }: PopInLabelsProps) {
  const opacityAnim = useRef(new Animated.Value(0)).current;   // pour le fond
  const translateYAnim = useRef(new Animated.Value(300)).current; // pour la popin (hors écran)

  const [labels, modifyLabels] = useState<{id: number, name: string, color: string}[]>([]);

  // Read Labels
  useEffect(() => {
      ReadAllLabels(modifyLabels);
    }, []);
  
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


  // Read the labels is linked with the post
  const [LabelsActivates, setLabelsActivate] = useState<number[]>([]);
  useEffect(() => {
      ReadLabelsByPostId(idPost, (labels) => {
        setLabelsActivate(labels.map(label => label.id));
      });
    }, []);


  // PopIn New Label -----------------------------------
  const [newLabelVisible, setNewLabelVisible] = useState(false);


  
  // RETURN ===============================================================================
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
        <View style={PopInStyles.Bottom}>

          {/* Header ---------------------------------*/}
          <View style={ViewsStyles.Row_space}>
            {/* Title */}
            <Text style={[TextStyles.TextPost, TextStyles.subText]}>Labels</Text>
            {/* Button add New */}
            <Pressable onPress={()=>setNewLabelVisible(true)} style={({pressed})=>([ButtonStyles.Base, {backgroundColor: pressed? Colors.Background_Elements : Colors.Button}])}>
              <Text style={TextStyles.TextPost}>+ New</Text>
            </Pressable>
          </View>

          <View style={{height:15}}/>

          
          {/* List of the Labels */}
          <ScrollView style={{}}>
            {labels.length > 0 ? (
              labels.map(label => (
                <LabelElement
                  key={label.id}
                  color={label.color}
                  name={label.name}
                  id={label.id}
                  PostId={idPost}
                  activateIds={LabelsActivates}
                  callback={() => {
                    ReadAllLabels(modifyLabels);
                    ReadLabelsByPostId(idPost, (labels) => setLabelsActivate(labels.map(label => label.id)));
                  }}
                />
              ))
            ) : (
              <Animated.View style={[{paddingBottom:50, opacity: fadeAnim, transform: [{ translateY: fallbackTranslateY }]}]}>
                <Text style={TextStyles.TextPost}>No Label</Text>
              </Animated.View>
            )}
            <View style={{height:50}}/>
          </ScrollView>

        </View>
      </Animated.View>

      {/* PopIn New Label */}
      <PopInNewLabel isVisible={newLabelVisible} callback={()=>{ReadAllLabels(modifyLabels)}} onClose={()=>setNewLabelVisible(false)}/>
    </Modal>
  );
}