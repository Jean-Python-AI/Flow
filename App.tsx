import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { View, StatusBar, Platform, AppState, AppStateStatus } from 'react-native';
import { setStatusBarColorNative } from './src/utils/StatusBarNative';
import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/Components/ErrorBoundary';
// Screens
import LoadScreen from './src/Features/Load/screen';
import FisrtOpenScreen from './src/Features/StartingApp/FirstOpen';
import EditPosts from './src/Features/Application/Editing/screen';
import PostScroll from './src/Features/Application/Reading/screen';
import SettingGlobal from './src/Features/Application/Settings/screen';
// DB & Storage
import { createTables, migrateFormatedDateForOldPosts, migrateTableU, migratePostsDfColumns } from './src/DATA/DataBase/dataBase';
import { checkAndReduceTableSLinks } from './src/DATA/DataBase/TableSRepository';
import { getAllPostIds } from './src/DATA/DataBase/postsRepository';
import { initializeDfForAllPosts } from './src/DATA/Hooks/Algorithme/Df';
import EncryptedStorage from 'react-native-encrypted-storage';
// Supabase & Google Sign-In
import { supabase } from './supabaseClient';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// Styles
import { Colors } from './src/styles/theme';

// S'assurer que react-native-screens est correctement initialisé
enableScreens(true);
const ClassicNavigation = createNativeStackNavigator<RootStackParamList>();

// ──────────────────────── CONTEXTE POUR USER CONNECTION ────────────────────────
interface UserConnectionContextType {
  refreshUserConnection: () => Promise<void>;
}

const UserConnectionContext = createContext<UserConnectionContextType | undefined>(undefined);

export const useUserConnection = () => {
  const context = useContext(UserConnectionContext);
  if (!context) {
    throw new Error('useUserConnection must be used within UserConnectionProvider');
  }
  return context;
};


// Pour la connection via Google OAuth
GoogleSignin.configure({
  webClientId: '869876522578-ijutqft8hkm7vnklkv93n8heifpuvg3d.apps.googleusercontent.com',
  offlineAccess: true,
  forceCodeForRefreshToken: true
});



export type RootStackParamList = {
  FirstOpenScreen: undefined;
  Onboarding: undefined;
  SignUp_Login: undefined;
  PostScroll: undefined;
  SettingGlobal: undefined;
  InProject: { id: number, title: string };
  EditPost: { id: number };
  OnePostReading: { id: number, reload: number };
  ValidEmail: { name: string, email: string, password: string };
};

export default function App() {
  // États globaux
  const [appIsReady, setAppIsReady] = useState(false);     // Tout est chargé ?
  const [userConnected, setUserConnected] = useState<boolean | null>(null); // null = en cours
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  // ──────────────────────── FONCTION POUR RELIRE LA SESSION ────────────────────────
  const refreshUserConnection = useCallback(async () => {
    try {
      // On lit la session telle qu'écrite dans src/DataBase/User/Connect.ts :
      // EncryptedStorage.setItem('user_session', JSON.stringify({ token, loggedIn: true }))
      const session = await EncryptedStorage.getItem('user_session');
      let connected = false;

      if (session) {
        try {
          const data = JSON.parse(session) as { token?: string; loggedIn?: boolean };
          // Méthode principale : on fait confiance au champ loggedIn
          if (data.loggedIn === true) {
            connected = true;
          }
        } catch {
          // Si ce n'est pas du JSON, on garde connected = false
        }
      }

      // Compatibilité avec l'ancien format simple 'Flow_Connected'
      if (session === 'Flow_Connected') {
        connected = true;
      }

      console.log('refreshUserConnection - session:', session, 'connected:', connected);
      setUserConnected(connected);
    } catch (storageError) {
      console.error('Erreur lors de la vérification de la session:', storageError);
      // Valeur par défaut si erreur
      setUserConnected(false);
    }
  }, []);

  // ──────────────────────── CHARGEMENT COMPLET ────────────────────────
  useEffect(() => {
    async function prepareApp() {
      try {
        // 1. Créer les tables DB avec protection d'erreur
        try {
          console.log('🔄 Début createTables...');
          await createTables();
          console.log('✅ createTables terminé');
          
          // 1.4. Migrer TableU pour ajouter les colonnes manquantes
          try {
            console.log('🔄 Début migration TableU...');
            await migrateTableU();
            console.log('✅ Migration TableU terminée');
          } catch (tableUError) {
            console.error('❌ Erreur lors de la migration TableU:', tableUError);
          }
          
          // 1.4.5. Migrer Posts pour ajouter les colonnes Df et lastViewedAt
          try {
            console.log('🔄 Début migration Posts Df columns...');
            await migratePostsDfColumns();
            console.log('✅ Migration Posts Df columns terminée');
          } catch (postsDfError) {
            console.error('❌ Erreur lors de la migration Posts Df columns:', postsDfError);
          }
          
          // 1.5. Migrer les anciens posts pour remplir formatedDate
          try {
            console.log('🔄 Début migration formatedDate...');
            await migrateFormatedDateForOldPosts();
            console.log('✅ Migration formatedDate terminée');
          } catch (migrationError) {
            console.error('❌ Erreur lors de la migration formatedDate:', migrationError);
          }
          
          // 1.6. Vérifier et réduire les liens TableS pour tous les posts
          try {
            console.log('🔄 Début vérification TableS...');
            const allPostIds = await getAllPostIds();
            for (const postId of allPostIds) {
              await checkAndReduceTableSLinks(postId);
            }
            console.log(`✅ Vérification TableS terminée pour ${allPostIds.length} post(s)`);
          } catch (tableSError) {
            console.error('❌ Erreur lors de la vérification TableS:', tableSError);
          }
          
          // 1.7. Initialiser Df pour tous les posts
          try {
            console.log('🔄 Début initialisation Df...');
            await initializeDfForAllPosts();
            console.log('✅ Initialisation Df terminée');
          } catch (dfError) {
            console.error('❌ Erreur lors de l\'initialisation Df:', dfError);
          }
        } catch (dbError) {
          console.error('❌ Erreur lors de la création des tables:', dbError);
        }

        // 2. Vérifier la session + onboarding avec protection d'erreur
        try {
          // On réutilise exactement la même méthode que dans refreshUserConnection
          await refreshUserConnection();
        } catch (storageError) {
          console.error('Erreur lors de la vérification de la session:', storageError);
          // Valeurs par défaut si erreur
          setUserConnected(false);
        }

        // 3. Tu peux ajouter ici : Font.loadAsync, assets, API pré-charge, etc.
        // await Font.loadAsync({ ... });

      } catch (error) {
        console.error('Erreur critique lors du prepareApp :', error);
        // Valeurs par défaut pour permettre à l'app de démarrer
        setUserConnected(false);
      } finally {
        setAppIsReady(true); // Tout est prêt → on pourra cacher le splash
      }
    }

    prepareApp();
  }, []);

  // ──────────────────────── CONFIGURER LA STATUSBAR PAR DÉFAUT ────────────────────────
  useEffect(() => {
    // Configuration de la StatusBar par défaut pour toute l'app
    if (Platform.OS === 'android') {
      // Utiliser le module natif pour forcer le changement de couleur (plus fiable que StatusBar.setBackgroundColor)
      StatusBar.setTranslucent(false);
      StatusBar.setBarStyle('dark-content', true);
      setStatusBarColorNative(Colors.Background_Primary);
    } else {
      StatusBar.setBarStyle('dark-content', true);
    }
  }, []);

  // ──────────────────────── GESTION DU LIFECYCLE APP (BACKGROUND/FOREGROUND) ────────────────────────
  useEffect(() => {
    let appStateSubscription: any;
    let backgroundTimer: NodeJS.Timeout | null = null;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('AppState changed:', nextAppState);
      
      if (nextAppState === 'active') {
        // L'app revient en foreground
        console.log('App is now active - refreshing critical data');
        
        // Annuler le timer de background s'il existe
        if (backgroundTimer) {
          clearTimeout(backgroundTimer);
          backgroundTimer = null;
        }

        // Rafraîchir les données critiques sans recharger toute l'app
        // On vérifie d'abord que l'app est prête et que l'utilisateur est connecté
        if (appIsReady && userConnected === true) {
          // Rafraîchir la session utilisateur (léger, rapide)
          refreshUserConnection().catch(err => {
            console.error('Error refreshing user connection on foreground:', err);
          });
        }
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // L'app passe en background
        console.log('App is going to background');
        
        // Optionnel : Sauvegarder l'état critique ici si nécessaire
        // Par exemple, sauvegarder la navigation state ou des données importantes
        
        // Timer de sécurité : si l'app reste en background trop longtemps,
        // on peut décider de ne pas rafraîchir certaines données au retour
        backgroundTimer = setTimeout(() => {
          console.log('App has been in background for a while');
        }, 60000); // 60 secondes
      }
    };

    // Écouter les changements d'état de l'app
    appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup : retirer le listener quand le composant est démonté
    return () => {
      if (appStateSubscription) {
        appStateSubscription.remove();
      }
      if (backgroundTimer) {
        clearTimeout(backgroundTimer);
      }
    };
  }, [appIsReady, userConnected, refreshUserConnection]);

  // ──────────────────────── NAVIGATION AUTOMATIQUE QUAND USER CONNECTÉ/DÉCONNECTÉ ────────────────────────
  useEffect(() => {
    console.log('userConnected changed:', userConnected, 'appIsReady:', appIsReady);
    
    // Attendre que l'app soit prête
    if (!appIsReady) {
      return;
    }

    // Fonction pour effectuer la navigation de manière sûre
    const performNavigation = () => {
      // Vérifier que la navigation est prête avant de naviguer
      if (!navigationRef.current?.isReady()) {
        console.log('Navigation not ready yet, retrying...');
        // Réessayer après un court délai si la navigation n'est pas prête
        setTimeout(performNavigation, 100);
        return;
      }

      try {
        if (userConnected === true) {
          console.log('Tentative de navigation vers PostScroll');
          navigationRef.current?.reset({
            index: 0,
            routes: [{ name: 'PostScroll' }],
          });
          console.log('Navigation réussie vers PostScroll');
        } else if (userConnected === false) {
          // Navigation vers FirstOpenScreen quand l'utilisateur se déconnecte
          console.log('Tentative de navigation vers FirstOpenScreen');
          navigationRef.current?.reset({
            index: 0,
            routes: [{ name: 'FirstOpenScreen' }],
          });
          console.log('Navigation réussie vers FirstOpenScreen');
        }
      } catch (error) {
        console.error('Erreur lors de la navigation:', error);
      }
    };

    // Attendre un peu pour que React ait re-rendu avec les nouveaux écrans
    // Augmenter le délai pour laisser le temps au Navigator de se remonter si nécessaire
    const timer = setTimeout(performNavigation, 300);
    
    return () => clearTimeout(timer);
  }, [userConnected, appIsReady]);


  // ──────────────────────── CALLBACK POUR LE LAYOUT ────────────────────────
  const onLayoutRootView = useCallback(() => {
    // Callback pour le layout, sans dépendance à Expo
  }, []);

  // ──────────────────────── SI PAS PRÊT → LoadScreen PLEIN ÉCRAN ────────────────────────
  if (!appIsReady) {
    return (
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <LoadScreen /> {/* ← TON ÉCRAN DE CHARGEMENT ANIMÉ PENDANT TOUT LE CHARGEMENT */}
      </View>
    );
  }

  // ──────────────────────── APP PRÊTE → ON AFFICHE LA NAVIGATION ────────────────────────
  // Protection : si userConnected est null ou firstOpen est vide, afficher l'écran de connexion par défaut
  // On affiche l'app seulement si userConnected est explicitement true
  const isUserConnected = userConnected === true;
  
  return (
    <ErrorBoundary>
      <UserConnectionContext.Provider value={{ refreshUserConnection }}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1, backgroundColor:Colors.Background_Primary }} onLayout={onLayoutRootView}>
            <NavigationContainer 
              ref={navigationRef}
              onReady={() => {
                // S'assurer que la navigation est prête avant toute opération
                console.log('NavigationContainer is ready');
              }}
            >
              <ClassicNavigation.Navigator 
                key={isUserConnected ? 'connected' : 'not-connected'}
                screenOptions={{ headerShown: false }}
                // Logique simple et automatique :
                // - si connecté  -> PostScroll
                // - si déconnecté -> FirstOpenScreen
                initialRouteName={isUserConnected ? 'PostScroll' : 'FirstOpenScreen'}
              >

          {/* ───── UTILISATEUR CONNECTÉ ───── */}
          {isUserConnected ? (
            <>
              <ClassicNavigation.Screen name="PostScroll" component={PostScroll} options={{ presentation: "modal", animation: "ios_from_right" }} />
              <ClassicNavigation.Screen name="EditPost" component={EditPosts} options={{ animation: "fade_from_bottom" }} />
              <ClassicNavigation.Screen name="SettingGlobal" component={SettingGlobal} options={{ animation: 'slide_from_left' }} />
            </>
          ) : (
            <>
              {/* ───── UTILISATEUR NON CONNECTÉ ───── */}
              <ClassicNavigation.Screen name="FirstOpenScreen" component={FisrtOpenScreen} options={{ animation: "slide_from_right" }} />
            </>
          )}

              </ClassicNavigation.Navigator>
            </NavigationContainer>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </UserConnectionContext.Provider>
    </ErrorBoundary>
  );
}