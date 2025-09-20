import { StyleSheet } from 'react-native';
import { Colors } from './theme';


export const ButtonStyles = StyleSheet.create({
    ButtonBase: {
        backgroundColor:Colors.Button,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        gap:10,
        paddingVertical:10,
        borderRadius:10,
        paddingHorizontal:40,
        width:'100%',
    },
    ButtonBase_simple: {
        backgroundColor:Colors.Button,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        gap:10,
        paddingVertical:8,
        borderRadius:10,
        paddingHorizontal:20,
    },
    cathegoryFilter: {
        paddingVertical:5,
        minWidth:35,
        paddingHorizontal:10,
        borderRadius:50,
        borderWidth:2,
        borderColor: Colors.Button,
        alignItems:'center',
    },
    editPostBarr_Button: {
        height:"100%",
        borderRadius:20,
        backgroundColor:Colors.Button,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        paddingHorizontal:12,
        borderWidth:0.5,
        borderColor:Colors.Background_Primary,
        gap:5,
    },
    button_modify: {
        backgroundColor:Colors.text,
        paddingHorizontal:7,
        paddingVertical:3,
        borderRadius:7,
    },
    Delete: {
        backgroundColor:Colors.Red_Background,
        paddingHorizontal:10,
        paddingVertical:7,
        borderRadius:12,
    },
    Posts_InProject: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
        paddingRight:50,
        paddingVertical:10,
        width:'100%',
        borderRadius:10,
        paddingHorizontal:10
    }
});