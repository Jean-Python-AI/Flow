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
export default function HeaderPostRead({date, id, title} : {date:number, id:number, title:string}) {
    // Navigation
    const navigation = useNavigation<any>();
    
    // Formater la date pour l'affichage (timestamp)
    const formatDate = (timestamp: number) => {
        if (!timestamp || timestamp === 0) return 'Date inconnue';
        try {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) return 'Date inconnue';
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            });
        } catch (error) {
            console.log('Error formatting date:', error);
            return 'Date inconnue';
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
                <Image source={require('../../../../../assets/icons/Back.png')} style={{width:30, height:30, tintColor:Colors.ItemSecondary, marginRight:25}}/>
            </Pressable>

            {/* Date of Creation */}
            <Text style={TextStyles.subText}>{formatDate(date)}</Text>


            {/* Paramettres */}
            <Pressable
                onPress={() => {navigation.navigate("EditPost", { id, title });}}
                style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                })}
            >
                <Image source={require('../../../../../assets/icons/Pen.png')} style={{width:25, height:25, tintColor:Colors.ItemSecondary, marginLeft:25}}/>
            </Pressable>
        </View>
    );
}