// Import ====================================================
import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Import Styles ----------------------------
import { Colors } from '../../../styles/theme';
import { Screens } from '../../../styles/screens';
import { TextStyles } from '../../../styles/Text';
import { ViewsStyles } from '../../../styles/Views';
// Import Database --------------------------
import { createUser } from '../../../DataBase/User/Add';
// Element
import SignUp from './SignUp/SignUp';
import Login from './Login';



// Function ==================================================
export default function SignUpLogin() {
    
    const [SignUp_Login, setSignUp_Login] = useState(false);

    // Visibilité du mot de passe
    const [passwordVisible, setPasswordVisible] = useState(true);

    // Error
    const [error, setError] = useState('');
    const [errorActivate, setErrorActivate] = useState('')
    const [errorOpacity, setErrorOpacity] = useState(0);
    const [firstOpen, setFirstOpen] = useState(true);
    useEffect(() => {
        if (firstOpen) {
            setFirstOpen(false);
        } else {
            setErrorOpacity(1);
            setErrorActivate(error);
        };

        const interval = setInterval(() => {
            setErrorOpacity(0)
        }, 3000);
        return () => clearInterval(interval);
    }, [error, errorActivate]);

    return (
        <View style={{flex:1,alignItems:'center',justifyContent:'flex-end'}}>
            <View style={[Screens.Load, {width:'100%'}]}>

                {/* Header with navigation to Login */}
                <View style={{flexDirection:'row', alignItems:'center', gap:30}}>
                    {SignUp_Login === false ? (
                        <>
                            <Text style={[TextStyles.Title, {fontSize:25}]}>Sign Up</Text>
                            <Pressable onPress={() => {setSignUp_Login(true); setErrorOpacity(0);}}
                                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}
                            >
                                <Text style={[TextStyles.Title, {fontSize:25, color:Colors.ItemSecondary}]}>Login</Text>
                            </Pressable>
                        </>
                    ) : (
                        <>
                            <Pressable onPress={() => {setSignUp_Login(false); setError(''); setErrorActivate(''); setFirstOpen(true); setErrorOpacity(0);}}
                                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}
                            >
                                <Text style={[TextStyles.Title, {fontSize:25, color:Colors.ItemSecondary}]}>Sign Up</Text>
                            </Pressable>
                            <Text style={[TextStyles.Title, {fontSize:25}]}>Login</Text>
                        </>
                    )}
                </View>
                

                {SignUp_Login === false ? (
                    <SignUp onClick={()=>setErrorActivate('')} onError={(error:string)=>setError(error)}/>
                ): (
                    <Login onClick={()=>{setErrorActivate('');}} onError={(error:string)=>setError(error)}/>
                )}

                <View style={[ViewsStyles.ErrorMessage, {opacity:errorOpacity}]}>
                    <Text style={[TextStyles.TextBlack, {color:Colors.Red}]}>{error}</Text>
                </View>
            
            </View>
        </View>
    )
}