import React from 'react';
import { View, Text, Pressable } from 'react-native';
// Styles ---------------------------------------------------------
import { Colors } from '../../../../styles/theme';
import { TextStyles } from '../../../../styles/Text';
import { PopInStyles } from '../../../../Components/UI/PopIn';



interface ExtractTextProps {
    visible: boolean;
    onClick: () => void;
}

export default function ExtractText({ visible, onClick }: ExtractTextProps) {

    if (!visible) return null;

    return (
        <View style={{width:'100%', alignItems:'center', justifyContent:'center', paddingBottom:25, paddingHorizontal:10}}>

            <Pressable
                style={({pressed})=>([PopInStyles.ExtractTextContainer, {backgroundColor: Colors.Background_Elements, borderWidth:2, borderColor: Colors.Button}])}
                onPress={onClick}
            >
                <Text style={TextStyles.TextPost}>Take a post from social media</Text>
            </Pressable>

        </View>
    );
}