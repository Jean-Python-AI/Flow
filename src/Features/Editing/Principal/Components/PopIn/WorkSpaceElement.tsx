// IMPORT =====================================================
import React, {useEffect, useState} from 'react';
import { Text, View, Pressable, TextInput } from 'react-native';
// Styles ----------------------------------
import { ButtonStyles } from '../../../../../styles/Button';
import { Colors } from '../../../../../styles/theme';
import { TextStyles } from '../../../../../styles/Text';
// PopIn
import DeleteWorkSpacePopIn from './PopInDeleteWorkSpace';
// Data
import { WorkSpaceActivate } from '../../../../../DataBase/WorkSpace/WorkSpaceActivate'
import { ModifyWorkSpace } from '../../../../../DataBase/WorkSpace/ModifyWorkSpace';



interface WorkSpaceElementProps {
    name: string;
    id: number;
    activate: boolean;
    nameWorkSpaceActivate: (name:string) => void;
    modifyClick: () => void;
};

// FUNCTION ==================================================
export default function WorkSpaceElement({name, id, activate, nameWorkSpaceActivate, modifyClick}: WorkSpaceElementProps) {
    
    // Change the WorkSpace Activate
    const setId = WorkSpaceActivate((state) => state.setId)


    // Synchroniser l'état local avec activateIds quand il change
    useEffect(() => {
        setModifyWorkSpace(false);
    }, [activate, id]);

    const Make_LinkPostWorkSpace = () => {
        if (activate) {

        } else {

        }
    };


    // Modify WorkSpace
    const [modifyWorkSpace, setModifyWorkSpace] = useState(false);
    // New title
    const [new_title, setNew_title] = useState(name);

    const ModifyOK = () => {
        console.log('Pas de modification effectué');
        ModifyWorkSpace(id, new_title, ()=>modifyClick());
        setModifyWorkSpace(false);
    };

    // Delete WorkSpace
    const [DeleteWorkSpace_PopIn_Open, setDeleteWorkSpace_PopIn_Open] = useState(false);
        

    // RETURN ===============================================
    if (modifyWorkSpace) {
        return (
            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 10, zIndex:1, paddingHorizontal:10 }}>
                <View style={{flex:1, flexDirection:'row', alignItems:'center', gap:10}}>
                    {/* Section text Editing */}
                    <View style={{backgroundColor:Colors.Background_Elements, borderRadius:12, flexDirection:'row', gap:10, paddingRight:10, maxWidth:'90%' }}>
                        {/* Text Input */}
                        <TextInput
                            style={[TextStyles.TextBlack, {paddingHorizontal:10, paddingVertical:5, paddingRight:20, paddingLeft:7, backgroundColor:Colors.Background_Primary, borderRadius:10}]}
                            placeholder='MindSpace name'
                            placeholderTextColor={Colors.ItemSecondary}
                            multiline={false}
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
            
                <Pressable onPress={() => {setDeleteWorkSpace_PopIn_Open(true)}} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, justifyContent:'center' }]}>
                    <View style={ButtonStyles.Delete}>
                        <Text style={[TextStyles.TextBlack, {color:Colors.Background_Primary, fontSize:14}]}>Delete</Text>
                    </View>
                </Pressable>
                               
            
                {/* PopIn --------------------*/}
                <DeleteWorkSpacePopIn WorkSpaceId={id} WorkSpaceName={name} visible={DeleteWorkSpace_PopIn_Open} onClose={() => {setDeleteWorkSpace_PopIn_Open(false); modifyClick()}}/>
            </View>
        );
    }
    return (
        <Pressable
            style={({pressed})=>([
                ButtonStyles.Elements,
                {backgroundColor: Colors.Background_Elements, marginVertical:5},
                activate ? {backgroundColor: Colors.Background_Primary} : null
            ])}
            onPress={()=> {nameWorkSpaceActivate(name); setId(id)}}
            onLongPress={() => setModifyWorkSpace(true)}
        >
            <Text style={[TextStyles.TextBlack]}>{name}</Text>
        </Pressable>
    )
};