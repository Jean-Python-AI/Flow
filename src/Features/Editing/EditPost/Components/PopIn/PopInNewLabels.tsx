import React, {useEffect, useState} from 'react';
import { View, Text, Pressable, Modal, TextInput, Image } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import tinycolor from 'tinycolor2';
import Slider from '@react-native-community/slider';
// Styles ----------------------------------
import { ButtonStyles } from '../../../../../styles/Button';
import { PopInStyles } from '../../../../../styles/PopIn';
import { Colors } from '../../../../../styles/theme';
import { TextStyles } from '../../../../../styles/Text';
import { ColorsLabels } from '../../../../../styles/ColorsLabels';
// DataBase --------------------------------
import { NewLabel } from '../../../../../DataBase/Labels/NewLabel';
import { ScrollView } from 'react-native-gesture-handler';


interface LabelElementProps {
    isVisible: boolean;
    callback: () => void;
    onClose: () => void;
};


export default function PopInNewLabel({isVisible, callback, onClose}: LabelElementProps) {
    const [labelName, setLabelName] = React.useState('');
    
    // State Color and edition
    const [editingColor, setEditingColor] = useState(false);
    // Reset when open
    useEffect(() => {
        if (!isVisible) {
            setEditingColor(false);
            setLabelName('');
        }
    }, [isVisible]);

    // Color Choice
    const [colorChoice, setColorChoice] = useState(ColorsLabels[7]);
    
    // New Label Create
    const NewLabel_Create = () => {
        console.log('----------------------------------------');
        NewLabel(labelName, colorChoice, () => callback());
    }

    return (
        <Modal transparent visible={isVisible} animationType="none" onRequestClose={onClose}>
            {/* Fond flou animé */}
            <Pressable style={{ flex: 1 }} onPress={onClose}>
                <BlurView
                    style={{ flex: 1 }}
                    blurType="light"
                    blurAmount={1}
                    reducedTransparencyFallbackColor="white"
                />
            </Pressable>

            {/* Pop-in ----------------------------- */}
            <View style={[PopInStyles.Bottom, {gap:20, paddingBottom:30}]}>
                <Text style={TextStyles.subText}>New Label</Text>

                
                    <View style={{flexDirection:'row', alignItems:'center', gap:10}}>

                        {editingColor === true ? (
                            <Pressable onPress={() => setEditingColor(false)} style={({ pressed }) => [{opacity: pressed ? 0.5 : 1, borderWidth:2, borderColor:Colors.text, borderRadius:25},]}>
                                <View style={{width:35, height:35, padding:3, backgroundColor:Colors.Button, borderRadius:100, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={TextStyles.TextBlack}>OK</Text>
                                </View>
                            </Pressable>
                        ) : (
                            <Pressable onPress={() => setEditingColor(true)} style={({ pressed }) => [{opacity: pressed ? 0.5 : 1,},]}>
                                    <View style={{width:35, height:35, padding:3, backgroundColor:colorChoice, borderRadius:100, justifyContent:'center', alignItems:'center'}}>
                                        <Image source={require('../../../../../../assets/icons/Style.png')} style={{width:'100%', height:'100%', tintColor:Colors.Background_Primary, opacity:0.7}} />
                                    </View>
                            </Pressable>
                        )}
                        
                        <TextInput style={[TextStyles.TextInput, TextStyles.TextBlack, {width:'87%'}]} value={labelName} onChangeText={setLabelName}/>
                        
                    </View>

                    {editingColor === true ? (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
                        >
                            {Object.entries(ColorsLabels).map(([key, color]) => (
                                <Pressable
                                    key={key}
                                    onPress={() => setColorChoice(color)}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20, // cercle
                                        backgroundColor: color,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: colorChoice === color ? 2 : 4,
                                        borderColor: colorChoice === color ? Colors.text : Colors.Background_Elements,
                                    }}
                                />
                            ))}
                        </ScrollView>
                    ) : null}
                        
                    <Pressable onPress={()=>{NewLabel_Create(); onClose();}} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, width:'100%', justifyContent:'center', marginTop:20 }]}>
                        <View style={ButtonStyles.Base_maxWidth}>
                            <Text style={TextStyles.TextBlack}>Create</Text>
                        </View>
                    </Pressable>
                
                
            </View>

        </Modal>
    );
}