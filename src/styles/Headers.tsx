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
        backgroundColor: Colors.Background_Elements,
        height:45,
        borderRadius:25,
        paddingHorizontal:5,
        paddingVertical:5,
        gap:10,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row',
    },
    editPostBarrContainer : {
        paddingHorizontal:20,
        alignItems:'center',
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
        zIndex: 100, // élevé pour passer au-dessus
    },
});