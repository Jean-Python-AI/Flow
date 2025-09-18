import React from 'react';
import { Modal, Pressable, View, Text } from 'react-native';
import { BlurView } from '@react-native-community/blur';
// Import Styles
import { PopInStyles } from '../../../../../styles/PopIn';

interface PopInProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function PopIn({ visible, onClose, children }: PopInProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      {/* Fond flou */}
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <BlurView
          style={{ flex: 1 }}
          blurType="light"   // "light", "dark", "xlight", etc.
          blurAmount={1}   // intensité du flou
          reducedTransparencyFallbackColor="white" // fallback Android
        />
      </Pressable>

      {/* The pop-in */}
      <View style={[PopInStyles.Background, { opacity: visible ? 1 : 0 }]} pointerEvents="box-none">
        {children}
      </View>

    </Modal>
  );
}