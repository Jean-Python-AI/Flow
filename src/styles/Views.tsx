import { StyleSheet } from 'react-native';
import { Colors } from './theme'


export const ViewsStyles = StyleSheet.create({
    Row_space : {
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    HeaderEditPost : {
        backgroundColor: Colors.Background_Secondary,
        paddingTop:15,
        justifyContent:'space-between',
        paddingHorizontal:5,
        flexDirection:'row',
        alignItems:'center',
    },
    Center_maxSize: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    }
});