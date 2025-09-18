import { StyleSheet } from 'react-native';
import { Colors } from './theme'


export const Screens = StyleSheet.create({
    basic : {
        backgroundColor: Colors.Background_Primary,
        flex:1,
    },
    scroll : {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 80,
        paddingHorizontal: 20
    },
    editPost : {
        backgroundColor: Colors.Background_Secondary,
        flex:1,
        paddingHorizontal:20,
    },
    editPost_TextZone : {
        backgroundColor: Colors.Background_Primary,
        borderRadius: 25,
        padding:15,
        flex:1,
        textAlignVertical:'top',
        marginTop:10,
        marginBottom:20,
    }
});