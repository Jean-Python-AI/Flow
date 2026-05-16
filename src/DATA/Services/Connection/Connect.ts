import EncryptedStorage from 'react-native-encrypted-storage';
import { signOut } from './GoogleOAuth';

// IMPORTANT :
// Ce fichier ne doit PAS utiliser de hooks React (useUserConnection, etc.)
// Il ne gère QUE le stockage. Les composants/appels UI doivent ensuite
// invoquer refreshUserConnection() via le contexte défini dans App.tsx.

async function logInUser(token?: string) {
  // Stocker la session de l'utilisateur de manière sécurisée
  await EncryptedStorage.setItem('user_session', JSON.stringify({
    token: token || 'Flow_Connected',
    loggedIn: true,
  }));
  console.log('User logged in (storage updated).');
}

async function logOutUser() {
  console.log('Logging out user...');
  // Supprimer la session de l'utilisateur de manière sécurisée
  await EncryptedStorage.removeItem('user_session');
  // déconnection google
  await signOut();
  console.log('User session removed from storage.');
}

export { logInUser, logOutUser }