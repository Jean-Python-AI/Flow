// IMPORTS =============================================================
import React from 'react';
import { View, Text, Pressable } from 'react-native';
// Import Styles
import { PostsStyles } from '../../styles/Posts';
import { TextStyles } from '../../../../../styles/Text';
import { ViewsStyles } from '../../../../../styles/Views';



// FUNCTION =============================================================
export default function Post_Text({id}: {id:number} ) {
    return (
        <View style={PostsStyles.PostText}>
            {/* Title and Date */}
            <View style={ViewsStyles.Row_space}>
                <Text style={[TextStyles.bold, TextStyles.SubTitle]}>Title</Text>
                <Text style={[TextStyles.Paragraph]}>{id}/09/25</Text>
            </View>

            {/* Content */}
            <Text style={[TextStyles.Paragraph, { marginTop: 10 }]}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                <Pressable><Text>... more</Text></Pressable>
            </Text>
        </View>
    );
}