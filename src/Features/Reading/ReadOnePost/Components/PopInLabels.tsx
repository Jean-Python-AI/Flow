import React, {useEffect} from 'react';
import { Modal, Pressable, View, Text, Image, TextInput, Alert } from 'react-native';
import { BlurView } from '@react-native-community/blur';
// Database
import { ReadLabelsByPostId } from '../../../../DataBase/Labels/Read_PostLabel';
// Import Styles
import { Colors } from '../../../../styles/theme';
import { PopInStyles } from '../../../../styles/PopIn';
import { ViewsStyles } from '../../../../styles/Views';
import { ButtonStyles } from '../../../../styles/Button';
import { TextStyles } from '../../../../styles/Text';






interface NewProjectPopInProps {
  idPost: number;
  visible: boolean;
  reLoadLabels: boolean;
  onClose: () => void;
}



export default function PopInLabels({ idPost, visible, reLoadLabels, onClose }: NewProjectPopInProps) {
  
  // Labels
  type Label = { id: number; name: string; color: string };
  const [idLabels, modifyIdLabels] = React.useState<Label[]>([]);
  useEffect(() => {
      modifyIdLabels([]); // Réinitialiser la liste avant de lire
      ReadLabelsByPostId(idPost, (labelIds) => {
          modifyIdLabels(labelIds); // Utilise directement les IDs des labels liés au post
      });
  }, [idPost, reLoadLabels]);

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
    
        
        <View style={[PopInStyles.Background, { opacity: visible ? 1 : 0 }]} pointerEvents="box-none">
          

            {/* Pop-In ------------------------------------*/}
            <View style={[PopInStyles.NewProject]}>

                <Text style={TextStyles.TextPost}>Labels</Text>

                {idLabels.length > 0 ? (
                  idLabels.map((dot, index) => (
                      <View key={dot.id} style={{flexDirection:'row', gap:10}}>
                          <View style={{ height:20, width:20, backgroundColor:dot.color, borderRadius:10, borderWidth:1, borderColor:Colors.Button }}/>
                          <Text style={TextStyles.TextBlack}>{dot.name}</Text>
                      </View>
                  ))
                ) : (
                  <Text style={TextStyles.TextBlack}>No labels</Text>
                )}


            </View>
            

        </View>
    
    </Modal>
  );
}