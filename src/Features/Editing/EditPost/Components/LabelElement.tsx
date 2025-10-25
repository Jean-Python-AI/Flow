// IMPORT =====================================================
import React, {useEffect, useState} from 'react';
import { Text, View, Pressable, TextInput } from 'react-native';
// Styles ----------------------------------
import { ButtonStyles } from '../../../../styles/Button';
import { Colors } from '../../../../styles/theme';
import { TextStyles } from '../../../../styles/Text';
// DataBase --------------------------------
import { LinkPostLabel } from '../../../../DataBase/Labels/New_Link_PostLabel';
import { UnlinkPostLabel } from '../../../../DataBase/Labels/Unlink_Post_Label';
import { ModifyLabel } from '../../../../DataBase/Labels/modifyLabels';
// PopIn
import DeleteLabelPopIn from './PopIn/PopInDeleteLabel';



interface LabelElementProps {
    color: string;
    name: string;
    id: number;
    PostId: number;
    activateIds?: number[];
    callback: () => void;
};

// FUNCTION ==================================================
export default function LabelElement({color, name, id, PostId, activateIds, callback}: LabelElementProps) {
    const SizeColorRounds = 15
    const [isActive, setIsActive] = useState(activateIds?.includes(id) ?? false);

    // Synchroniser l'état local avec activateIds quand il change
    useEffect(() => {
        setModifyLabel(false);
        setIsActive(activateIds?.includes(id) ?? false);
    }, [activateIds, id]);

    const Make_LinkPostLabel = () => {
        if (isActive) {
            // Si le label est actif, le supprimer du post
            UnlinkPostLabel(PostId, id, ()=>{
                console.log("Label supprimé du post");
                setIsActive(false);
                callback(); // Appelle le callback pour rafraîchir la liste
            });
        } else {
            // Si le label n'est pas actif, l'ajouter au post
            LinkPostLabel(PostId, id, ()=>{
                console.log("Label ajouté au post");
                setIsActive(true);
                callback(); // Appelle le callback pour rafraîchir la liste
            });
        }
    };


    // Modify label
    const [modifyLabel, setModifyLabel] = useState(false);
    // New title
    const [new_title, setNew_title] = useState(name);

    const ModifyOK = () => {
        ModifyLabel(id, new_title, color, (success) => {
            if (success) {
                callback();
                setModifyLabel(false);
            }
        })
    };

    // Delete label
    const [DeleteLabel_PopIn_Open, setDeleteLabel_PopIn_Open] = useState(false);
        

    // RETURN ===============================================
    if (modifyLabel) {
        return (
            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 10, zIndex:1, paddingHorizontal:10 }}>
                <View style={{flex:1, flexDirection:'row', alignItems:'center', gap:10}}>
                    <View style={{backgroundColor:color, height:SizeColorRounds, width:SizeColorRounds, borderRadius:SizeColorRounds/2}}/>
                    {/* Section text Editing */}
                    <View style={{backgroundColor:Colors.Background_Elements, borderRadius:12, flexDirection:'row', gap:10, paddingRight:10, maxWidth:'90%' }}>
                        {/* Text Input */}
                        <TextInput
                            style={[TextStyles.TextBlack, {paddingHorizontal:10, paddingVertical:5, paddingRight:10, paddingLeft:7, backgroundColor:Colors.Background_Primary, borderRadius:10}]}
                            placeholder='label name'
                            placeholderTextColor={Colors.ItemSecondary}
                            multiline={true}
                            numberOfLines={3}
                            textAlignVertical='top'
                            cursorColor={Colors.ItemSecondary}
                            underlineColorAndroid="transparent"
                            selectionColor={Colors.Button}
                            value={new_title}
                            onChangeText={setNew_title}
                            blurOnSubmit={true} // Prevent new lines on Enter key
                            onSubmitEditing={() => {}}
                            maxLength={20}
                        />
                        {/* Button */}
                        <Pressable onPress={ModifyOK} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, justifyContent:'center' }]}>
                            <View style={ButtonStyles.BlackLittle}>
                                <Text style={[TextStyles.TextBlack, {color:Colors.Background_Primary, fontSize:13}]}>Ok</Text>
                            </View>
                        </Pressable>
                    </View>
                </View>
            
                <Pressable onPress={() => {setDeleteLabel_PopIn_Open(true)}} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, justifyContent:'center' }]}>
                    <View style={ButtonStyles.Delete}>
                        <Text style={[TextStyles.TextBlack, {color:Colors.Background_Primary, fontSize:14}]}>Delete</Text>
                    </View>
                </Pressable>
                               
            
                {/* PopIn --------------------*/}
                <DeleteLabelPopIn labelId={id} labelName={name} visible={DeleteLabel_PopIn_Open} onClose={() => {setDeleteLabel_PopIn_Open(false); callback();}}/>
            </View>
        );
    }
    return (
        <Pressable
            style={({pressed})=>([
                ButtonStyles.Elements,
                {backgroundColor: Colors.Background_Elements, marginVertical:5},
                activateIds?.includes(id) && {backgroundColor: Colors.Background_Primary}
            ])}
            onPress={Make_LinkPostLabel}
            onLongPress={() => setModifyLabel(true)}
        >
            <View style={{backgroundColor:color, height:SizeColorRounds, width:SizeColorRounds, borderRadius:SizeColorRounds/2}}/>
            <Text style={[TextStyles.TextBlack]}>{name}</Text>
        </Pressable>
    )
};