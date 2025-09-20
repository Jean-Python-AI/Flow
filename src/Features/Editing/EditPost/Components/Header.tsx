// IMPORTS ====================================================================
import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
// Navigation ------------------------------------------------------------
import { useNavigation } from '@react-navigation/native';
// Import Styles ---------------------------------------------------------
import { Colors } from '../../../../styles/theme';
import { ViewsStyles } from '../../../../styles/Views';
import { TextStyles } from '../../../../styles/Text';


// FUNCTION ====================================================================
export default function HeaderEdit({date} : {date:string}) {
    // Navigation
    const navigation = useNavigation<any>();
    
    // Formater la date pour l'affichage
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Date inconnue';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            });
        } catch (error) {
            console.log('Error formatting date:', error);
            return dateString; // Retourner la date brute si le formatage échoue
        }
    };

    // RETURN THE COMPONENT ------------------------------------------------------
    return(
        <View style={ViewsStyles.HeaderEditPost}>

            {/* Go Back */}
            <Pressable
                onPress={() => {navigation.goBack();}}
                style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                })}
            >
                <Image source={require('../../../../../assets/icons/Back.png')} style={{width:30, height:30, tintColor:Colors.Text_Secondary, marginRight:25}}/>
            </Pressable>

            {/* Date of Creation */}
            <Text style={[TextStyles.subText, TextStyles.medium]}>{formatDate(date)}</Text>


            {/* Paramettres */}
            <View>
                <Image source={require('../../../../../assets/icons/dots.png')} style={{width:25, height:25, tintColor:Colors.Text_Secondary, marginLeft:25}}/>
            </View>
        </View>
    );
}