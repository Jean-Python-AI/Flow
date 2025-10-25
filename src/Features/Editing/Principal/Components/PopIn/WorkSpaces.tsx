import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, View, Text, Animated, Easing } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { PopInStyles } from '../../../../../styles/PopIn';
import { TextStyles } from '../../../../../styles/Text';
import { ButtonStyles } from '../../../../../styles/Button';
import { Colors } from '../../../../../styles/theme';
import { ReadWorkspace } from '../../../../../DataBase/WorkSpace/ReadWorkSpace';
import { ViewsStyles } from '../../../../../styles/Views';
import NewWorkSpacePopIn from './NewWorkSpace_PopIn';
import { ScrollView } from 'react-native-gesture-handler';
import WorkSpaceElement from './WorkSpaceElement';
// DataBase -------------------------------------------
import { WorkSpaceActivate } from '../../../../../DataBase/WorkSpace/WorkSpaceActivate';




interface PopInWorkSpaceProps {
  visible: boolean;
  onClose: () => void;
  nameWorkSpaceActivate: (name:string) => void;
}

export default function PopInWorkSpace({ visible, onClose, nameWorkSpaceActivate }: PopInWorkSpaceProps) {
  const idWorkSpaceActivate = WorkSpaceActivate((state) => state.id)

  const opacityAnim = useRef(new Animated.Value(0)).current;   // pour le fond
  const translateYAnim = useRef(new Animated.Value(300)).current; // pour la popin (hors écran)

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

  // WorkSpace
  const [Refresh, newRefresh] = useState(1)
  const [WorkSpaces, setWorkSpaces] = useState<{id:number, name:string}[]>([])
  useEffect(()=>{
    ReadWorkspace(setWorkSpaces)
  }, [Refresh])

  const [PopInNewWorkSpace, setPopInNewWorkSpace] = useState(false)

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
          <View style={ViewsStyles.Row_space}>
            <Text style={[TextStyles.TextPost, {paddingBottom:10, marginLeft:10}]}>MindSpaces</Text>

            <Pressable
              onPress={()=> setPopInNewWorkSpace(true)}
              style={({pressed})=>([ButtonStyles.Base, {backgroundColor: pressed?Colors.ItemSecondary : Colors.Button}])}
            >
              <Text style={[TextStyles.TextPost]}>new</Text>
            </Pressable>
          </View>

          <ScrollView>
            {WorkSpaces.map(work => (
              <WorkSpaceElement key={work.id} name={work.name} id={work.id} activate={idWorkSpaceActivate===work.id} modifyClick={()=> newRefresh(state=> state+1)} nameWorkSpaceActivate={(name)=> nameWorkSpaceActivate(name)}/>
            ))}
          </ScrollView>
          
        </View>
      </Animated.View>


      <NewWorkSpacePopIn visible={PopInNewWorkSpace} onCreated={()=>{newRefresh(past=> past+1);}} onClose={()=> setPopInNewWorkSpace(false)}/>
    </Modal>
  );
}
