import React, {useCallback, useEffect, useState} from 'react';
import { View, Text } from 'react-native';
// Import Styles
import { Colors } from '../styles/theme';
import { TextStyles } from '../styles/Text';
// Data Base
import { Label } from '../DATA/types/Label';
import { useLabel } from '../DATA/Hooks/Labels/Labels';




type InfoBubbleProps = {
    SizeRound: number;
    idPost?: number;
    labelsId?: number[];
    reLoadLabels: boolean;
    showWhenNoting?: boolean;
};

function LabelBubbles({ SizeRound, idPost, labelsId, reLoadLabels, showWhenNoting }: InfoBubbleProps) {
    const { getAllLabelsHook, getLabelsByPostIDHook, getLabelsByIdsHook } = useLabel()

    const SpaceBetweenRound = SizeRound/2;
    
    // Labels
    const [idLabels, modifyIdLabels] = React.useState<Label[]>([]);
    useEffect(() => {
        const fetchLabels = async () => {
            modifyIdLabels([]); // Réinitialiser la liste avant de lire
            if (idPost != null && idPost > 0) {
                const labelsData = await getLabelsByPostIDHook(idPost);
                modifyIdLabels(labelsData);
            } else if (labelsId != null) {
            const labelsData = await getLabelsByIdsHook(labelsId);
            modifyIdLabels(labelsData);
            }
        };
        fetchLabels();
    }, [idPost, labelsId, reLoadLabels]);

    // Afficher uniquement les 3 premiers
    const maxDisplay = 3; // Max 3 éléments
    const hasExtra = idLabels.length > maxDisplay;
    const displayLabels = idLabels.slice(0, maxDisplay);

    // Attendre avant d'afficher noPost
    const [viewNoPost, setViewNoPost] = useState(false)
    useEffect(() => {
        const interval = setInterval(() => {
            setViewNoPost(true)
        }, 1000);
    }, [reLoadLabels, idPost])
    
    // Si aucun label, afficher un texte
    if (showWhenNoting === false && idLabels.length === 0) {
        return;
    }
    if (idLabels.length === 0) {
        return (
            <>
                {viewNoPost ? (
                    <View style={{ 
                        paddingHorizontal: 8, 
                        paddingVertical: 4, 
                        backgroundColor: Colors.Background_Elements, 
                        borderRadius: 12,
                        minWidth: 60,
                        alignItems: 'center'
                    }}>
                        <Text style={[TextStyles.TextPost, { fontSize: 13 }]}>
                            Add labels
                        </Text>
                    </View>
                ) : null}
            </>
        );
    }
    
    return (
        <View 
            style={{ 
                position: 'relative', 
                // Largeur totale : nombre de labels affichés * SpaceRound + la taille de la première boule
                width: SizeRound + (displayLabels.length - 1) * SpaceBetweenRound + (hasExtra ? SpaceBetweenRound : 0),
                height: SizeRound
            }}
        >
            {displayLabels.map((dot, index) => (
                <View 
                    key={index} 
                    style={{
                        position: 'absolute',
                        left: index * SpaceBetweenRound,
                        width: SizeRound,
                        height: SizeRound,
                        borderRadius: SizeRound / 2,
                        backgroundColor: dot.color,
                        borderWidth: 2,
                        borderColor: Colors.Background_Primary,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                />
            ))}

            {hasExtra && (
                <View
                    key="extra"
                    style={{
                        position: 'absolute',
                        // On place la boule grise juste après les derniers labels affichés
                        left: displayLabels.length * SpaceBetweenRound,
                        width: SizeRound,
                        height: SizeRound,
                        borderRadius: SizeRound / 2,
                        backgroundColor: Colors.Text_Posts,
                        borderWidth: 2,
                        borderColor: Colors.Background_Primary,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {/* Optionnel : afficher le nombre de labels restants */}
                    <Text style={[ TextStyles.TextPost, { color: 'white', fontSize: SizeRound*0.45 }]}>
                        +{idLabels.length - maxDisplay}
                    </Text>
                </View>
            )}
        </View>
    );
}

// Cela dit à réact de le réactuliser, si c'est valeurs change réelement
export default React.memo(LabelBubbles);