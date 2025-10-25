// Import ====================================================
import React, {useState} from 'react';
import { View, Text, Pressable, Image, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
// Import Styles ----------------------------
import { Colors } from '../../../styles/theme';
import { Screens } from '../../../styles/screens';
import { TextStyles } from '../../../styles/Text';
import { ViewsStyles } from '../../../styles/Views';
// Import Database --------------------------
import { createUser } from '../../../DataBase/User/Add';
import { ButtonStyles } from '../../../styles/Button';


const screenWidth = Dimensions.get('window').width;

// Function ==================================================
export default function SignUp() {
    const navigation = useNavigation<any>();

    // Get image size
    const source1 = require('../../../../assets/img/Post1.jpg');
    const { width: img1Width, height: img1Height } = Image.resolveAssetSource(source1);
    // On calcule une hauteur proportionnelle
    const display1Width = screenWidth; // largeur 90% de l'écran
    const display1Height = (img1Height / img1Width) * display1Width;

    // Get image size
    const source2 = require('../../../../assets/icons/Back.png');
    const { width: img2Width, height: img2Height } = Image.resolveAssetSource(source2);
    // On calcule une hauteur proportionnelle
    const display2Width = 40;
    const display2Height = (img2Height / img2Width) * display2Width;

    return (
        <View style={{flex:1, justifyContent:'flex-end', alignItems:'center', backgroundColor:Colors.text, paddingTop:25}}>
            <ImageBackground
                source={source1}
                blurRadius={5} // <-- flou ici
                style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                width: '100%',
                height: display1Height,
                }}
            />
            {/*<Image source={require('../../../../assets/img/Post1.jpg')} style={{width:displayWidth, height:displayHeight, borderRadius:20}}/>*/}

            
            <View style={{width:'100%', alignItems:'center', alignSelf:'center', backgroundColor:Colors.Background_Elements, padding:20, borderTopLeftRadius:20, borderTopRightRadius:20, gap:20, height:'30%', justifyContent:'space-between'}}>
                
                <Text style={TextStyles.italic_light}>Flow_</Text>

                <Text style={[TextStyles.TextBlack, {textAlign:'center', fontSize:25, fontWeight:'700'}]}>Pas pour te remplir de bruit, pour t'amener de la clarté.</Text>

                <Pressable
                    onPress={() => navigation.navigate('Onboarding')}
                    style={({pressed}) => ([ButtonStyles.Base_maxWidth, {borderRadius:15, padding:3, opacity: pressed ? 0.3 : 1}])}
                >
                    <Image
                        source={require('../../../../assets/icons/Back.png')}
                        style={{
                            height: display2Height,
                            width: display2Width,
                            transform: [{ rotate: '180deg' }],
                            margin:-5
                        }}
                    />
                </Pressable>
            </View>
        </View>
    )
}