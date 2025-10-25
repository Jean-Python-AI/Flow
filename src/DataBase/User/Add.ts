import { supabase } from '../../../supabaseClient'
import EncryptedStorage from 'react-native-encrypted-storage';

async function createUser(name: string, email: string, password: string, onError: (error:string)=>void) {
  try {
    // Créer l'utilisateur avec authentification Supabase
    // Supabase gère automatiquement le hachage des mots de passe
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        }
      }
    })

    if (authError) {
      console.log("Erreur d'authentification:", authError)
      
      // Gestion spécifique de l'erreur de limite de taux
      if (authError.message?.includes('over_email_send_rate_limit')) {
        console.log("Limite d'envoi d'email atteinte. Veuillez attendre avant de réessayer.")
        onError('réessayer dans un petit peu de temps')
        return { error: 'rate_limit', message: 'Limite d\'envoi d\'email atteinte. Veuillez attendre avant de réessayer.' }
      }
      
      onError('no connected')
      return { error: 'auth_error', message: authError.message }
    }

    // Vérifier si l'utilisateur a été créé
    if (!authData.user) {
      console.log("Aucun utilisateur créé")
      return { error: 'no_user', message: 'Aucun utilisateur créé' }
    }

    console.log("Utilisateur créé avec succès:", authData.user.id)
    // Stocker la session de l'utilisateur de manière sécurisée
    async function storeUserSession(sessionToken: string) {
      await EncryptedStorage.setItem('user_session', JSON.stringify({
        token: sessionToken,
        loggedIn: true
      }));
    }
    storeUserSession(authData.session?.access_token || 'Flow_ Connected');

    return { success: true, user: authData.user }
  } catch (error) {
    console.log("Erreur générale:", error)
    return { error: 'general_error', message: 'Erreur inattendue' }
  }
}

export { createUser }