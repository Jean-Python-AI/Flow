import { StyleSheet } from 'react-native';
import { Colors } from './theme'


export const TextStyles = StyleSheet.create({
    TextInput : {
        width:'79%',
        backgroundColor:Colors.Background_Primary,
        borderRadius:10,
        paddingHorizontal:10,
        paddingVertical:0,
        borderWidth:2,
        borderColor:Colors.Button,
        height:44,
    },

    normal : {
        color:Colors.text,
    },
    subText : {
        color:Colors.Text_Secondary,
    },

    Title : {
        fontSize:22
    },
    SubTitle : {
        fontSize:18,
    },
    Paragraph : {
        fontSize:14,
    },

    italic_light: {
        fontStyle: 'italic',
        fontWeight: '400',
    },
    italic_medium: {
        fontStyle: 'italic',
        fontWeight: '500',
    },
    italic_bold: {
        fontStyle: 'italic',
        fontWeight: '700',
    },

    light: {
        fontWeight: '400',
    },
    medium: {
        fontWeight: '500',
    },
    semiBold: {
        fontWeight: '600',
    },
    bold: {
        fontWeight: '700',
    },
    align_center: {
        textAlign: 'center',
    }
});