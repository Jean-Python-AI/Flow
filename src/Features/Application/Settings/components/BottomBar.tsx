import React from 'react';
import { View, Pressable } from 'react-native';
// Navigation -------------------------------------------
import { useNavigation } from '@react-navigation/native';
// Import Icon ------------------------------------------
import Back from '../../../../../assets/icons/Back.svg';
// Import Style
import { ViewsStyles } from '../../../../styles/Views';
import { ButtonStyles } from '../../../../Components/UI/Button';
import { Colors } from '../../../../styles/theme';




// FUNCTION ================================================================
export default function BottomBar() {
  const navigation = useNavigation<any>();

  return (
    <View style={[ViewsStyles.BottomBar, {justifyContent:'center'}]}>
        {/* SETTINGS */}
        <Pressable
            onPress={()=>{
                navigation.goBack();
            }}
            style={({pressed})=>([ButtonStyles.Settings, {borderWidth:2, borderColor: pressed?Colors.Button: Colors.Background_Elements, width:'30%'}])}
        >
            <Back width={30} height={30} color={Colors.Text_Posts} style={{transform: [{ rotate: '180deg' }]}}/>
        </Pressable>
    </View>
  );
}