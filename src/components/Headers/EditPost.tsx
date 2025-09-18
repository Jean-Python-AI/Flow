import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
// Navigation
import { useNavigation } from '@react-navigation/native';
// Import Styles
import { Colors } from '../../styles/theme';
import { ViewsStyles } from '../../styles/Views';
import { TextStyles } from '../../styles/Text';


export default function HeaderInProject({title}: {title: string}) {
    const navigation = useNavigation<any>();
    return(
        <View style={ViewsStyles.HeaderEditPost}>

            {/* Go Back */}
            <Pressable
                onPress={() => {navigation.goBack();}}
                style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                })}
            >
                <Image source={require('../../../assets/icons/Back.png')} style={{width:30, height:30, tintColor:Colors.Text_Secondary, marginRight:25}}/>
            </Pressable>

            {/* Date of Creation */}
            <Text style={[TextStyles.subText, TextStyles.medium]}>10/09/25</Text>


            {/* Paramettres */}
            <View>
                <Image source={require('../../../assets/icons/dots.png')} style={{width:25, height:25, tintColor:Colors.Text_Secondary, marginLeft:25}}/>
            </View>
        </View>
    );
}