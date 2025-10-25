import EncryptedStorage from 'react-native-encrypted-storage';

async function logoutUser() {
  try {
    // Supprimer la session stockée localement
    await EncryptedStorage.removeItem('user_session');
    
    console.log("Déconnexion réussie - session locale supprimée");
    return { success: true };
  } catch (error) {
    console.log("Erreur lors de la déconnexion:", error);
    return { success: false, error: 'Erreur lors de la suppression de la session' };
  }
}

export { logoutUser };
