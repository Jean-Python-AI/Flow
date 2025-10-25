// IMPORTS =============================================================
import React, {useState, useEffect} from 'react';
import { View, Text, Pressable, ImageBackground, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Pour le dégradé
// Import Styles ------------------------------------------
import { PostsStyles } from '../../../../../styles/Posts';
import { TextStyles } from '../../../../../styles/Text';
import { ViewsStyles } from '../../../../../styles/Views';
import { Colors } from '../../../../../styles/theme';
// Import Style -------------------------------------------
import LabelBubble from './LabelsBuble';




// FUNCTION =============================================================
export default function Post_ImageText({id}: {id:number} ) {
    // Size auto of the image
    const source = "../../../../../../assets/img/Post1.jpg";
    const { width, height } = Image.resolveAssetSource(require(source));

    return (
        <View style={PostsStyles.Post_ImageText}>
            <ImageBackground
                source={require(source)}
                style={{ width: "100%", aspectRatio: width/height, borderRadius: 20, overflow: "hidden", justifyContent:'flex-end' }}
            >
                <LinearGradient
                    colors={['rgba(0, 0, 0, 1)', 'transparent']} // du bas (noir semi-transparent) vers le haut (transparent)
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0.6 }}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        top: 0,
                    }}
                />

                {/* Container ------------------------------*/}
                <View style={{margin:10, backgroundColor:Colors.Background_Primary, borderRadius:15, padding:20}}>
                    {/* Title and Date */}
                    <View style={ViewsStyles.Row_space}>
                        <View style={{flexDirection:'row', gap:10, alignItems:'center'}}>
                            <LabelBubble visible={true} idPost={id} reload={id}/>
                            <Text style={TextStyles.TitlePost}>Title</Text>
                        </View>
                        <Text style={[TextStyles.TextPost, {fontSize:14}]}>{id}/09/25</Text>
                    </View>

                    {/* Content */}
                    <Text style={[TextStyles.TextPost, { marginTop: 10 }]}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                        <Pressable style={{height:17}}>
                            <Text style={TextStyles.MoreButton}>... more</Text>
                        </Pressable>
                    </Text>
                </View>
            </ImageBackground>
        </View>
    );
}