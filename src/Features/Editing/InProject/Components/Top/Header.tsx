import React from 'react';
import { View, Text } from 'react-native';
// Import Styles
import { Colors } from '../../../../../styles/theme';
import { ViewsStyles } from '../../../../../styles/Views';
import { TextStyles } from '../../../../../styles/Text';
import { HeadersStyle } from '../../../../../styles/Headers';


// FUNCTION ===============================================================
export default function HeaderInProject({title}: {title: string}) {
    return(
        <View style={HeadersStyle.basic}>
            <View>
                <Text style={[TextStyles.italic_light, TextStyles.subText]}>Flow</Text>
            </View>
            <Text style={[TextStyles.bold, TextStyles.Title, TextStyles.normal]}>{title}</Text>
        </View>
    );
}