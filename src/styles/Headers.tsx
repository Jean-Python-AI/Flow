import { StyleSheet } from 'react-native';
import { Colors } from './theme'


export const HeadersStyle = StyleSheet.create({
    basic : {
        backgroundColor: Colors.Background_Primary,
        padding: 20
    },
    cathegoryViewContainer : {
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 10,
    },
    editPostBarr : {
        backgroundColor: Colors.Background_Secondary,
        width:'100%',
        height:50,
        borderRadius:20,
        paddingHorizontal:10,
        paddingVertical:10,
        gap:10,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row',
    },
});