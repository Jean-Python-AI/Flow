// Import ====================================================
import React, { useState } from 'react';
import { View, Text, Pressable, Image, Dimensions, StatusBar, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { setStatusBarColorNative } from '../../utils/StatusBarNative';
import { useUserConnection } from '../../../App';
// Import Styles ----------------------------
import { Colors } from '../../styles/theme';
import { TextStyles } from '../../styles/Text';
// Import Database --------------------------
import { ButtonStyles } from '../../Components/UI/Button';
import { signInWithGoogle } from '../../DATA/Services/Connection/GoogleOAuth';
import { logInUser } from '../../DATA/Services/Connection/Connect';
// components -------------------------------
import GoogleIcon from '../../../assets/icons/Google.svg';


const screenWidth = Dimensions.get('window').width;

// Function ==================================================
export default function FisrtOpenScreen() {
    const navigation = useNavigation<any>();
    // Get image size
    const source1 = require('../../../assets/img/Post1.jpg');
    const { width: img1Width, height: img1Height } = Image.resolveAssetSource(source1);
    // On calcule une hauteur proportionnelle
    const display1Width = screenWidth; // largeur 90% de l'écran
    const display1Height = (img1Height / img1Width) * display1Width;

    // For the Google Connection
    const [loading, setLoading] = useState(false);
    const { refreshUserConnection } = useUserConnection();

    useFocusEffect(
        React.useCallback(() => {
            // Configuration de la StatusBar pour cet écran
                if (Platform.OS === 'android') {
                // Utiliser le module natif pour forcer le changement de couleur (comme SystemNavigationBar pour la barre du bas)
                StatusBar.setTranslucent(false);
                StatusBar.setBarStyle('light-content', true);
                // Utiliser le module natif qui fonctionne de la même manière que SystemNavigationBar
                setStatusBarColorNative('black');
                    
                // Cleanup: restaurer la StatusBar par défaut quand on quitte l'écran
                return () => {
                    StatusBar.setTranslucent(false);
                    StatusBar.setBarStyle('dark-content', true);
                    setStatusBarColorNative(Colors.Background_Primary);
                };
            } else {
                StatusBar.setBarStyle('dark-content', true);
                return () => {
                    StatusBar.setBarStyle('dark-content', true);
                };
            }
        }, [])
    );

    return (
        <View style={{flex:1, justifyContent:'flex-start', alignItems:'center', backgroundColor:'black', paddingTop:20}}>
            <Image
                source={source1}
                blurRadius={0} // <-- flou ici
                style={{
                    width: display1Width,
                    height: display1Height,
                }}
            />

            
            <View style={{width:'100%', flex:1, alignItems:'center', alignSelf:'center', paddingHorizontal:20, borderTopLeftRadius:20, borderTopRightRadius:20, justifyContent:'space-between', backgroundColor: Colors.Background_Primary}}>

                <View style={{alignItems:'center', flex:1, justifyContent:'center'}}>
                    <Text style={[TextStyles.Title, {textAlign:'center', fontSize:30 }]}>Less noise.{'\n'}More thinking.</Text>
                </View>

                <View style={{width:'100%', flexDirection:'column', alignItems:'center', paddingBottom:30, gap:5}}>
                    {/* Google Connection */}
                    <Pressable
                        onPress={async ()=> {
                        try {
                            setLoading(true);
                            await signInWithGoogle();     // Met à jour le stockage local (user_session)
                            await refreshUserConnection(); // Lit user_session et met à jour userConnected dans App.tsx
                        } finally {
                            setLoading(false);
                        }
                        }}
                        style={({pressed})=>([ButtonStyles.connectionWithGoogle, {backgroundColor: pressed?Colors.Button:Colors.Background_Elements}])}
                    >
                        {loading ? (
                            <Text style={[TextStyles.TextPost, {color:Colors.ItemSecondary}]}>Loading...</Text>
                        ) : (
                            <>
                                <GoogleIcon width={24} height={24} color={Colors.ItemSecondary}/>
                                <Text style={[TextStyles.TextPost, {fontSize:20}]}>Google</Text>
                            </>
                        )}
                    </Pressable>

                    {/* Passer la connection au cas ou le backend est indisponible, Uniquement pour le dévloppement */}
                    <Pressable
                        onPress={() => {logInUser(); console.log('Tentative de connection')}}
                        style={({pressed})=>({})}
                    >
                        <Text style={[TextStyles.TextPost]}>Passer</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}