import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated as RNAnimated } from 'react-native';
import BottomSheet from '../../../../../Components/BottomSheet';
import { ScrollView } from 'react-native-gesture-handler';
// Styles -----------------------------------------------
import { ViewsStyles } from '../../../../../styles/Views';
import { TextStyles } from '../../../../../styles/Text';
import { Colors } from '../../../../../styles/theme';
// Data Base --------------------------------------------
import { logOutUser } from '../../../../../DATA/Services/Connection/Connect';
// Refresh User Connection
import { useUserConnection } from '../../../../../../App';
// Component --------------------------------------------
import LogOut from '../../../../../../assets/icons/LogOut.svg';


interface LogOutPopInProps {
  visible: boolean;
  onClose: () => void;
}

export default function LogOutPopIn({ visible, onClose }: LogOutPopInProps) {
    const { refreshUserConnection } = useUserConnection();
  
  return (
    <BottomSheet 
      visible={visible} 
      EntireScreenSpace={false} 
      HEIGHT={250} 
      onClose={async () => {
        onClose();
      }}
    >
      {/* Header ---------------------------------*/}
      <View style={[ViewsStyles.Row_space, {width:'90%'}]}>
        {/* Title */}
        <Text style={[TextStyles.TextPost, TextStyles.TextPost]}>Logout</Text>
      </View>

      {/* List of the Labels */}
      <View style={{width:'90%', marginVertical:30, gap:20, alignItems:'center', justifyContent:'center'}}>
        <Pressable
            style={({pressed})=>({backgroundColor:pressed?Colors.Red_transparent:undefined, width:'100%', padding:10, borderRadius:12, borderWidth:2, borderColor:Colors.Red_transparent, alignItems:'center', justifyContent:'space-between', flexDirection:'row'})}
            onPress={async()=>{ 
                console.log('Log out button pressed');
                await logOutUser();            // Supprime la session dans le stockage
                await refreshUserConnection(); // Met à jour userConnected dans App.tsx
            }}
        >
            <Text style={[TextStyles.TextBlack, {color:Colors.Red}]}>Logout</Text>
            <LogOut width={23} height={23} color={Colors.Red}/>
        </Pressable>
        <Pressable
            style={({pressed})=>({backgroundColor:pressed?Colors.Button:Colors.Background_Elements, width:'100%', padding:10, borderRadius:12, borderWidth:2, borderColor:Colors.Button, alignItems:'center', justifyContent:'space-between', flexDirection:'row'})}
            onPress={onClose}
        >
            <Text style={TextStyles.TextBlack}>Cancel</Text>
        </Pressable>
      </View>
      
    </BottomSheet>
  );
};
