import { StyleSheet } from 'react-native';
import { Colors } from './theme';


export const ButtonStyles = StyleSheet.create({
    Base_maxWidth: {
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
    Base: {
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
    BlackLittle: {
        backgroundColor:Colors.text,
        paddingHorizontal:7,
        paddingVertical:3,
        borderRadius:7,
    },
    Delete: {
        backgroundColor:Colors.Red,
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:12,
    },
    Elements: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
        paddingRight:50,
        paddingVertical:10,
        width:'100%',
        borderRadius:10,
        paddingHorizontal:10
    },

    Refresh: {
        flexDirection: 'row',
        position: 'absolute',
        alignItems:'center',
        justifyContent:'center',
        gap: 15,
        top: 80,
        right: '25%',
        width:'50%',
        height: 40,
        backgroundColor: Colors.Background_Elements,
        opacity:1,
        borderWidth: 2,
        borderColor: Colors.Button,
        borderRadius: 100,
        paddingHorizontal: 10,
        paddingVertical: 6,
    }
});