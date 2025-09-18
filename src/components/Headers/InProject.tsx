import React from 'react';
import { View, Text } from 'react-native';
// Import Styles
import { Colors } from '../../styles/theme';
import { ViewsStyles } from '../../styles/Views';
import { TextStyles } from '../../styles/Text';
// Import Components
import Header from './GlobalHeader';


export default function HeaderInProject({title}: {title: string}) {
    return(
        <Header>
            <View>
                <Text style={[TextStyles.italic_light, TextStyles.subText]}>Flow</Text>
            </View>
            <Text style={[TextStyles.bold, TextStyles.Title, TextStyles.normal]}>{title}</Text>
        </Header>
    );
}