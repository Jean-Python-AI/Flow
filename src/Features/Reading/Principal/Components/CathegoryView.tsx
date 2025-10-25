import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
// Database
import { ReadAllLabels } from '../../../../DataBase/Labels/ReadLabel';
import { Post } from '../../../../DataBase/Posts/Algorithme';
// Import Style
import { HeadersStyle } from '../../../../styles/Headers';
import { Colors } from '../../../../styles/theme';
import { TextStyles } from '../../../../styles/Text';
import { ButtonStyles } from '../../../../styles/Button';
// Import Components
import CathegoryButton from './ButtonCategory';

interface CathegoryViewProps {
  onLabelsPress: (labelsId: number) => void;
  refreshPosts: () => void;
  refreshing: Post[];
}

// FUNCTION ================================================================
export default function CathegoryView({ onLabelsPress, refreshPosts, refreshing }: CathegoryViewProps) {

  // For refresh the page
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    refreshPosts
  }, [refresh])

  // List of the labels
  const [labels, modifyLabels] = useState<{id: number, name: string, color: string}[]>([]);
  // Read the labels
  useEffect(() => {
    ReadAllLabels(modifyLabels)
  }, [refreshing]);
  // Labels activé
  const [labelsActivate, setLabelsActivate] = useState<number[]>([]);

  // Latest Newest
  const activateLatest = labelsActivate.includes(-1) ?? false;
  const activateNewest = labelsActivate.includes(0) ?? false;
  
  return (
    <View style={{height:50, marginTop:20}}>
      {/* Scroll Container component */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={HeadersStyle.cathegoryViewContainer}>

        {/* Latest & Newest Buttons -------------------------------------------------------------------------*/}
        <Pressable 
          onPress={() => {
          onLabelsPress(-1);
            setLabelsActivate(prev =>
            prev.includes(-1)
              ? prev.filter(id => id !== -1)
              : [...prev.filter(id => id !== 0), -1] // retire 0 si présent, ajoute -1
            );}}
          style={({ pressed }) => [{ marginRight: 3 }, pressed && { opacity: 0.6 }]
        }>
          <View style={[ButtonStyles.cathegoryFilter, activateLatest ? {backgroundColor:Colors.Background_Elements} : {}]}>
            <Text style={[TextStyles.TextPost, activateLatest ? TextStyles.TextBlack : TextStyles.subText]}>Latest</Text>
          </View>
        </Pressable>

        <Pressable 
          onPress={() => {
          onLabelsPress(0);
          setLabelsActivate(prev =>
            prev.includes(0)
            ? prev.filter(id => id !== 0) // si déjà activé, on retire
            : [...prev.filter(id => id !== -1), 0] // sinon on ajoute
          );}}
          style={({ pressed }) => [{ marginRight: 3 }, pressed && { opacity: 0.6 }]
        }>
          <View style={[ButtonStyles.cathegoryFilter, activateNewest ? {backgroundColor:Colors.Background_Elements} : {}]}>
            <Text style={[TextStyles.TextPost, activateNewest ? TextStyles.TextBlack : TextStyles.subText]}>Newest</Text>
          </View>
        </Pressable>
        


        {/* List of all the buttons -------------------------------------------------------------------------*/}
        {labels.map(labels => {
          const activate = labelsActivate.includes(labels.id) ?? false; // true si catégorie active

          return (
            <CathegoryButton
              key={labels.id}
              title={labels.name}
              activate={activate} // on passe true ou false
              onPress={() => {
                onLabelsPress(labels.id);
                setLabelsActivate(prev =>
                  prev.includes(labels.id)
                    ? prev.filter(id => id !== labels.id) // si déjà activé, on retire
                    : [...prev, labels.id] // sinon on ajoute
                );
                // Déclencher un "refresh" après 500ms
                setTimeout(() => {
                  setRefresh(prev => prev + 1);
                }, 500);
              }}
            />
          );
        })}

      </ScrollView>
    </View>
  );
}