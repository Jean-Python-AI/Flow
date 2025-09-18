import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
// Import Styles
import { HeadersStyle } from '../../styles/Headers';
import { Colors } from '../../styles/theme';
// Import Components
import EditPostBarr_Button from '../EditPostBarr_buttons';


function EditPostsBarr() {

    return(
        <View style={HeadersStyle.editPostBarr}>
            {/* Labels */}
            <EditPostBarr_Button onPress={() => {}}>
                <Image source={require('../../../assets/icons/labels.png')} style={{width:28, height:28, marginLeft:-5, marginRight:-5}}/>
                <Text>Labels</Text>
            </EditPostBarr_Button>

            {/* Style */}
            <EditPostBarr_Button onPress={() => {}}>
                <Image source={require('../../../assets/icons/Style.png')} style={{width:25, height:25, tintColor:Colors.text, marginLeft:-5}}/>
                <Text>Style</Text>
            </EditPostBarr_Button>

            {/* Image */}
            <EditPostBarr_Button onPress={() => {}}>
                <Image source={require('../../../assets/icons/Galery.png')} style={{width:22, height:22, tintColor:Colors.text, marginLeft:-3}}/>
                <Text>Galery</Text>
            </EditPostBarr_Button>
        </View>
    )
}

export default EditPostsBarr;