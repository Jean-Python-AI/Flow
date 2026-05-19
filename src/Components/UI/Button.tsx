import { StyleSheet } from 'react-native';
import { Colors } from '../../styles/theme';


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
        paddingVertical:5,
        borderRadius:10,
        paddingHorizontal:15,
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
        position:'absolute',
        height:35
    },
    RefreshButton: {
        flexDirection:'row',
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
        gap:5,
        backgroundColor:Colors.Background_Elements,
        borderWidth:2,
        borderColor: Colors.Button,
        borderRadius: 25,
        paddingHorizontal: 13,
        paddingVertical: 5,
    },

    Settings: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: Colors.Background_Elements
    },
    AddPost: {
        flex:1,
        height:50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: Colors.Background_Elements
    },

    connectionWithGoogle: {
        width:'100%',
        height:50,
        borderRadius:10,
        borderWidth:2,
        borderColor:Colors.ItemSecondary,
        alignItems:'center',
        justifyContent:'center',
        marginTop:10,
        flexDirection:'row',
        gap:10
    },
});