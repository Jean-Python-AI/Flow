import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { HeadersStyle } from '../../../../styles/Headers';
import { Colors } from '../../../../styles/theme';
import { TextStyles } from '../../../../styles/Text';
import { ButtonStyles } from '../../../../Components/UI/Button';
import CathegoryButton from './ButtonCategory';
// Data
import { useLabel } from '../../../../DATA/Hooks/Labels/Labels';
import { Post } from '../../../../DATA/types/Post';

interface CathegoryViewProps {
  onLabelsPress: (labelsId: number) => void;
  refreshPosts: () => void;
  refreshing: Post[]; // ← Problème ici
}

// === COMPOSANT MÉMOÏSÉ ===
const MemoizedCategoryButton = React.memo(CathegoryButton);

export default function CathegoryView({ 
  onLabelsPress, 
  refreshPosts, 
  refreshing 
}: CathegoryViewProps) {
  const { getAllLabelsHook } = useLabel();

  // État des labels
  const [labels, setLabels] = useState<{id: number, name: string, color: string}[]>([]);
  const [labelsActivate, setLabelsActivate] = useState<number[]>([]);

  useEffect(() => {
    const loadLabels = async () => {
      const data = await getAllLabelsHook();
      setLabels(data);
    };
    
    loadLabels();
  }, [refreshing]); // ← Dépendance stable

  // === OPTIMISATION 2 : Fonction de toggle memoïsée ===
  const toggleLabel = useCallback((id: number) => {
    setLabelsActivate(prev => {
      const newSelection = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev.filter(x => (id === -1 ? x !== 0 : x !== -1)), id]; // Latest & Newest s'excluent

      // Appeler le parent immédiatement
      onLabelsPress(id);
      
      return newSelection;
    });
  }, [onLabelsPress, refreshPosts]);

  // === États dérivés (Latest / Newest) ===
  const activateLatest = labelsActivate.includes(-1);
  const activateNewest = labelsActivate.includes(0);

  // === OPTIMISATION 3 : Mémoïser les boutons ===
  const renderedButtons = useMemo(() => {
    return labels.map(label => {
      const isActive = labelsActivate.includes(label.id);
      return (
        <MemoizedCategoryButton
          key={label.id}
          title={label.name}
          activate={isActive}
          onPress={() => toggleLabel(label.id)}
        />
      );
    });
  }, [labels, labelsActivate, toggleLabel]);

  return (
    <View style={{ height: 50, marginTop: 10 }}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={HeadersStyle.cathegoryViewContainer}
      >
        {/* Latest Button */}
        <Pressable 
          onPress={() => toggleLabel(-1)}
          style={({ pressed }) => [{ marginRight: 3 }, pressed && { opacity: 0.6 }]}
        >
          <View style={[
            ButtonStyles.cathegoryFilter, 
            activateLatest ? { backgroundColor: Colors.Background_Elements } : {}
          ]}>
            <Text style={[
              TextStyles.TextPost, 
              activateLatest ? TextStyles.TextBlack : TextStyles.TextPost
            ]}>
              Oldest
            </Text>
          </View>
        </Pressable>

        {/* Newest Button */}
        <Pressable 
          onPress={() => toggleLabel(0)}
          style={({ pressed }) => [{ marginRight: 3 }, pressed && { opacity: 0.6 }]}
        >
          <View style={[
            ButtonStyles.cathegoryFilter, 
            activateNewest ? { backgroundColor: Colors.Background_Elements } : {}
          ]}>
            <Text style={[
              TextStyles.TextPost, 
              activateNewest ? TextStyles.TextBlack : TextStyles.TextPost
            ]}>
              Newest
            </Text>
          </View>
        </Pressable>

        {/* Boutons dynamiques */}
        {renderedButtons}
      </ScrollView>
    </View>
  );
}