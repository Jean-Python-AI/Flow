// IMPORT ===========================================================
import React from 'react';
import { Modal, Pressable, View, Text } from 'react-native';
import { BlurView } from '@react-native-community/blur';
// import Styles
import { TextStyles } from '../../../../../styles/Text';
import { PopInStyles } from '../../../../../styles/PopIn';
import { Colors } from '../../../../../styles/theme';
// DataBase
import { DeleteLabel } from '../../../../../DataBase/Labels/DeleteLabel';



interface PopInProps {
  labelId: number;
  labelName: string;
  visible: boolean;
  onClose: () => void;
}


// FUNCTION ========================================================
export default function DeleteLabelPopIn({labelId, labelName, visible, onClose} : PopInProps) {

    const DeletelabelFunction = () => {
        DeleteLabel(labelId, (success) => {
            if (success) {
                console.log("WorkSpace successfully deleted.");
                onClose();
            } else {
                console.log("Failed to delete label.");
            }
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
            <View style={PopInStyles.DeleteProject}>
            
              <Text style={[TextStyles.SubTitle, {marginHorizontal:-10}]}>Delete Label:</Text>
              <Text style={[TextStyles.SubTitle, {marginHorizontal:-10}]}>{labelName}</Text>
            
              <View style={{gap:20, flexDirection:'row'}}>
                <Pressable onPress={()=>{onClose();}} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
                  <View style={{paddingHorizontal:30, paddingVertical:5, borderRadius:10}}>
                    <Text style={TextStyles.TextBlack}>Cancel</Text>
                  </View>
                </Pressable>
            
                <Pressable onPress={() => {DeletelabelFunction();}} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
                  <View style={{backgroundColor:Colors.Red, paddingHorizontal:30, paddingVertical:5, borderRadius:10}}>
                    <Text style={[TextStyles.TextBlack, {color:Colors.Background_Primary}]}>Delete</Text>
                  </View>
                </Pressable>
              </View>
            
            </View>
        </View>

        </Modal>
    );
};