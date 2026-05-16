import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '../../../../supabaseClient';
import { Alert } from 'react-native';
import { logInUser } from '../../Services/Connection/Connect';

// Configuration Google côté JS (le webClientId doit être celui du client Web OAuth)
GoogleSignin.configure({
  webClientId: '869876522578-88etgv6bg9oqthqsm0sl2bgv53e9h424.apps.googleusercontent.com',
});

// Cette fonction gère UNIQUEMENT :
// - le flow Google
// - la connexion Supabase
// - l'enregistrement de la session dans EncryptedStorage (via logInUser)
// Le rafraîchissement de l'état React (userConnected) est fait dans les composants
// via useUserConnection().refreshUserConnection().
const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signOut(); // on nettoie l'éventuel compte précédent pour éviter les conflits

    const userInfo = await GoogleSignin.signIn();
    const { idToken } = await GoogleSignin.getTokens();

    if (!idToken) {
      throw new Error('Pas de token – vérifie webClientId et la configuration Google');
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) {
      throw error;
    }

    console.log('User Supabase →', data.user);

    // Stocke la session localement pour App.tsx
    await logInUser(data.session?.access_token || 'GoogleOAuth_Connected');
  } catch (error: any) {
    console.error('Erreur Google Sign-In :', error);

    if (error.code === 'DEVELOPER_ERROR') {
      Alert.alert(
        'Erreur de config Google',
        "Vérifie le SHA-1 debug + le package name dans Google Cloud Console, et que webClientId est bien l'ID client Web."
      );
    } else {
      Alert.alert('Échec connexion', error.message || JSON.stringify(error));
    }

    // On tente de nettoyer au maximum l'état Google/Supabase
    try {
      await GoogleSignin.signOut();
      await supabase.auth.signOut();
    } catch (cleanupError) {
      console.error('Erreur lors du nettoyage après échec Google Sign-In :', cleanupError);
    }
  }
};

// Sign-out "technique" : Google + Supabase uniquement.
// La suppression de user_session est faite dans Connect.logOutUser().
const signOut = async () => {
  try {
    await GoogleSignin.signOut();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Erreur signOut:', error);
    Alert.alert('Erreur', 'Problème lors de la déconnexion Google');
  }
};

export { signInWithGoogle, signOut };