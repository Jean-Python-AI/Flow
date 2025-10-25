import React from 'react';
import { View, Pressable, Image } from 'react-native';
// Navigation
import { useNavigation } from '@react-navigation/native';
// Import Components
// Import Styles
import { Colors } from '../../../../styles/theme';
import { navBarStyle } from '../../../../styles/NavBars';


export default function NavBarBack() {
    const navigation = useNavigation<any>();
    return (
        <View style={navBarStyle.basic}>
            <Pressable
                onPress={() => {navigation.goBack();}}
                style={({ pressed }) => [
                    {paddingHorizontal:20, borderRadius:10},
                    pressed && { opacity: 1, backgroundColor: Colors.Background_Elements },
                ]}
            >
                <Image source={require('../../../../../assets/icons/Back.png')} style={{width:35,height:35,tintColor:Colors.ItemSecondary}} />
            </Pressable>
        </View>
    );
}