// IMPORTS ==============================================================
import React from 'react';
import { View, Text } from 'react-native';
// Import Styles ----------------------------------------
import { Screens } from '../../../styles/screens';
// Import Compoenents -----------------------------------
import CategoryView from './Components/Top/CathegoryView';
import { ScrollView } from 'react-native-gesture-handler';
import Post_Text from './Components/Posts/Post_Text';




// FUNCTION =============================================================
function PostScroll() {
    
    // For filtring posts
    const [labelActivate, setLabelActivate] = React.useState<number>(-1);

    return (
        <View style={Screens.basic}>
            <View style={{height:20}}/>
            <CategoryView categoryActivate_info={labelActivate} onCategoryPress={(id: number) => setLabelActivate(id)} />
            
            <ScrollView>
                
                {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map(i => (
                    <Post_Text key={i} id={i}/>
                ))}
                
            </ScrollView>
        </View>
    );
}

export default PostScroll;