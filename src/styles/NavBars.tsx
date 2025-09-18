import { StyleSheet } from 'react-native';
import { Colors } from './theme'


export const navBarStyle = StyleSheet.create({
    basic : {
        backgroundColor: Colors.Background_Primary,
        paddingBottom: 20,
        position: 'absolute',
        zIndex:100,
        bottom:0,
        left:0,
        right:0,
        justifyContent:'space-around',
        alignItems:'center',
    },
    simpleTab: {
        height: 80,
        borderTopWidth: 0,
        elevation: 0,
        backgroundColor: Colors.Background_Primary,
    },
});