// IMPORTS =============================================================
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, Pressable, Animated, Dimensions } from 'react-native';
// Import Styles ----------------------------------------
import { TextStyles } from '../../../../../styles/Text';
import { Colors } from '../../../../../styles/theme';
// Database
import { useLabel } from '../../../../../DATA/Hooks/Labels/Labels';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const POPOVER_WIDTH = SCREEN_WIDTH * 0.5;
const POPOVER_PADDING = 20;

type LabelsPopoverProps = {
    idPost: number;
    visible: boolean;
    buttonLayout: { x: number; y: number; width: number; height: number };
    onClose: () => void;
};

// FUNCTION =============================================================
function LabelsPopover({ idPost, visible, buttonLayout, onClose }: LabelsPopoverProps) {
    const { getLabelsByPostIDHook:getLabelByPostId } = useLabel();
    // État pour les labels
    const [popoverLabels, setPopoverLabels] = useState<{ id: number; name: string; color: string }[]>([]);
    const popoverOpacity = useRef(new Animated.Value(0)).current;
    const popoverScale = useRef(new Animated.Value(0.8)).current;
    const [popoverMounted, setPopoverMounted] = useState(false);

    // Charger les labels quand le popover s'ouvre
    useEffect(() => {
        if (visible) {
            setPopoverMounted(true);
            getLabelByPostId(idPost).then((data) => {
                setPopoverLabels(data || []);
            });
            // Animation d'entrée
            Animated.parallel([
                Animated.timing(popoverOpacity, {
                    toValue: 1,
                    duration: 20,
                    useNativeDriver: true,
                }),
                Animated.spring(popoverScale, {
                    toValue: 1,
                    tension: 100,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]).start();
        } else if (popoverMounted) {
            // Animation de sortie
            Animated.parallel([
                Animated.timing(popoverOpacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(popoverScale, {
                    toValue: 0.8,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setPopoverMounted(false);
                setPopoverLabels([]);
            });
        }
    }, [visible, popoverMounted, idPost, popoverOpacity, popoverScale]);

    // Fermer le popover
    const handleClosePopover = useCallback(() => {
        onClose();
    }, [onClose]);

    const animatedStyle = {
        opacity: popoverOpacity,
        transform: [{ scale: popoverScale }],
    };

    if (!popoverMounted || !buttonLayout) return null;

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    top: 20, // Avant "120%"
                    left: Math.max(10, Math.min(buttonLayout.x - POPOVER_WIDTH / 2 + buttonLayout.width / 2, SCREEN_WIDTH - POPOVER_WIDTH - 10)),
                    width: POPOVER_WIDTH,
                    backgroundColor: Colors.Background_Elements,
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: Colors.Button,
                    padding: POPOVER_PADDING,
                    zIndex: 10000,
                    elevation: 10,
                },
                animatedStyle,
            ]}
            pointerEvents="box-none"
        >
            {/* Header avec titre et bouton croix */}
            <Pressable
                onPress={handleClosePopover}
                style={({ pressed }) => ({
                    position:'absolute',
                    opacity: pressed ? 0.6 : 1,
                    padding: 10,
                    right:0,
                    top:0,
                })}
            >
                <View style={{
                    width: 30,
                    height: 30,
                    borderRadius: 12,
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={[TextStyles.TextBlack, { 
                        fontSize: 22, 
                        lineHeight: 22, 
                        includeFontPadding: false,
                        marginTop: -2, // Ajustement manuel pour centrer parfaitement
                    }]}>×</Text>
                </View>
            </Pressable>

            <View style={{ gap: 10 }}>
                {popoverLabels.length > 0 ? (
                    popoverLabels.map((label) => (
                        <Pressable
                            key={label.id}
                            style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
                        >
                            <View
                                style={{
                                    height: 15,
                                    width: 15,
                                    backgroundColor: label.color,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: Colors.Button,
                                }}
                            />
                            <Text style={[TextStyles.TextBlack, {fontSize:15}]}>{label.name}</Text>
                        </Pressable>
                    ))
                ) : (
                    <Text style={TextStyles.TextBlack}>No labels</Text>
                )}
            </View>
        </Animated.View>
    );
}

// Cela dit à réact de le réactuliser, si c'est valeurs change réelement
export default React.memo(LabelsPopover);

