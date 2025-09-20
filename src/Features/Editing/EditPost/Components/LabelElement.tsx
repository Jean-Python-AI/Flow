// IMPORT =====================================================
import React from 'react';
import { Text, View, Pressable } from 'react-native';
// Styles ----------------------------------
import { ButtonStyles } from '../../../../styles/Button';
import { Colors } from '../../../../styles/theme';
import { TextStyles } from '../../../../styles/Text';
// DataBase --------------------------------
import { LinkPostLabel } from '../DataManager/New_Post_Label';



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

    const Make_LinkPostLabel = () => {
        LinkPostLabel(PostId, id, callback);
    };


    // RETURN ===============================================
    return (
        <Pressable
            style={({pressed})=>([
                ButtonStyles.Posts_InProject,
                {backgroundColor: pressed? Colors.Background_Elements : Colors.Background_Primary, marginVertical:5},
                activateIds?.includes(id) && {borderWidth:2, borderColor:Colors.Button}
            ])}
            onPress={Make_LinkPostLabel}
        >
            <View style={{backgroundColor:color, height:SizeColorRounds, width:SizeColorRounds, borderRadius:SizeColorRounds/2}}/>
            <Text style={[TextStyles.Paragraph, TextStyles.medium]}>{name} {id} {PostId}</Text>
        </Pressable>
    )
};