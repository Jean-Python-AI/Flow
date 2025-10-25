// Import ====================================================
import React, {useState} from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
// Import Styles ----------------------------
import { Colors } from '../../../styles/theme';
import { Screens } from '../../../styles/screens';
import { TextStyles } from '../../../styles/Text';
import { ViewsStyles } from '../../../styles/Views';
// Import Database --------------------------
import { verifyUser } from '../../../DataBase/User/VerifyUser';



interface LoginProps {
    onClick: () => void;
    onError: (error:string) => void;
}

// Function ==================================================
export default function Login({ onClick, onError } : LoginProps) {
    const navigation = useNavigation<any>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Function to enregistred user is connected
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
            onError('Fill in all fields');
            return;
        }
        
        const result = await verifyUser( email, password, (error)=>{onError(error)});
        
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

    // Visibilité du mot de passe
    const [passwordVisible, setPasswordVisible] = useState(true);

    return (
        <View style={[ViewsStyles.SignUp_Container, {padding:20, marginBottom:20, gap:10}]}>

            <TextInput
                placeholder='Email'
                style={TextStyles.TextInputLogin}
                cursorColor={Colors.ItemSecondary}
                selectionColor={Colors.Button}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <View style={[ViewsStyles.Row_space,TextStyles.TextInputLogin]}>
                <TextInput
                    placeholder='Password'
                    style={{width:'85%'}}
                    cursorColor={Colors.ItemSecondary}
                    selectionColor={Colors.Button}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={passwordVisible}
                />
                <Pressable
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    style={({ pressed }) => ({backgroundColor: pressed ? Colors.Background_Elements : Colors.Background_Primary, padding:3, paddingHorizontal:5, borderRadius:10})}
                >
                    <Text style={{color:Colors.ItemSecondary}}>{passwordVisible ? 'Show' : 'Hide'}</Text>
                </Pressable>
            </View>

            <Pressable
                style={({pressed}) => ({backgroundColor:pressed ? Colors.Background_Elements : 'transparent', padding:5,borderRadius:10,alignItems:'center'})}
                onPress={() => null}
            >
                <Text style={[TextStyles.TextPost, {fontSize:14, color:Colors.ItemSecondary}]}>Not remember my password</Text>
            </Pressable>
            


            <Pressable
                style={({pressed}) => ({backgroundColor:Colors.Button, padding:12,borderRadius:10,marginTop:35,alignItems:'center', opacity: pressed ? 0.3 : 1})}
                onPress={() => {LoginClicked(); onClick();}}
            >
                <Text style={TextStyles.TextBlack}>Sign Up</Text>
            </Pressable>
        </View>
    )
}