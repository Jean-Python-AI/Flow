import { StyleSheet } from 'react-native';
import { Colors } from './theme'


export const ViewsStyles = StyleSheet.create({
    Row_space : {
        flexDirection:'row',
        justifyContent:'space-between'
    },
    HeaderEditPost : {
        backgroundColor: Colors.Background_Secondary,
        paddingTop:15,
        justifyContent:'space-between',
        paddingHorizontal:5,
        flexDirection:'row',
        alignItems:'center',
    }
});