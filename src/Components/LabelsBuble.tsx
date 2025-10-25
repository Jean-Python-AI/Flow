import React, {useEffect, useState} from 'react';
import { View, Text } from 'react-native';
// Import Styles
import { Colors } from '../styles/theme';
import { TextStyles } from '../styles/Text';
// Data Base
import { ReadLabelsByPostId } from '../DataBase/Labels/Read_PostLabel';
import { ReadLabelsFrom_List } from '../DataBase/Labels/ReadLabel';




type InfoBubbleProps = {
    SizeRound: number;
    idPost?: number;
    labelsId?: number[];
    reLoadLabels: boolean;
};

export default function LabelBubble({ SizeRound, idPost, labelsId, reLoadLabels }: InfoBubbleProps) {

    const SpaceRound = SizeRound/2;
    
    // Labels
    type Label = { id: number; name: string; color: string };
    const [idLabels, modifyIdLabels] = React.useState<Label[]>([]);
    useEffect(() => {
        modifyIdLabels([]); // Réinitialiser la liste avant de lire
        if (idPost != null) {
            ReadLabelsByPostId(idPost, (labelIds) => {
                modifyIdLabels(labelIds); // Utilise directement les IDs des labels liés au post
            });
        } else if (labelsId != null) {
            ReadLabelsFrom_List(labelsId, (labelsId) => {
                modifyIdLabels(labelsId);
            });
        }
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
                        <Text style={[TextStyles.subText, { fontSize: 13 }]}>
                            No labels
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
                width: SizeRound + (displayLabels.length - 1) * SpaceRound + (hasExtra ? SpaceRound : 0),
                height: SizeRound
            }}
        >
            {displayLabels.map((dot, index) => (
                <View 
                    key={index} 
                    style={{
                        position: 'absolute',
                        left: index * SpaceRound,
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
                        left: displayLabels.length * SpaceRound,
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
                    <Text style={[ TextStyles.TextPost, { color: 'white', fontSize: 10 }]}>
                        +{idLabels.length - maxDisplay}
                    </Text>
                </View>
            )}
        </View>
    );
}