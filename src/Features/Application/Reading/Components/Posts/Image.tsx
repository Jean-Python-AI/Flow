// IMPORTS =============================================================
import React, { useState, useRef } from 'react';
import { View, Image, ImageBackground, ScrollView, useWindowDimensions } from 'react-native';
import { BlurView } from '@react-native-community/blur';
// Import Styles ----------------------------------------
import { Colors } from '../../../../../styles/theme';

type ImagePostProps = {
    idPost: number;
};

// FUNCTION =============================================================
function ImagePost({idPost}: ImagePostProps ) {
    const { width: screenWidth } = useWindowDimensions();

    // Image
    const images = [
        require('../../../../../../assets/img/Post1.jpg'),
        require('../../../../../../assets/img/P.jpg'),
        require('../../../../../../assets/img/Post4.jpg'),
        require('../../../../../../assets/img/Post5.jpg'),
    ];
    
    // Largeur réelle du conteneur (pour le paging)
    const [containerWidth, setContainerWidth] = useState(screenWidth);
    
    // calcule du ratio de l'image pour afficher avec les bonne proportions
    const imagesWithRatio = React.useMemo(() => {
        return images.map(source => {
            const { width, height } = Image.resolveAssetSource(source);
            const aspectRatio = width / height;
            const imageHeight = containerWidth / aspectRatio;
            return { source, aspectRatio, height: imageHeight };
        });
    }, [containerWidth]);
    
    // Calculer la hauteur maximale pour fixer le conteneur
    const maxHeight = React.useMemo(() => {
        return Math.max(...imagesWithRatio.map(img => img.height));
    }, [imagesWithRatio]);

    // Index de l'image actuelle pour les boules de pagination
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    // Handler pour détecter le changement d'image lors du scroll
    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / containerWidth);
        if (index !== currentImageIndex && index >= 0 && index < imagesWithRatio.length) {
            setCurrentImageIndex(index);
        }
    };

    return (
        <View 
            style={{ marginTop:-10, height: maxHeight, position: 'relative', borderRadius: 20, overflow: 'hidden' }}
            onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setContainerWidth(width);
            }}
        >
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled                    // snap sur chaque image
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={containerWidth}      // important : chaque page = largeur réelle du conteneur
                snapToAlignment="center"
                contentContainerStyle={{ paddingHorizontal: 0 }}
                style={{ width: '100%', height: maxHeight }}
                onMomentumScrollEnd={handleScroll}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {imagesWithRatio.map((img, index) => (
                    <View
                        key={index}
                        style={{
                            width: containerWidth,
                            height: maxHeight,
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            backgroundColor: '#000',
                        }}
                    >
                        {/* Image de fond zoomée et floutée */}
                        <View
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <ImageBackground
                                source={img.source}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                resizeMode="cover"
                            >
                                <BlurView
                                    blurType="dark"
                                    blurAmount={2}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </ImageBackground>
                        </View>
                            
                        {/* Image originale centrée (devant) */}
                        <ImageBackground
                            source={img.source}
                            style={{
                                width: '100%',
                                height: img.height,
                                justifyContent: 'flex-end',
                                backgroundColor: 'transparent',
                                zIndex: 1,
                            }}
                        />
                    </View>
                ))}
            </ScrollView>

            {/* Pagination dots en bas sur l'image */}
            {imagesWithRatio.length > 1 && (
                <View 
                    style={{ 
                        position: 'absolute',
                        bottom: 15,
                        left: 0,
                        right: 0,
                        flexDirection: 'row', 
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {imagesWithRatio.map((_, index) => (
                        <View
                            key={index}
                            style={{
                                width: currentImageIndex === index ? 10 : 6,
                                height: currentImageIndex === index ? 6 : 6,
                                borderRadius: currentImageIndex === index ? 4 : 3,
                                backgroundColor: currentImageIndex === index ? Colors.Background_Primary : Colors.Background_Primary,
                                marginHorizontal: 4,
                                opacity: currentImageIndex === index ? 1 : 0.6,
                            }}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

// Cela dit à réact de le réactuliser, si c'est valeurs change réelement
export default React.memo(ImagePost);