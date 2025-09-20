// IMPORTS ====================================================================
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
// Import Styles -----------------------------------------------------------
import { HeadersStyle } from '../../../../styles/Headers';
import { Colors } from '../../../../styles/theme';
import { ButtonStyles } from '../../../../styles/Button';
// Import Components -------------------------------------------------------
import EditPostBarr_Button from './EditPostBarr_buttons';



// FUNCTION ====================================================================
interface EditPostsBarrProps {
    onOpenLabels: () => void;
}

function EditPostsBarr({ onOpenLabels }: EditPostsBarrProps) {

    // RETURN THE COMPONENT ------------------------------------------------------
    return(
        <View style={HeadersStyle.editPostBarr}>
            {/* Labels ----------------------------------------------------------*/}
            <Pressable 
                onPress={onOpenLabels} 
                style={({pressed})=>([ButtonStyles.editPostBarr_Button, {backgroundColor: pressed ? Colors.Text_Secondary : Colors.Button,}])}
            >
                <Image source={require('../../../../../assets/icons/labels.png')} style={{width:28, height:28, marginLeft:-5, marginRight:-5}}/>
                <Text>Labels</Text>
            </Pressable>

            {/* Style ------------------------------------------------------------*/}
            <Pressable 
                onPress={() => {()=>{}}} 
                style={({pressed})=>([ButtonStyles.editPostBarr_Button, {backgroundColor: pressed ? Colors.Text_Secondary : Colors.Button,}])}
            >
                <Image source={require('../../../../../assets/icons/Style.png')} style={{width:25, height:25, tintColor:Colors.text, marginLeft:-5}}/>
                <Text>Style</Text>
            </Pressable>

            {/* Image ------------------------------------------------------------*/}
            <Pressable 
                onPress={() => {()=>{}}} 
                style={({pressed})=>([ButtonStyles.editPostBarr_Button, {backgroundColor: pressed ? Colors.Text_Secondary : Colors.Button,}])}
            >
                <Image source={require('../../../../../assets/icons/Galery.png')} style={{width:22, height:22, tintColor:Colors.text, marginLeft:-3}}/>
                <Text>Galery</Text>
            </Pressable>

        </View>
    )
}

export default EditPostsBarr;