import React, {useState} from 'react';
import { Modal, Pressable, View, Text, Image, TextInput, Alert } from 'react-native';
import { BlurView } from '@react-native-community/blur';
// Database
import { NewWorkSpace } from '../../../../../DataBase/WorkSpace/NewWorkSpace';
// Import Styles
import { Colors } from '../../../../../styles/theme';
import { PopInStyles } from '../../../../../styles/PopIn';
import { ViewsStyles } from '../../../../../styles/Views';
import { ButtonStyles } from '../../../../../styles/Button';
import { TextStyles } from '../../../../../styles/Text';






interface NewWorkSpacePopInProps {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
}



export default function NewWorkSpacePopIn({ visible, onClose, onCreated }: NewWorkSpacePopInProps) {

  // Stocke le nom du projet
  const [WorkSpaceName, setWorkSpaceName] = useState('');

  const handleCreate = () => {
    console.log("Callback appelé !");
    const name = WorkSpaceName.trim();
    if (!name) {
      Alert.alert('Nom requis', 'Entrez un nom de projet.');
      return;
    }

    NewWorkSpace(name, () => { setWorkSpaceName(''); onCreated(); onClose();})
  };

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

        {/* Pop-In */}
        <View style={PopInStyles.NewProject}>

          <Text style={TextStyles.subText}>New WorkSpace</Text>
          
          {/* Modify here the new project options */}
          <View style={{flexDirection:'row', gap:10}}>

              { false ? (
              <Pressable
                onPress={() => {}}
                style={({ pressed }) => [
                    {
                    opacity: pressed ? 0.5 : 1,
                    },
                ]}
                >
                  <View style={{width:44, height:44, padding:8, backgroundColor:Colors.Button, borderRadius:10, justifyContent:'center', alignItems:'center'}}>
                      <Image source={require('../../../../../../assets/icons/Pen.png')} style={{width:'100%', height:'100%'}} />
                  </View>
              </Pressable>
              ) : null}

              <TextInput style={[TextStyles.TextInput, TextStyles.TextBlack, {width:'100%'}]} value={WorkSpaceName} onChangeText={setWorkSpaceName}/>

          </View>

          <Pressable onPress={handleCreate} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, width:'100%', justifyContent:'center' }]}>
            <View style={ButtonStyles.Base_maxWidth}>
                <Text style={TextStyles.TextBlack}>Create</Text>
            </View>
          </Pressable>

        </View>

      </View>
    </Modal>
  );
}