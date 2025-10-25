import React, { useState, useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// DataBase ---------------------------------------------------
import { createTables } from './src/DataBase/dataBase';
import EncryptedStorage from 'react-native-encrypted-storage';
// Component --------------------------------------------------
import { NavBar } from './src/Components/NavBar';
// Screens ----------------------------------------------------
// Starting App --------------------------
import LoadScreen from './src/Features/StartingApp/Load/screen';
import ValidEmail from './src/Features/StartingApp/Login_SignUp/SignUp/ValidEmail';
// Edit ----------------------------------
import InProject from './src/Features/Editing/InProject/screen';
import EditPosts from './src/Features/Editing/EditPost/screen';
// Read ----------------------------------
import OnePostReading from './src/Features/Reading/ReadOnePost/screen';
import SignUpLogin from './src/Features/StartingApp/Login_SignUp/LoginSignUp';



// Improves performance by using native screen components instead of pure JS views.
// This reduces memory usage and makes navigation transitions smoother.
enableScreens();


// Navigation Initialisation
const ClassicNavigation = createNativeStackNavigator<RootStackParamList>();

// Definition of information transmitted between screens
export type RootStackParamList = {
  SignUp_Login: undefined;
  NavBar: undefined;
  InProject: { id: number, title: string };
  EditPost: { id: number, title: string };
  OnePostReading: {id:number, reload:number};
  ValidEmail: {name: string, email: string, password: string};
};




export default function App() {

  // Make Database Tables at launch ---------------------------
  const [dbReady, setDbReady] = useState(false);
  useEffect(() => {
    createTables()
      .then(() => setDbReady(true))
      .catch(err => console.log("Erreur DB", err));
  }, []);

  // User conected ? ------------------------------------------
  const [userConnected, setUserConnected] = useState(false);
  // function for checking
  async function checkUserConnected() {
    try {
      const session = await EncryptedStorage.getItem('user_session');
      setUserConnected(session === 'Flow_Connected');
    } catch (err) {
      console.log('Error checking session:', err);
      setUserConnected(false);
    }
  }
  // Initial check
  useEffect(() => {
    (async () => {
      await checkUserConnected();
    })();
  }, []);
  // Check periodically
  useEffect(() => {
    const interval = setInterval(() => {
      checkUserConnected();
    }, 2000);

    return () => clearInterval(interval);
  }, []);


  // SCREENS ----------------------------------------------------
  // User not connected --------------------
  if (!userConnected && dbReady) {
    console.log("User not connected")
    return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <ClassicNavigation.Navigator>
            <ClassicNavigation.Screen name="SignUp_Login" component={SignUpLogin} options={{ headerShown:false, animation:"fade" }}/>
            <ClassicNavigation.Screen name="ValidEmail" component={ValidEmail} options={{ headerShown: false, animation: "slide_from_right" }}/>
          </ClassicNavigation.Navigator>
        </NavigationContainer>
    </GestureHandlerRootView>
    );    
  } 
  
  // Loading -----------------------------
  else if (!dbReady && !userConnected) {
    console.log("Loading")
    return <LoadScreen/>;
  } 
  
  // User Connected ----------------------
  else if (userConnected && dbReady) {
    console.log("App ready")
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <ClassicNavigation.Navigator>
            <ClassicNavigation.Screen name="NavBar" component={NavBar} options={{ headerShown: false }}/>
            {/* Edit Section */}
            <ClassicNavigation.Screen name="InProject" component={InProject} options={{ headerShown: false, animation: "slide_from_right" }}/>
            <ClassicNavigation.Screen name="EditPost" component={EditPosts} options={{ headerShown: false, animation: "fade_from_bottom" }}/>
            {/* Read Section */}
            <ClassicNavigation.Screen name="OnePostReading" component={OnePostReading} options={{ headerShown: false, presentation: "modal", animation: "fade_from_bottom" }}/>
          </ClassicNavigation.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    );
  };
}
