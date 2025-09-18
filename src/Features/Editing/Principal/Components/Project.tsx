// IMPORTS ===============================================================
import React, {useState, useEffect} from 'react';
import { View, Text, Image, Pressable, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Import Styles
import { Colors } from '../../../../styles/theme';
import { ViewsStyles } from '../../../../styles/Views';
import { TextStyles } from '../../../../styles/Text';
import { ButtonStyles } from '../../../../styles/Button';
// Import Components
import DeleteProject_PopIn from './DeleteProject_PopIn';
// Import DataBase
import { ModifyProject } from '../DataManager/ModifyProject';



interface OneProjectProps {
    id: number,
    title: string,
    dots?: boolean,
    onChanged?: () => void,
};



// FUNCTION ==============================================================
export default function OneProject({id, title, dots, onChanged}: OneProjectProps) {
    const navigation = useNavigation<any>();

    // PopIn
    const [DeleteProject_PopIn_Open, _DeleteProject_PopIn_Open] = useState(false);

    // if it's modifing or not
    const [modify, setModify] = useState(false);
    useEffect(() => {
        setModify(false);
    }, []);
    // Prevent closing immediately when entering modify via long-press
    const [ignoreNextBackdropPress, setIgnoreNextBackdropPress] = useState(false);

    // Title modify
    const [new_title, setNew_title] = useState(title)


    const Button_OK_function = () => {
        ModifyProject(id, new_title, (success) => {
            if (success) {
                setModify(false);
                if (onChanged) onChanged();
            }
        });
    }


    // If we modify the project ---------------------------------------------
    if (modify) {
        return(
            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 10, zIndex:1, paddingHorizontal:10 }}>
                <View style={{flex:1, flexDirection:'row', alignItems:'center', gap:10}}>
                    <Image source={require('../../../../../assets/icons/Pen.png')} style={{ width: 20, height: 20, tintColor: Colors.Text_Secondary }} />

                    {/* Section text Editing */}
                    <View style={{backgroundColor:Colors.Background_Elements, borderRadius:12, flexDirection:'row', gap:10, paddingRight:10, maxWidth:'90%' }}>
                        {/* Text Input */}
                        <TextInput
                            style={[TextStyles.Paragraph, TextStyles.semiBold, TextStyles.normal, {paddingHorizontal:10}]}
                            placeholder='Project Name'
                            placeholderTextColor={Colors.Text_Secondary}
                            multiline={true}
                            numberOfLines={3}
                            textAlignVertical='top'
                            cursorColor={Colors.Text_Secondary}
                            underlineColorAndroid="transparent"
                            selectionColor={Colors.Button}
                            value={new_title}
                            onChangeText={setNew_title}
                            blurOnSubmit={true} // Prevent new lines on Enter key
                            onSubmitEditing={() => {}}
                            maxLength={20}
                        />
                        {/* Button */}
                        <Pressable onPress={Button_OK_function} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, justifyContent:'center' }]}>
                            <View style={ButtonStyles.button_modify}>
                                <Text style={[TextStyles.Paragraph, TextStyles.semiBold, {color:Colors.Background_Primary}]}>OK</Text>
                            </View>
                        </Pressable>
                    </View>
                </View>

                <Pressable onPress={() => {[setModify(false), _DeleteProject_PopIn_Open(true)]}} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, justifyContent:'center' }]}>
                    <View style={ButtonStyles.Delete}>
                        <Text style={[TextStyles.Paragraph, TextStyles.semiBold, {color:Colors.Background_Primary}]}>Delete</Text>
                    </View>
                </Pressable>
                   

                {/* PopIn --------------------*/}
                <DeleteProject_PopIn ProjectId={id} visible={DeleteProject_PopIn_Open} onClose={() => {_DeleteProject_PopIn_Open(false)}} onChanged={onChanged}/>
            </View>
        )
    }

    // If we dont modify the project ----------------------------------------
    else {
        return(
            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                <Pressable
                    style={({ pressed }) => [
                        { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10, paddingRight:50, paddingVertical:10, width:'100%', borderRadius:10, paddingHorizontal:10 },
                        pressed && { backgroundColor:Colors.Background_Elements } // Ajoute un style quand pressé
                    ]}
                    onPress={() => { navigation.navigate("Category", { id, title }); }}
                    onLongPress={() => { setIgnoreNextBackdropPress(true); setModify(true) }}
                >
                    <Image source={require('../../../../../assets/icons/Pen.png')} style={{ width: 20, height: 20, tintColor: Colors.Text_Secondary }} />
                    <Text style={[TextStyles.Paragraph, TextStyles.semiBold, TextStyles.normal]}>{title}</Text>
                </Pressable>

                {/* PopIn --------------------*/}
                <DeleteProject_PopIn ProjectId={id} visible={DeleteProject_PopIn_Open} onClose={() => {_DeleteProject_PopIn_Open(false)}} onChanged={onChanged}/>
            </View>
        );
    };
}