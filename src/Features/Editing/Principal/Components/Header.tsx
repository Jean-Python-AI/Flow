// IMPORTS ==============================================
import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
// Import Styles -------------------------------
import { Colors } from '../../../../styles/theme';
import { ViewsStyles } from '../../../../styles/Views';
import { TextStyles } from '../../../../styles/Text';
import { HeadersStyle } from '../../../../styles/Headers';
// Import Components ---------------------------



// FUNCTION =============================================
export default function HeaderProjects() {
    return(
        <View style={HeadersStyle.basic}>

            <View>
                <Text style={[TextStyles.italic_light, TextStyles.subText]}>Flow_</Text>
            </View>

            <View style={ViewsStyles.Row_space}>
                {/* Title of the Workspace -------------------*/}
                <Text style={[TextStyles.bold, TextStyles.Title, TextStyles.normal]}>WorkSpace</Text>

                {/* Paramètres -------------------------------*/}
                <Pressable onPress={() => {console.log("Paramètres")}} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
                    <Image source={require('../../../../../assets/icons/parametter.png')} style={{width:24, height:24, tintColor:Colors.Text_Secondary}}/>
                </Pressable>
            </View>
        </View>
    );
}