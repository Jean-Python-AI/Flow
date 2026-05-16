import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated as RNAnimated } from 'react-native';
import BottomSheet from '../../../../../Components/BottomSheet';
import { ScrollView } from 'react-native-gesture-handler';
// Styles -----------------------------------------------
import { ViewsStyles } from '../../../../../styles/Views';
import { TextStyles } from '../../../../../styles/Text';
import { ButtonStyles } from '../../../../../Components/UI/Button';
import { Colors } from '../../../../../styles/theme';
// Data Base --------------------------------------------
import { Label } from '../../../../../DATA/types/Label';
import { useLabel } from '../../../../../DATA/Hooks/Labels/Labels';
import { useTableS } from '../../../../../DATA/Hooks/Algorithme/TableS';
// Component --------------------------------------------
import LabelElement from '../LabelElement';
import PopInNewLabel from './PopInNewLabels';


interface PopInLabelsProps {
  idPost: number;
  visible: boolean;
  onClose: () => void;
}

export default function PopInLabels({ idPost, visible, onClose }: PopInLabelsProps) {
  const { getAllLabelsHook, getLabelsByPostIDHook } = useLabel();
  const [labels, setLabels] = useState<Label[]>([]);
  const [labelsActivate, setLabelsActivate] = useState<Label[]>([]);
  // Read Labels avec cleanup pour éviter les fuites mémoire
  // ⚠️ Important : ne PAS mettre getAllLabelsHook dans les dépendances, car sa référence
  // peut changer à chaque rendu et provoquer des relectures infinies.
  useEffect(() => {
    if (!visible) return;

    let isMounted = true; // Flag pour éviter les mises à jour d'état après démontage
    
    const fetchLabels = async () => {
      try {
        const data = await getAllLabelsHook(); // Await la Promise pour obtenir les Label[]
        
        // Vérifier que le composant est toujours monté avant de mettre à jour l'état
        if (!isMounted) return;
        
        // S'assurer que les données sont valides
        if (Array.isArray(data)) {
          setLabels(data);
        } else {
          setLabels([]);
        }
      } catch (error) {
        console.error('Erreur lors du fetch des labels:', error);
        // En cas d'erreur, utiliser un tableau vide pour éviter les crashes
        if (isMounted) {
          setLabels([]);
        }
      }
    };

    fetchLabels();
    
    // Cleanup : marquer le composant comme démonté
    return () => {
      isMounted = false;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible || !idPost) {
      // Réinitialiser les labels activés si la PopIn se ferme
      setLabelsActivate([]);
      return;
    }
    
    let isMounted = true; // Flag pour éviter les mises à jour d'état après démontage
    
    const fetchLabelsActivate = async () => {
      try {
        const data = await getLabelsByPostIDHook(idPost);
        setLabelsActivate(data);
      } catch (error) {
        console.error('Erreur lors du fetch des labels activés:', error);
        if (isMounted) {
          setLabelsActivate([]); // En cas d'erreur, utiliser un tableau vide
        }
      }
    };

    fetchLabelsActivate();
    
    // Cleanup : marquer le composant comme démonté
    return () => {
      isMounted = false;
    };
  }, [idPost, visible]); // Recharger quand idPost change ou quand la PopIn s'ouvre
    
  // PopIn New Label -----------------------------------
  const [newLabelVisible, setNewLabelVisible] = useState(false);
    
  // When there is no label, animation
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  useEffect(() => {
    if (labels.length === 0 && visible) {
      fadeAnim.setValue(0); // reset
      // ⏱ attendre que la pop-in ait fini (300ms)
      const timer = setTimeout(() => {
        RNAnimated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      fadeAnim.setValue(0);
    }
  }, [labels, visible]);
  
  // Calculer activateIdsArray une seule fois avant le rendu
  // Filtrer les valeurs undefined/null pour éviter les problèmes de rendu
  const activateIdsArray = React.useMemo(() => {
    return labelsActivate
      .map(label => label?.id)
      .filter((id): id is number => typeof id === 'number' && !isNaN(id));
  }, [labelsActivate]);
  
  return (
    <BottomSheet 
      visible={visible} 
      EntireScreenSpace={true} 
      HEIGHT={400} 
      onClose={async () => {
        onClose();
        // Appeler updateLabels de manière asynchrone et gérer les erreurs
        try {
          await useTableS().updateLabels(idPost);
        } catch (error) {
          console.error('Erreur lors de la mise à jour des labels dans TableS:', error);
          // Ne pas bloquer la fermeture de la pop-in même en cas d'erreur
        }
      }}
    >
      {/* Header ---------------------------------*/}
      <View style={[ViewsStyles.Row_space, {width:'90%'}]}>
        {/* Title */}
        <Text style={[TextStyles.TextPost, TextStyles.TextPost]}>Labels</Text>
        {/* Button add New */}
        <Pressable onPress={()=>setNewLabelVisible(true)} style={({pressed})=>([ButtonStyles.Base, {backgroundColor:pressed?Colors.Background_Elements:Colors.Button, borderWidth:2, borderColor:Colors.Button}])}>
          <Text style={TextStyles.TextBlack}>+ Add</Text>
        </Pressable>
      </View>

      {/* List of the Labels */}
      <ScrollView style={{width:'100%'}}>
        <View style={{height:30}}/>
        {labels.length > 0 ? (
          labels
            .filter(Label => Label && typeof Label.id === 'number' && Label.name && Label.color)
            .map(Label => (
              <LabelElement
                key={Label.id}
                color={Label.color}
                name={Label.name}
                id={Label.id}
                PostId={idPost}
                activateIds={activateIdsArray}
                callback={async () => {
                  // Recharger tous les labels
                  const allLabels = await getAllLabelsHook();
                  setLabels(allLabels);
                  // Recharger les labels activés pour ce post
                  const activatedLabels = await getLabelsByPostIDHook(idPost);
                  setLabelsActivate(activatedLabels);
                }}
              />
            ))
        ) : (
          <RNAnimated.View style={[{paddingBottom:50, opacity: fadeAnim}]}>
            <Text style={TextStyles.TextPost}>No Label</Text>
          </RNAnimated.View>
        )}
        <View style={{height:400}}/>
      </ScrollView>
      {/* PopIn New Label */}
      <PopInNewLabel
        isVisible={newLabelVisible}
        callback={async()=>{ // Refresh the Labels after the creation of a new
          const allLabels = await getAllLabelsHook();
          setLabels(allLabels);
        }}
        onClose={()=>setNewLabelVisible(false)}
      />
    </BottomSheet>
  );
};
