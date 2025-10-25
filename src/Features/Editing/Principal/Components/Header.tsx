// IMPORTS ==============================================
import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
// Import Styles -------------------------------
import { Colors } from '../../../../styles/theme';
import { ViewsStyles } from '../../../../styles/Views';
import { TextStyles } from '../../../../styles/Text';
import { HeadersStyle } from '../../../../styles/Headers';
// Import Components ---------------------------
import PopInParamettre from './PopIn/PopInParamettre';
import PopInWorkSpace from './PopIn/WorkSpaces';


interface HeaderProps {
    modify: ()=> void;
};

// FUNCTION =============================================
export default function HeaderProjects({ modify }: HeaderProps) {
    const [showParametres, setShowParametres] = useState(false);
    const [modifyWorkSpace, setModifyWorkSpace] = useState(false)

    const [nameWorkSpaceActivate, setNameWorkSpaceActivate] = useState('No MindSpace')

    return(
        <>
            <View style={HeadersStyle.basic}>

                <View>
                    <Text style={TextStyles.italic_light}>Flow_</Text>
                </View>

                <View style={ViewsStyles.Row_space}>
                    {/* Title of the Workspace -------------------*/}
                    <Pressable
                        onPress={() => setModifyWorkSpace(true)}
                        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, maxWidth: '80%', flexDirection:'row', alignItems:'center', gap:5}]}
                    >
                        <Text style={TextStyles.Title}>{nameWorkSpaceActivate}</Text>
                        <Image source={require('../../../../../assets/icons/Expand.png')} style={{width:20, height:20, tintColor:Colors.ItemSecondary}}/>
                    </Pressable>

                    {/* Paramètres -------------------------------*/}
                    <Pressable 
                        onPress={() => setShowParametres(true)} 
                        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                    >
                        <Image source={require('../../../../../assets/icons/parametter.png')} style={{width:24, height:24, tintColor:Colors.ItemSecondary}}/>
                    </Pressable>
                </View>
            </View>

            {/* Popin Paramètres */}
            <PopInParamettre 
                visible={showParametres} 
                onClose={() => setShowParametres(false)} 
            />
            <PopInWorkSpace
                visible={modifyWorkSpace}
                onClose={() => setModifyWorkSpace(false)}
                nameWorkSpaceActivate={(name)=> {setNameWorkSpaceActivate(name); modify();}}
            />
        </>
    );
}