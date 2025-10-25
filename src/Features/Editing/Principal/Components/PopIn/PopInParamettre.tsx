import React, { useEffect, useRef } from 'react';
import { Modal, Pressable, View, Text, Animated, Easing } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { PopInStyles } from '../../../../../styles/PopIn';
import { TextStyles } from '../../../../../styles/Text';
import { ButtonStyles } from '../../../../../styles/Button';
import { Colors } from '../../../../../styles/theme';
import { logoutUser } from '../../../../../DataBase/User/Logout';

interface PopInParamettreProps {
  visible: boolean;
  onClose: () => void;
}

export default function PopInParamettre({ visible, onClose }: PopInParamettreProps) {
  const opacityAnim = useRef(new Animated.Value(0)).current;   // pour le fond
  const translateYAnim = useRef(new Animated.Value(300)).current; // pour la popin (hors écran)

  // Animation at open and close
  useEffect(() => {
    if (visible) {
      // Animation d'apparition
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animation de disparition
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 300,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleLogout = async () => {
    const result = await logoutUser();
    
    if (result.success) {
      console.log('Déconnecté avec succès');
      onClose(); // Fermer la popin
      // L'application va automatiquement rediriger vers l'écran de connexion
    } else {
      console.log('Erreur lors de la déconnexion:', result.error);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      {/* Fond flou animé */}
      <Animated.View style={{ flex: 1, opacity: opacityAnim }}>
        <Pressable style={{ flex: 1 }} onPress={onClose}>
          <BlurView
            style={{ flex: 1 }}
            blurType="light"
            blurAmount={1}
            reducedTransparencyFallbackColor="white"
          />
        </Pressable>
      </Animated.View>

      {/* Pop-in animée depuis le bas */}
      <Animated.View
        style={[
          PopInStyles.Background_Bottom,
          { transform: [{ translateY: translateYAnim }] },
        ]}
        pointerEvents="box-none"
      >
        {/* POPIN ---------------------------------------------------------------------------------------------*/}
        <View style={[PopInStyles.Bottom, {paddingBottom:50, gap:10}]}>

          {/* Title ----------------------------------------------*/}
          <Text style={[TextStyles.TextPost, {paddingBottom:10, marginLeft:10}]}>Paramètres</Text>

          {/* Button Logout --------------------------------*/}
          <Pressable 
            style={({pressed})=>([
              ButtonStyles.Elements, 
              {backgroundColor: pressed ? Colors.Red_transparent : Colors.Background_Primary}
            ])}
            onPress={handleLogout}
          >
            <Text style={[TextStyles.TextBlack, {color: Colors.Red}]}>Se déconnecter</Text>
          </Pressable>

        </View>
      </Animated.View>
    </Modal>
  );
}
