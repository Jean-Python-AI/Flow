import { StyleSheet } from 'react-native';
import { Colors } from './theme'
import { NewProject } from '../DataBase/Projects/New';


export const PopInStyles = StyleSheet.create({
    Background : {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0)', 
    },
    Background_Bottom : {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0)', 
    },
    DeleteProject : {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -150 }, { translateY: -100 }],
        width:'80%',
        padding:30,
        gap:40,
        borderRadius: 20,
        backgroundColor: Colors.Background_Elements,
    },
    NewProject : {
        position: 'absolute',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -150 }, { translateY: -100 }],
        width:'80%',
        padding:20,
        gap:40,
        borderRadius: 20,
        backgroundColor: Colors.Background_Elements,
    },
    Bottom: {
        width:'100%',
        padding:20,
        paddingBottom:0,
        backgroundColor:Colors.Background_Primary,
        borderWidth:1,
        borderBottomWidth:0,
        borderColor:Colors.Button,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    }
});