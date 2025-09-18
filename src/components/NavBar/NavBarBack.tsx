import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
// Navigation
import { useNavigation } from '@react-navigation/native';
// Import Components
import NavBar from './GlobalNavBar';
// Import Styles
import { Colors } from '../../styles/theme';


export default function NavBarBack() {
    const navigation = useNavigation<any>();
    return (
        <NavBar>
            <Pressable
                onPress={() => {navigation.goBack();}}
                style={({ pressed }) => [
                    {paddingHorizontal:20, borderRadius:10},
                    pressed && { opacity: 1, backgroundColor: Colors.Background_Secondary },
                ]}
            >
                <Image source={require('../../../assets/icons/Back.png')} style={{width:35,height:35,tintColor:Colors.Text_Secondary}} />
            </Pressable>
        </NavBar>
    );
}