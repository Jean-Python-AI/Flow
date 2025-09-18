// IMPORT ================================================================================
import React, { useRef, useMemo, useEffect } from 'react';
import { View, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Colors } from '../../../../styles/theme';
import { PopInStyles } from '../../../../styles/PopIn';

interface PopInProps {
  visible: boolean;
  onClose: () => void;
}

// FUNCTION ==============================================================================
export default function PopInLabels({ visible, onClose }: PopInProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Définir les "snap points" → positions possibles
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // Ouvre / ferme selon "visible"
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.snapToIndex(0); // ouvre au 1er snapPoint
    } else {
      bottomSheetRef.current?.close(); // ferme
    }
  }, [visible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1} // commence fermé
      snapPoints={snapPoints}
      enablePanDownToClose={true} // swipe down pour fermer
      onClose={onClose} // callback fermeture
      backgroundStyle={[PopInStyles.Background, { backgroundColor: Colors.Background_Primary }]}
    >
      <View style={{ padding: 20 }}>
        <Text>PopIn Labels</Text>
        <Text>PopIn Labels</Text>
        <Text>PopIn Labels</Text>
        <Text>PopIn Labels</Text>
        <Text>PopIn Labels</Text>
        <Text>PopIn Labels</Text>
      </View>
    </BottomSheet>
  );
}
