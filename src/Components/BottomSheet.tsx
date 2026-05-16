import React, { useState, useEffect } from 'react';
import { View, Dimensions, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, Easing, withTiming, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import SystemNavigationBar from 'react-native-system-navigation-bar'; // Pour modifier la barre de navigation sur Android
// Styles -----------------------------------------------
import { Colors } from '../styles/theme';


interface BottomSheetProps {
  visible: boolean;
  EntireScreenSpace: boolean
  children?: React.ReactNode;
  HEIGHT: number;
  onClose: () => void;
}

export default function BottomSheet({ visible, EntireScreenSpace, children, HEIGHT, onClose }: BottomSheetProps) {

  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const START_Y = SCREEN_HEIGHT;
  const NORMAL_Y = SCREEN_HEIGHT - HEIGHT;
  const FULL_Y = EntireScreenSpace ? (SCREEN_HEIGHT/100)*5 : NORMAL_Y;
  

  const translateY = useSharedValue(START_Y);
  const [isFull, setIsFull] = useState(false);
  
  const gesture = Gesture.Pan()
    .requireExternalGestureToFail()
    .activeOffsetY([-10, 10]) // Activer le geste dès qu'on bouge verticalement
    .onUpdate((e) => {
      // MOUVEMENT LIBRE (haut et bas)
      let newY = (isFull ? FULL_Y : NORMAL_Y) + e.translationY;
      // Empêcher de monter au-delà de FULL_Y
      if (newY < FULL_Y) {
        // Si on est déjà en mode full, on bloque totalement
        if (isFull) {
          newY = FULL_Y; // ← Ne monte pas plus haut
        } else {
          // Sinon, effet élastique doux (optionnel, mais limité)
          const overscroll = FULL_Y - newY;
          newY = FULL_Y - overscroll * 0.1; // Très faible résistance
        }
      }
      // Si EntireScreenSpace est false, bloquer complètement le mouvement vers le haut
      if (!EntireScreenSpace && e.translationY < 0 && translateY.value <= NORMAL_Y) {
        newY = NORMAL_Y;
      }
      translateY.value = newY;
      if (isFull && e.translationY < 0) return;
    })
    .onEnd((e) => {
      const { translationY, velocityY } = e;
      const currentY = translateY.value; // position actuelle au moment du relâchement
      const isCurrentlyFull = currentY <= FULL_Y + 50; // tolérance de 50px pour considérer comme "full"
      let shouldClose = false;
      if (isCurrentlyFull) {
        // PopIn complètement ouverte → il faut descendre aux 2/3 pour fermer
        shouldClose = translationY > (HEIGHT * 4) / 5 || velocityY > 8000;
      } else {
        // PopIn pas complètement ouverte → fermer dès la moitié
        shouldClose = translationY > HEIGHT / 5 || velocityY > 8000;
      }
      if (shouldClose) {
        translateY.value = withTiming(START_Y, { duration: 180, easing: Easing.out(Easing.quad) }, () => runOnJS(onClose)());
        runOnJS(setIsFull)(false);
      }
      else if (EntireScreenSpace && (translationY < -120 || velocityY < -600)) {
        // Remonter en full (seulement si EntireScreenSpace est true)
        translateY.value = withSpring(FULL_Y, { damping: 90 });
        runOnJS(setIsFull)(true);
      }
      else {
        // Revenir à l'état "normal" (mi-ouvert)
        translateY.value = withSpring(NORMAL_Y, { damping: 90 });
        runOnJS(setIsFull)(false);
      }
    });

  // ← AJOUT : geste uniquement pour la poignée (Native = priorité max)
  const handleGesture = Gesture.Native()
    .simultaneousWithExternalGesture(gesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(NORMAL_Y);
    } else {
      translateY.value = withSpring(START_Y);
    }
  }, [visible]);


  // Modification de la couleur de la barre du bas sur android
  useEffect(() => {
    if (Platform.OS === 'android' && visible) {
      SystemNavigationBar.setNavigationColor(Colors.Background_Elements, 'light');  // blanc semi-transparent + icônes noires
      // Ou : SystemNavigationBar.setNavigationColor(Colors.Background_Elements, 'dark');
    }
  }, [visible]);

  // ← Remet la couleur d'origine quand fermé
  useEffect(() => {
    if (Platform.OS === 'android' && !visible) {
      SystemNavigationBar.setNavigationColor(Colors.Background_Primary, 'light');  // noir par défaut
    }
  }, [visible]);



  if (!visible) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
      {/* FOND FLOU */}
      <BlurView
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        blurType="light"
        blurAmount={3}
      />
      {/* POPUP + GLISSEMENT */}
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            { position: 'absolute', left: 0, right: 0, height: SCREEN_HEIGHT,
              backgroundColor: Colors.Background_Elements, borderTopLeftRadius: 24,
              borderTopRightRadius: 24, padding: 20, alignItems: 'center',
              borderWidth:1, borderBottomWidth:0, borderColor:Colors.Button},
            animatedStyle
          ]}
        >
          {/* POIGNÉE VISUELLE */}
          <GestureDetector gesture={handleGesture}>
            <View style={{ width: 40, height: 5, backgroundColor: Colors.ItemSecondary, borderRadius: 3, marginBottom: 20 }}/>
          </GestureDetector>

          {/* CONTENT OF THE BOTTOM SHEET */}
          {children}

        </Animated.View>
      </GestureDetector>
    </View>
  );
}