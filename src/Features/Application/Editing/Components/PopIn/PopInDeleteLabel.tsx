// IMPORT ===========================================================
import React from 'react';
import { Modal, Pressable, View, Text } from 'react-native';
import { BlurView } from '@react-native-community/blur';
// import Styles
import { TextStyles } from '../../../../../styles/Text';
import { PopInStyles } from '../../../../../Components/UI/PopIn';
import { Colors } from '../../../../../styles/theme';
// DataBase
import { useEditLabel } from '../../../../../DATA/Hooks/Labels/LabelEdit';



interface PopInProps {
  labelId: number;
  labelName: string;
  visible: boolean;
  onClose: () => void;
}


// FUNCTION ========================================================
export default function DeleteLabelPopIn({labelId, labelName, visible, onClose} : PopInProps) {
  const { DeleteLabel } = useEditLabel(0);

    const DeletelabelFunction = () => {
      DeleteLabel(labelId).then(() => {
        onClose();
      }).catch((error) => {
        console.error('Erreur DeleteLabel depuis PopInDeleteLabel:', error);
      });
  }

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      {/* Fond flou */}
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <BlurView
          style={{ flex: 1 }}
          blurType="light"   // "light", "dark", "xlight", etc.
          blurAmount={1}   // intensité du flou
          reducedTransparencyFallbackColor="white" // fallback Android
        />
      </Pressable>

          {/* The pop-in */}
          <View style={[PopInStyles.Background, { opacity: visible ? 1 : 0 }]} pointerEvents="box-none">
              <View style={[PopInStyles.NewProject, {alignItems:'center', gap:10}]}>
              
                <Text style={TextStyles.TextBlack}>Delete Label</Text>
                <Text style={TextStyles.TitlePost}>{labelName}</Text>
              
                <View style={{gap:20, flexDirection:'row', marginTop:20}}>
                  <Pressable onPress={()=>{onClose();}} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, paddingHorizontal:30, paddingVertical:10, borderRadius:10, backgroundColor:Colors.Button }]}>
                    <Text style={TextStyles.TextBlack}>Cancel</Text>
                  </Pressable>
              
                  <Pressable onPress={() => {DeletelabelFunction();}} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, backgroundColor:Colors.Red, paddingHorizontal:30, paddingVertical:10, borderRadius:10 }]}>
                    <Text style={[TextStyles.TextBlack, {color:Colors.Background_Primary}]}>Delete</Text>
                  </Pressable>
                </View>
              
              </View>
          </View>

        </Modal>
    );
};