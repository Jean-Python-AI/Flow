import { StyleSheet } from 'react-native';
import { Colors } from './theme'


export const Screens = StyleSheet.create({
    basic : {
        backgroundColor: Colors.Background_Primary,
        flex:1,
        paddingVertical:0,
        paddingTop:25,
    },
    scroll : {
        flex: 1,
        paddingTop: 0,
        paddingBottom: 80,
        paddingHorizontal: 20
    },
    editPost : {
        backgroundColor: Colors.Background_Elements,
        flex:1,
        paddingHorizontal:10,
        paddingVertical:0,
        paddingTop:25,
    },
    editPost_TextZone : {
        backgroundColor: Colors.Background_Primary,
        borderTopRightRadius: 25,
        borderTopLeftRadius:25,
        padding:15,
        paddingBottom:0,
        flex:1,
        textAlignVertical:'top',
        marginTop:10
    },
    Load : {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:0,
    },
    ScrollPosts: {
        borderRadius:20,
        backgroundColor:Colors.Background_Elements,
        padding:3
    },
    ReadSection: {
        borderRadius: 20,
    }
});