import { supabase } from '../../../supabaseClient'

async function verifyUser(email: string, password: string, onError:(error:string)=>void) {
  try {
    // Supabase gère automatiquement la vérification email/password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      console.log("Erreur de connexion:", error.message)
      onError('No connected')
      // Gestion des erreurs spécifiques
      if (error.message.includes('Invalid login credentials')) {
        onError('Email or password not correct')
        return { success: false, error: 'invalid_credentials', message: 'Email ou mot de passe incorrect' }
      }

            
      return { success: false, error: 'auth_error', message: error.message }
    }

    if (!data.user) {
      return { success: false, error: 'no_user', message: 'Aucun utilisateur trouvé' }
    }

    console.log("Connexion réussie:", data.user.id)
    return { success: true, user: data.user }
  } catch (error) {
    console.log("Erreur générale:", error)
    return { success: false, error: 'general_error', message: 'Erreur inattendue' }
  }
}

export { verifyUser };