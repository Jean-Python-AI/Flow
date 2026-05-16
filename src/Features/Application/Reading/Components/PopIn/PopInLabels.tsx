import React, {useEffect} from 'react';
import { Modal, Pressable, View, Text } from 'react-native';
import { BlurView } from '@react-native-community/blur';
// Database
import { useLabel } from '../../../../../DATA/Hooks/Labels/Labels';
import { Label } from '../../../../../DATA/types/Label';
// Import Styles
import { Colors } from '../../../../../styles/theme';
import { PopInStyles } from '../../../../../Components/UI/PopIn';
import { TextStyles } from '../../../../../styles/Text';






interface NewProjectPopInProps {
  idPost: number;
  visible: boolean;
  reLoadLabels: number;
  onClose: () => void;
}



export default function PopInLabels({ idPost, visible, reLoadLabels, onClose }: NewProjectPopInProps) {
  const { getLabelsByPostIDHook } = useLabel();
  const [idLabels, modifyIdLabels] = React.useState<Label[]>([]);
  useEffect(() => {
      modifyIdLabels([]); // Réinitialiser la liste avant de lire
      const fetchLabels = async () => {
        const data = await getLabelsByPostIDHook(idPost);
        modifyIdLabels(data);
      };
      fetchLabels();
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
            <View style={[PopInStyles.NewProject, {paddingBottom:30}]}>

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