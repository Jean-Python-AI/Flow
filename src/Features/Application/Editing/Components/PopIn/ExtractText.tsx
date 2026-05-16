// components/SuccessPopup.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Dimensions, Pressable, TextInput } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
// SVG
import LinkedIn from '../../../../../../assets/icons/Linkedin.svg';
import Threads from '../../../../../../assets/icons/threads-icon.svg';
// Styles
import { TextStyles } from '../../../../../styles/Text';
import { ButtonStyles } from '../../../../../Components/UI/Button';
import { Colors } from '../../../../../styles/theme';
// Datatbase
import { ExtractFromLink } from '../../../../../DATA/Services/ExtractTextFromLink';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const POPUP_HEIGHT = SCREEN_HEIGHT * 0.6;
const START_Y = SCREEN_HEIGHT+50;
const VISIBLE_Y = SCREEN_HEIGHT - POPUP_HEIGHT;

interface SuccessPopupProps {
  onSuccess: (data: string) => void;
  visible: boolean;
  onClose: () => void;
}

export default function PopInExtractText({ onSuccess, visible, onClose }: SuccessPopupProps) {
  const translateY = useSharedValue(START_Y);

  const gesture = Gesture.Pan()
    .activeOffsetY([-10, 10]) // Activer le geste dès qu'on bouge verticalement
    .onUpdate((e) => {
      // MOUVEMENT LIBRE (haut et bas)
      const maxPullUp = 100; // ← Changer cette valeur : 0 = pas de tirage haut, 100 = monte de 100px max
      let newY = VISIBLE_Y + e.translationY;
      // Effet élastique si on dépasse
      if (newY < VISIBLE_Y - maxPullUp) {
        const overscroll = newY - (VISIBLE_Y - maxPullUp);
        newY = VISIBLE_Y - maxPullUp + overscroll * 0.3; // 0.3 = résistance
      }
      translateY.value = newY;
    })
    .onEnd((e) => {
      const shouldClose = e.translationY > POPUP_HEIGHT/2 || e.velocityY > 600;
      if (shouldClose) {
        translateY.value = withTiming(START_Y, { duration: 180, easing: Easing.out(Easing.quad) }, () => runOnJS(onClose)());
      } else {
        translateY.value = withSpring(VISIBLE_Y, { damping: 100 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(VISIBLE_Y);
    } else {
      translateY.value = withSpring(START_Y);
    }
  }, [visible]);


  // Extarct the DATA from the link ------------------------------
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Pour initialiser à l'ouverture et fermeture de la popIn
  useEffect(() => {
    if (!visible) {
      setLoading(false);
      setErrorMessage(null);
    }
  }, [visible]);
  // Retirer le message d'erreur lorsque cela recharge
  useEffect(() => {
    if (loading) {
      setErrorMessage(null);
    }
  }, [loading]);
  useEffect(() => {
    if (errorMessage) {
    }
  }, [errorMessage]);


  const [Link, setLink] = useState('');
  const [showExtractor, setShowExtractor] = useState(false);

  const Extract = () => {
    setShowExtractor(true);
    setLoading(true);
  };


  if (!visible) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
      {/* FOND FLOU + TOUCHABLE POUR FERMER */}
      <Pressable 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        onPress={()=>null}
      >
        <BlurView
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          blurType="light"
          blurAmount={3}
        />
      </Pressable>

      {/* POPUP + GLISSEMENT */}
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              right: 0,
              height: SCREEN_HEIGHT,
              backgroundColor: Colors.Background_Elements,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              alignItems: 'center',
              borderWidth:1,
              borderBottomWidth:0,
              borderColor:Colors.Button
            }, animatedStyle,]}>

            {/* POIGNÉE VISUELLE */}
            <View style={{ width: 40, height: 5, backgroundColor: Colors.ItemSecondary, borderRadius: 3, marginBottom: 20 }} />

            {/* CONTENU */}
            <View style={{width:'100%', height:POPUP_HEIGHT*0.85,justifyContent:'space-between'}}>
                {/* Top Section */}
                <View style={{gap:20}}>
                    {/* Titre */}
                    <Text style={TextStyles.TextPost}>Extract Post</Text>
                    {/* Input Link */}
                    <TextInput
                        style={[
                            TextStyles.TextWriting,
                            TextStyles.TextInput,
                            {
                                width: '100%',
                                paddingLeft: 15,
                                backgroundColor: Colors.Background_Primary,
                            }
                        ]}
                        placeholder="Put the Link of the post..."
                        placeholderTextColor={Colors.ItemSecondary}
                        multiline={false}
                        textAlignVertical="center"
                        cursorColor={Colors.ItemSecondary}
                        underlineColorAndroid="transparent"
                        selectionColor={Colors.Button}
                        value={Link}
                        onChangeText={setLink}
                        scrollEnabled={true}
                    />
                    {/* Error Message */}
                    {errorMessage != null ? (
                      <View style={{paddingVertical:5, width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:Colors.Red_transparent, borderRadius:10}}>
                        <Text style={[TextStyles.TextBlack, {color:Colors.Red}]}>{errorMessage}</Text>
                      </View>
                    ) : null}
                </View>
                
                {/* Bottom Section */}
                <View style={{width:'100%', gap:15}}>
                  {/* Accepted platforms */}
                  <View style={{width:'100%'}}>
                    <Text style={TextStyles.TextPost}>Only possible for:</Text>
                    <View style={{flexDirection:'row', gap:10, marginTop:10}}>
                      <Threads width={30} height={30} fill={Colors.ItemSecondary} />
                      <LinkedIn width={35} height={35} color={Colors.ItemSecondary} />
                    </View>
                  </View>

                  {/* Extract Button */}
                  <Pressable
                      style={({pressed})=>([ButtonStyles.Base, {width:'100%', borderWidth:2, borderColor:Colors.Button, height:50, justifyContent:'center', backgroundColor:loading ? Colors.Background_Primary : Colors.Background_Elements}])}
                      onPress={Extract}
                  >
                    { loading ? (
                      <LottieView
                        source={require('../../../../../../assets/Lotties/loader-bold.json')}
                        autoPlay
                        loop
                        style={{width:40, height:40}}
                      />
                    ) : (
                      <Text style={TextStyles.TextPost}>Extract</Text>
                    )}
                  </Pressable>
                </View>


                {/* Extraction Component */}
                {showExtractor && (
                    <ExtractFromLink
                        link={Link}
                        onSuccess={(data) => {
                          onSuccess(data);
                          console.log('Extracted Data:', data);
                          setShowExtractor(false);
                          setLoading(false);
                          onClose();
                        }}
                        onError={(error) => {
                          console.error('Extraction Error:', error);
                          setErrorMessage(error);
                          setShowExtractor(false);
                          setLoading(false);
                        }}
                    />
                )}
            </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}