import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // For NavBar
import { Image } from 'react-native';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import 'react-native-worklets';
// DataBase
import { useEffect } from 'react';
import { createTables } from './src/DataBase/dataBase';
import db from './src/DataBase/dataBase';
// Styles
import { navBarStyle } from './src/styles/NavBars';
// Screens ----------------------------------------------------
// Edit ----------------------------------
import projectsView from './src/Features/Editing/Principal/screen';
import InProject from './src/Features/Editing/InProject/screen';
import EditPosts from './src/Features/Editing/EditPost/screen';
// Read ----------------------------------
import PostScroll from './src/Features/Reading/Principal/screen';



enableScreens();

// Navigation Initialisation
const ClassicNavigation = createNativeStackNavigator();
const NavBarNavigation = createBottomTabNavigator();

// Definition des informaations transmises entre écrans
export type RootStackParamList = {
  Projects: undefined;                // écran principal
  InProject: { id: number, title: string };       // écran projet, prend un paramètre "id" de type nombre et "title" de type chaîne
  EditPost: { id: number, title: string };        // écran édition de post
};



function NavBar() {
  return (
    <NavBarNavigation.Navigator
      screenOptions={{
        tabBarStyle: navBarStyle.simpleTab,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: 'rgba(0, 0, 0, 1)',
        tabBarInactiveTintColor: 'rgba(150, 150, 150, 1)',
        tabBarItemStyle: {
          paddingHorizontal: 0,   // enlève le padding par défaut
          marginHorizontal: -5,   // tu ajustes pour coller les boutons
        },
        tabBarIconStyle: {
        },
      }}
    >
      <NavBarNavigation.Screen 
        name="PostScroll" 
        component={PostScroll} 
        options={{ animation: 'shift',
          tabBarIcon: ({ color }) => (
            <Image source={require('./assets/icons/HomeIcone2.png')} style={{ tintColor:color, height:40, width:40, marginBottom:-20 }} /> 
          )
        }}
      />
      <NavBarNavigation.Screen 
        name="ProjectNav" 
        component={projectsView} 
        options={{ animation: 'shift',
          tabBarIcon: ({ color }) => ( 
            <Image source={require('./assets/icons/Pen.png')} style={{ tintColor:color, height:30, width:30, marginBottom:-20 }} /> 
          )
        }}
      />
    </NavBarNavigation.Navigator>
  );
}



export default function App() {

  // Make Database Tables at launch
  useEffect(() => {
    createTables();
  }, []);
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <ClassicNavigation.Navigator>
          <ClassicNavigation.Screen name="NavBar" component={NavBar} options={{ headerShown: false }}/>
          <ClassicNavigation.Screen name="Projects" component={projectsView} options={{ headerShown: false }}/>
          <ClassicNavigation.Screen name="Category" component={InProject} options={{ headerShown: false, animation: "slide_from_right" }}/>
          <ClassicNavigation.Screen name="EditPost" component={EditPosts} options={{ headerShown: false, animation: "fade_from_bottom" }}/>
        </ClassicNavigation.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}