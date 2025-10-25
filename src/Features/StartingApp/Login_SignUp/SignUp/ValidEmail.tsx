// Import ====================================================
import React, {useEffect, useState} from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../../App';
import LottieView from 'lottie-react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
// Import Styles ----------------------------
import { Colors } from '../../../../styles/theme';
import { Screens } from '../../../../styles/screens';
import { TextStyles } from '../../../../styles/Text';
import { ViewsStyles } from '../../../../styles/Views';
// Import Database --------------------------
import { verifyUser } from '../../../../DataBase/User/VerifyUser';
import { createUser } from '../../../../DataBase/User/Add';
// Navigation -------------------------------
import { useNavigation } from '@react-navigation/native';


// The import definitions
type ValidEmailRouteProp = RouteProp<RootStackParamList, 'ValidEmail'>;
interface ValidEmailProps {
  route: ValidEmailRouteProp;
};


// Function ==================================================
export default function ValidEmail({ route }: ValidEmailProps) {
    // Navigation
    const navigation = useNavigation<any>();

    const {name, email, password} = route.params;

    async function setUserLoggedIn() {
        try {
            await EncryptedStorage.setItem('user_session', 'Flow_Connected');
            console.log("Utilisateur connecté enregistré");
        } catch (error) {
            console.log("Erreur lors de l'enregistrement de la session:", error);
        }
    }

    // OnPress SignUp
    const LoginClicked = async () => {
        // Logique d'inscription ici
        console.log('Sign Up with:', { email, password });
        
        if ( !email || !password) {
            console.log('Veuillez remplir tous les champs');
            return;
        }
        
        const result = await verifyUser( email, password, (error)=>null);
        
        if (result?.success) {
            // Success
            console.log('Inscription réussie!');
            setUserLoggedIn();
            console.log("L'utilisateur est maintenant connecté. L'application va automatiquement rediriger...");
        } else if (result?.error === 'rate_limit') {
            // Error
            console.log('Erreur:', result.message);
            // Afficher un message à l'utilisateur pour qu'il attende
        } else {
            console.log('Erreur lors de l\'inscription:', result?.message || 'Erreur inconnue');
        }
    };

    // Réenvoyer un email de validation
    const resendEmail = async () => {
        // Logique d'inscription ici
        console.log('Sign Up with:', { name, email, password });
        
        if (!name || !email || !password) {
            console.log('Veuillez remplir tous les champs');
            return;
        }
        
        const result = await createUser(name, email, password, (error)=>null);
        
        if (result?.success) {
            // Success
            console.log('Inscription réussie!');
            console.log("L'utilisateur est maintenant connecté. L'application va automatiquement rediriger...");
            navigation.navigate("ValidEmail", {name: name, email: email, password: password});
        } else if (result?.error === 'rate_limit') {
            // Error
            console.log('Erreur:', result.message);
            // Afficher un message à l'utilisateur pour qu'il attende
        } else {
            console.log('Erreur lors de l\'inscription:', result?.message || 'Erreur inconnue');
        }
    };

    // Automatic Login if the email was validated
    const [AutoValidating, setAutoValidating] = useState(true);
    useEffect(() => {
        const autoLogin = async () => {
            console.log("Attempting automatic login...");
            await LoginClicked();
            setAutoValidating(false);
        };
        autoLogin();
    }, []);

    return (
        <View style={{flex:1,alignItems:'center',justifyContent:'flex-end'}}>
            <Pressable
                onPress={() => navigation.goBack()}
                style={{position:'absolute', top:50, left:20, zIndex:10}}
            >
                <Image source={require('../../../../../assets/icons/Back.png')} style={{ tintColor:Colors.Text_Posts, height:30, width:30 }} />
            </Pressable>
            <View style={[Screens.Load, {width:'100%'}]}>

                {AutoValidating === true ? (
                    <LottieView
                        source={require('../../../../../assets/Lotties/loader-Instagram.json')}
                        autoPlay
                        loop
                        style={{width:80, height:80}}
                    />
                ) : (
                    <>
                        <Text style={[TextStyles.Title, {fontSize:25}]}>Look your Email</Text>

                        <View style={[ViewsStyles.SignUp_Container, {padding:20, marginBottom:5, gap:10}]}>
                            <Text>Valid your Email.</Text>
                            <Text>We envoyez un mail de confirmation à l'adress {}</Text>
                            <Text>Cliqué sur le bouton uniquement après avoir validé votre email</Text>

                            <Pressable
                                style={({pressed}) => ({backgroundColor:Colors.Button, padding:12,borderRadius:10,marginTop:20,alignItems:'center', opacity: pressed ? 0.3 : 1})}
                                onPress={() => LoginClicked()}
                            >
                                <Text style={TextStyles.TextBlack}>Email validated</Text>
                            </Pressable>
                        </View>
                    </>
                )}

                
            </View>
        </View>
    )
}