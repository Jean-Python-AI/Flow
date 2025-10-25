import React from 'react';
import { View, Text } from 'react-native';
// Import Styles
import { TextStyles } from '../../../../styles/Text';
import { HeadersStyle } from '../../../../styles/Headers';


// FUNCTION ===============================================================
export default function HeaderInProject({title}: {title: string}) {
    return(
        <View style={HeadersStyle.basic}>
            <View>
                <Text style={TextStyles.italic_light}>Flow_</Text>
            </View>
            <Text style={TextStyles.Title}>{title}</Text>
        </View>
    );
}