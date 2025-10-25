// IMPORT ===========================================================
import React from 'react';
import { Modal, Pressable, View, Text } from 'react-native';
import { BlurView } from '@react-native-community/blur';
// import Styles
import { TextStyles } from '../../../../../styles/Text';
import { PopInStyles } from '../../../../../styles/PopIn';
import { Colors } from '../../../../../styles/theme';



interface PopInProps {
  visible: boolean;
  onClose: () => void;
  CancelModif: () => void;
}


// FUNCTION ========================================================
export default function CancelPopIn({visible, onClose, CancelModif} : PopInProps) {
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
            
              <Text style={[TextStyles.SubTitle, {marginHorizontal:-10}]}>Remove the modifications?</Text>
            
              <View style={{gap:20, flexDirection:'row'}}>
                <Pressable onPress={onClose} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
                  <View style={{paddingHorizontal:30, paddingVertical:5, borderRadius:10}}>
                    <Text style={TextStyles.TextBlack}>Cancel</Text>
                  </View>
                </Pressable>
            
                <Pressable onPress={() => {onClose(); CancelModif();}} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
                  <View style={{backgroundColor:Colors.Red, paddingHorizontal:30, paddingVertical:5, borderRadius:10}}>
                    <Text style={[TextStyles.TextBlack, {color:Colors.Background_Primary}]}>Remove</Text>
                  </View>
                </Pressable>
              </View>
            
            </View>
        </View>

        </Modal>
    );
};