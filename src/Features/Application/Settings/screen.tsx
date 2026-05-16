// IMPORTS ====================================================================
import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, Pressable, StatusBar, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
// Components -----------------------------------
import BottomBar from './components/BottomBar';
import LogOut from '../../../../assets/icons/LogOut.svg';
import LogOutPopIn from './components/PopIn/Logout';
import PostsPopIn from './components/PopIn/PostsInfos';
// Styles ---------------------------------------
import { Screens } from '../../../styles/screens';
import { Colors } from '../../../styles/theme';
import { TextStyles } from '../../../styles/Text';
// Utils ----------------------------------------
import { setStatusBarColorNative } from '../../../utils/StatusBarNative';
// DataBase -------------------------------------
import { usePost } from '../../../DATA/Hooks/Posts/Posts';


// FUNCTION ====================================================================
function SettingGlobal() {
  const [numberPosts, setNumberPosts] = useState(0);
  const { getNumberOfPostsHook: CountPosts } = usePost(0);

  useEffect(() => {
    const loadCount = async () => {
      try {
        const count = await CountPosts();
        setNumberPosts(count);
      } catch (err) {
        console.error('Erreur comptage posts:', err);
        setNumberPosts(0);
      }
    };

    loadCount();
  }, []);

  // ────────────────────── Calcul du tableau dynamique ──────────────────────
  const containerHeight = 350;
  const screenWidth = Dimensions.get('window').width;
  const containerWidth = screenWidth * 0.9; // 90% de la largeur de l'écran
  const padding = 10;
  const gap = 8;
  
  // Espace disponible réel dans le conteneur (moins le padding)
  const availableHeight = containerHeight - padding * 2 -30;
  const availableWidth = containerWidth - padding * 2 -30;
  
  // Calculer le nombre optimal de colonnes pour maximiser l'utilisation de l'espace
  // Taille minimale acceptable pour un carré (réduite pour permettre plus de colonnes)
  const minItemSize = 20;
  const maxColumns = Math.floor((availableWidth + gap) / (minItemSize + gap));
  
  // Calculer le nombre de colonnes optimal
  // On veut maximiser l'utilisation de l'espace, donc on calcule le nombre de colonnes
  // qui permet d'utiliser le plus d'espace possible
  let optimalColumns = 1;
  let maxSize = 0;
  
  for (let cols = 1; cols <= maxColumns; cols++) {
    const rows = Math.ceil(numberPosts / cols);
    const itemWidth = (availableWidth - gap * (cols - 1)) / cols;
    const itemHeight = (availableHeight - gap * (rows - 1)) / rows;
    const currentSize = Math.min(itemWidth, itemHeight);
    
    // Si cette configuration donne une taille plus grande, on la garde
    if (currentSize > maxSize && currentSize >= minItemSize) {
      maxSize = currentSize;
      optimalColumns = cols;
    }
  }
  
  const columns = Math.max(1, Math.min(optimalColumns, maxColumns));
  const rows = Math.ceil(numberPosts / columns);
  
  // Calculer la taille finale des carrés pour utiliser tout l'espace disponible
  const itemWidth = (availableWidth - gap * (columns - 1)) / columns;
  const itemHeight = (availableHeight - gap * (rows - 1)) / rows;
  const size = Math.min(itemWidth, itemHeight);

  // PopIn
  const [logOutPopInVisible, setLogOutPopInVisible] = useState(false);
  const [PostsPopInVisible, setPostsPopInVisible] = useState(false);

  // ──────────────────────── CONFIGURER LA STATUSBAR QUAND L'ÉCRAN EST FOCUS ────────────────────────
  useFocusEffect(
    React.useCallback(() => {
      // Configuration de la StatusBar pour cet écran
      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(false);
        StatusBar.setBarStyle('dark-content', true);
        setStatusBarColorNative(Colors.Background_Primary);
        
        // Cleanup: restaurer la StatusBar par défaut quand on quitte l'écran
        return () => {
          StatusBar.setTranslucent(false);
          StatusBar.setBarStyle('dark-content', true);
          setStatusBarColorNative(Colors.Background_Primary);
        };
      } else {
        StatusBar.setBarStyle('dark-content', true);
        return () => {
          StatusBar.setBarStyle('dark-content', true);
        };
      }
    }, [])
  );

  // ────────────────────── RENDER ──────────────────────
  return (
    <View style={Screens.basic}>
      <ScrollView style={{ flex: 1, width: '100%' }}>

        <View style={{width:'100%', alignItems:'center'}}>
          <Pressable
            style={({ pressed }) => ({
              width: '90%',
              height: 350,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20, //
              marginTop: 20, //
              backgroundColor: Colors.Background_Primary, //
              borderWidth: 2,
              borderBottomWidth: 2,
              borderColor: Colors.Background_Elements,
            })}
            onPress={() => setPostsPopInVisible(true)}
          >
            <Text style={[TextStyles.Title, { fontSize: 50, zIndex: 1 }]}>
              {numberPosts}
            </Text>
            <Text style={[TextStyles.Title, { zIndex: 1 }]}>Posts</Text>

            {/* Tableau dynamique */}
            <View
              style={{
                position: 'absolute',
                zIndex: 0,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                padding: padding,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              {numberPosts > 0 && size > 0 && Array.from({ length: numberPosts }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    backgroundColor: Colors.Background_Elements,
                    width: size,
                    height: size,
                    borderRadius: size/3,
                    margin: gap / 2,
                  }}
                />
              ))}
            </View>
          </Pressable>
        </View>

        <View style={{ flex:1, width:'100%', alignItems:'center', gap:20, paddingVertical:70}}>

          {/* Button Déconnection */}
          <Pressable
            style={({pressed})=>({backgroundColor:pressed?Colors.Button:Colors.Background_Elements, width:'80%', padding:10, borderRadius:12, borderWidth:2, borderColor:Colors.Button, alignItems:'center', justifyContent:'space-between', flexDirection:'row'})}
            onPress={() => setLogOutPopInVisible(true)}
          >
            <Text style={TextStyles.TextBlack}>Logout</Text>
            <LogOut width={25} height={25} color={Colors.Text_Posts} />
          </Pressable>

          {/* Contact */}
          <Text style={TextStyles.TextWriting} selectable={true}><Text style={TextStyles.TextBlack}>contact:</Text> emailexemple@gmail.com</Text>
        </View>

      </ScrollView>

      <BottomBar />

      {/* PopIn LogOut */}
      <LogOutPopIn visible={logOutPopInVisible} onClose={() => setLogOutPopInVisible(false)}/>
      <PostsPopIn visible={PostsPopInVisible} onClose={() => setPostsPopInVisible(false)} numberPosts={numberPosts}/>
    </View>
  );
}

export default SettingGlobal;