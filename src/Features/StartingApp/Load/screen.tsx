// Import ====================================================
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
// Import Styles ----------------------------
import { Screens } from '../../../styles/screens';
import { TextStyles } from '../../../styles/Text';


// Function ==================================================
export default function LoadScreen() {
    return (
        <View style={{flex:1,alignItems:'center',justifyContent:'flex-end'}}>
            <View style={Screens.Load}>
                <Text style={[TextStyles.Title, {fontSize:25}]}>Flow_</Text>
                <LottieView
                    source={require('../../../../assets/Lotties/loader-height.json')}
                    autoPlay
                    loop
                    style={{width:100, height:100}}
                />
            </View>
            <Text style={TextStyles.TextPost}>loading</Text>
        </View>
    )
}