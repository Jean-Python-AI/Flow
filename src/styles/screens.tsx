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
        backgroundColor: Colors.Background_Elements,
        flex:1,
        paddingHorizontal:10,
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
    },
    ScrollPosts: {
        borderRadius:20,
        backgroundColor:Colors.Background_Elements,
        borderWidth:2,
        borderColor:Colors.Background_Elements
    }
});