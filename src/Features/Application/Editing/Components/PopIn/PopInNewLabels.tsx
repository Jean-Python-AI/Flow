import React, {useEffect, useState} from 'react';
import { View, Text, Pressable, Modal, TextInput } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Style from '../../../../../../assets/icons/Style.svg';
import { ScrollView } from 'react-native-gesture-handler';
// Styles ----------------------------------
import { ButtonStyles } from '../../../../../Components/UI/Button';
import { PopInStyles } from '../../../../../Components/UI/PopIn';
import { Colors } from '../../../../../styles/theme';
import { TextStyles } from '../../../../../styles/Text';
import { ColorsLabels } from '../../../../../styles/ColorsLabels';
// DataBase --------------------------------
import { useEditLabel } from '../../../../../DATA/Hooks/Labels/LabelEdit';


interface LabelElementProps {
    isVisible: boolean;
    callback: () => void;
    onClose: () => void;
};


export default function PopInNewLabel({isVisible, callback, onClose}: LabelElementProps) {
    const { addLabel } = useEditLabel(0);

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
        addLabel(labelName, colorChoice).then(() => callback());
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
            <View style={PopInStyles.Background}>
                
                <View style={[PopInStyles.NewProject, {gap:20, paddingBottom:30, padding:20}]}>

                    <Text style={TextStyles.TextPost}>New Label</Text>

                    <View style={{flexDirection:'row', alignItems:'center', gap:10, maxWidth:'100%'}}>

                        {editingColor === true ? (
                            <Pressable onPress={() => setEditingColor(false)} style={({ pressed }) => [{opacity: pressed ? 0.5 : 1, borderWidth:2, borderColor:Colors.text, borderRadius:25},]}>
                                <View style={{width:35, height:35, padding:3, backgroundColor:Colors.Button, borderRadius:100, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={TextStyles.TextBlack}>OK</Text>
                                </View>
                            </Pressable>
                        ) : (
                            <Pressable onPress={() => setEditingColor(true)}
                                style={({ pressed }) => ({
                                        opacity: pressed ? 0.5 : 1, width:35, height:35,
                                        padding:3, backgroundColor:colorChoice,
                                        borderRadius:100, justifyContent:'center', alignItems:'center'
                                })}
                            >
                                    <Style width={'90%'} height={'90%'} color={Colors.Background_Primary} style={{opacity:0.7}}/>
                            </Pressable>
                        )}
                        
                        <TextInput style={[TextStyles.TextInput, TextStyles.TextBlack, {flex:1, paddingHorizontal: 15}]} value={labelName} onChangeText={setLabelName}/>
                        
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
                        
                    <Pressable onPress={()=>{NewLabel_Create(); onClose();}} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, width:'100%', justifyContent:'center', marginTop:10 }]}>
                        <View style={ButtonStyles.Base_maxWidth}>
                            <Text style={TextStyles.TextBlack}>Create</Text>
                        </View>
                    </Pressable>
                
                </View>
                
                
            </View>

        </Modal>
    );
}