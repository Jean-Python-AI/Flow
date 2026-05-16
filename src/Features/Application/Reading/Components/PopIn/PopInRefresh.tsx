import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { Text, Pressable, Animated, Easing } from 'react-native';
// Style
import { ButtonStyles } from '../../../../../Components/UI/Button';
import { TextStyles } from '../../../../../styles/Text';


interface RefreshPopInProps {
  onRefresh: () => void;
  visible: boolean;
  onClose: () => void;
}

export default function RefreshPopIn({ onRefresh, visible, onClose }: RefreshPopInProps) {
  // Animation
  const translateY = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  // Ref pour tracker l'état précédent de visible
  const prevVisible = useRef(visible);
  // Ref pour tracker si la popIn est montée
  const isMounted = useRef(false);
  // Ref pour tracker l'animation en cours
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useLayoutEffect(()=> {
    // Si visible n'a pas changé, ne rien faire
    if (visible === prevVisible.current) return;
    
    // Annuler l'animation en cours si elle existe
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
    
    if (visible) {
      // Ouvrir la popIn
      isMounted.current = true;
      // Réinitialiser les valeurs avant d'animer
      translateY.setValue(-20);
      opacity.setValue(0);
      
      animationRef.current = Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      ]);
      
      animationRef.current.start(() => {
        animationRef.current = null;
      });
    } else if (isMounted.current) {
      // Fermer la popIn
      animationRef.current = Animated.parallel([
        Animated.timing(translateY, {
          toValue: -20,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        })
      ]);
      
      animationRef.current.start(() => {
        isMounted.current = false;
        animationRef.current = null;
      });
    }
    
    prevVisible.current = visible;
  }, [visible])

  useEffect(()=> {
    if (!visible || !isMounted.current) return;
    
    const interval = setInterval(() => {
      onClose();
    }, 2000);
    return () => clearInterval(interval);
  }, [visible, onClose])

  if (!visible && !isMounted.current) return null;
  return (
    <Animated.View 
      style={{
        ...ButtonStyles.Refresh, 
        opacity, 
        top: 15,
        left: 0,
        right: 0,
        alignSelf: 'center',
        transform: [
          { translateY: translateY }
        ]
      }}
    >
      <Pressable
          onPress={()=> {onRefresh(); onClose();}}
          style={ButtonStyles.RefreshButton}
      >
          <Text style={TextStyles.TextPost}>Refresh</Text>
      </Pressable>
    </Animated.View>
  );
}
