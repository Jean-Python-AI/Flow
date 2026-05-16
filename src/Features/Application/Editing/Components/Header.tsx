// IMPORTS ====================================================================
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
// Import Styles ---------------------------------------------------------
import { Colors } from '../../../../styles/theme';
import { ViewsStyles } from '../../../../styles/Views';
import { TextStyles } from '../../../../styles/Text';
// Import Component ------------------------------------------------------
import CancelPopIn from './PopIn/CancelModificationPopIn';
import Back from '../../../../../assets/icons/Back.svg';
import Cancel from '../../../../../assets/icons/Cancel.svg';
import TimeCapsul from '../../../../../assets/icons/TimeCapsul.svg';


// FUNCTION ====================================================================
export default function HeaderEdit({date, onCancelModify, back} : {date:string, onCancelModify:()=>void, back:()=> void}) {

    // PopIn visible ?
    const [PopInCancelVisible, setPopInCancelVisible] = useState(false);

    // RETURN THE COMPONENT ------------------------------------------------------
    return(
        <View style={ViewsStyles.HeaderEditPost}>

            {/* Go Back */}
            <Pressable
                onPress={ ()=>{back();} }
                style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                })}
            >
                <Back width={30} height={30} color={Colors.ItemSecondary}/>
            </Pressable>

            {/* Date of Creation */}
            <Text style={[TextStyles.TextPost, {color:Colors.ItemSecondary}]}>{date || 'Unknow Date'}</Text>


            {/* Buttons */}
            <View style={{flexDirection:'row', gap:15, alignItems:'center'}}>
                {/* Time capsule */}
                { false ? (
                    <Pressable
                        style={({pressed})=>({width:30, height:30, backgroundColor:pressed?Colors.Button:undefined, borderRadius:12, justifyContent:'center', alignItems:'center'})}
                    >
                        <TimeCapsul width={'92%'} height={'92%'} color={Colors.ItemSecondary}/>
                    </Pressable>
                ): null}
                {/* Cancel modifications */}
                <Pressable
                    onPress={() => {setPopInCancelVisible(true)}}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.5 : 1,
                    })}
                >
                    <Cancel width={27} height={27} color={Colors.ItemSecondary}/>
                </Pressable>
            </View>

            {/* PopIn Cancel the modifiaction ?*/}
            <CancelPopIn visible={PopInCancelVisible} onClose={() => setPopInCancelVisible(false)} CancelModif={()=>{onCancelModify();}}/>
        </View>
    );
}