// IMPORT ===========================================================
import React from 'react';
import { Modal, Pressable, View, Text } from 'react-native';
import { BlurView } from '@react-native-community/blur';
// import Styles
import { TextStyles } from '../../../../../styles/Text';
import { PopInStyles } from '../../../../../styles/PopIn';
import { Colors } from '../../../../../styles/theme';
// DataBase
import { DeleteWorkSpace } from '../../../../../DataBase/WorkSpace/DeleteWorkSpace';



interface PopInProps {
  WorkSpaceId: number;
  WorkSpaceName: string;
  visible: boolean;
  onClose: () => void;
}


// FUNCTION ========================================================
export default function DeleteWorkSpacePopIn({WorkSpaceId, WorkSpaceName, visible, onClose} : PopInProps) {

    const DeleteWorkSpaceFunction = () => {
        DeleteWorkSpace(WorkSpaceId, ()=>onClose())
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
            
              <Text style={[TextStyles.SubTitle, {marginHorizontal:-10}]}>Delete WorkSpace:</Text>
              <Text style={[TextStyles.SubTitle, {marginHorizontal:-10}]}>{WorkSpaceName}</Text>
            
              <View style={{gap:20, flexDirection:'row'}}>
                <Pressable onPress={()=>{onClose();}} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
                  <View style={{paddingHorizontal:30, paddingVertical:5, borderRadius:10}}>
                    <Text style={TextStyles.TextBlack}>Cancel</Text>
                  </View>
                </Pressable>
            
                <Pressable onPress={() => {DeleteWorkSpaceFunction();}} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
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