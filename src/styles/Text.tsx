import { StyleSheet } from 'react-native';
import { Colors } from './theme'


export const TextStyles = StyleSheet.create({
    TextInput : {
        width:'79%',
        backgroundColor:Colors.Background_Primary,
        borderRadius:10,
        paddingLeft:15,
        paddingVertical:0,
        borderWidth:2,
        borderColor:Colors.Button,
        height:44,
    },
    TextInputLogin: {
        width:'100%',
        backgroundColor:Colors.Background_Primary,
        borderWidth:2,
        borderColor:Colors.Button,
        borderRadius:10,
        paddingHorizontal:10,
        justifyContent:'center',
        height:44,
    },
    TitlePost: {
        fontSize: 18,
        fontWeight: 700,
        color: Colors.text,
        fontFamily: 'Ubuntu-Bold',
    },
    TextPost: {
        fontSize: 16,
        color: Colors.Text_Posts,
        fontFamily: 'Ubuntu-Medium'
    },
    TextWriting: {
        fontSize: 16,
        fontFamily: 'Ubuntu-Light'
    },
    MoreButton: {
        fontSize: 16,
        fontWeight: 600,
        color: Colors.text,
        fontFamily: 'Ubuntu-Medium'
    },
    TextBlack: {
        fontSize: 16,
        fontFamily: 'Ubuntu-Medium'
    },
    Title : {
        fontSize:20,
        color: Colors.text,
        fontFamily: 'Ubuntu-Bold',
    },
    SubTitle : {
        fontSize:20,
        color: Colors.ItemSecondary,
        fontFamily: 'Ubuntu-Bold',
    },
});