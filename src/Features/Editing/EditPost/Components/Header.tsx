// IMPORTS ====================================================================
import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
// Navigation ------------------------------------------------------------
import { useNavigation } from '@react-navigation/native';
// Import Styles ---------------------------------------------------------
import { Colors } from '../../../../styles/theme';
import { ViewsStyles } from '../../../../styles/Views';
import { TextStyles } from '../../../../styles/Text';
// Import Component ------------------------------------------------------
import CancelPopIn from './PopIn/CancelModificationPopIn';


// FUNCTION ====================================================================
export default function HeaderEdit({date, onCancelModify} : {date:number, onCancelModify:()=>void}) {
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

    // PopIn visible ?
    const [PopInCancelVisible, setPopInCancelVisible] = useState(false);

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
                <Image source={require('../../../../../assets/icons/Back.png')} style={{width:30, height:30, tintColor:Colors.ItemSecondary}}/>
            </Pressable>

            {/* Date of Creation */}
            <Text style={TextStyles.subText}>{formatDate(date)}</Text>


            {/* Paramettres */}
            <Pressable
                onPress={() => {setPopInCancelVisible(true)}}
                style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                })}
            >
                <Image source={require('../../../../../assets/icons/Cancel.png')} style={{width:27, height:27, tintColor:Colors.ItemSecondary}}/>
            </Pressable>

            {/* PopIn Cancel the modifiaction ?*/}
            <CancelPopIn visible={PopInCancelVisible} onClose={() => setPopInCancelVisible(false)} CancelModif={()=>{onCancelModify();}}/>
        </View>
    );
}