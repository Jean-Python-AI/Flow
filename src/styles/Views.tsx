import { StyleSheet } from 'react-native';
import { Colors } from './theme'


export const ViewsStyles = StyleSheet.create({
    Row_space : {
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    HeaderEditPost : {
        backgroundColor: Colors.Background_Elements,
        paddingTop:15,
        justifyContent:'space-between',
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
    },
    Center_maxSize: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    SignUp_Container: {
        borderWidth: 2,
        borderColor: Colors.Button,
        backgroundColor: Colors.Background_Elements,
        width: '80%',
        margin: 30,
        borderRadius: 20,
    },
    ErrorMessage: {
        position: 'absolute',
        bottom: 25,
        backgroundColor: Colors.Red_transparent,
        padding: 10,
        width: '70%',
        borderWidth: 1,
        borderColor: Colors.Red,
        alignItems:'center',
        borderRadius:10,
    },
    ProjectElements : {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 10
    },
    BottomBar: {
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
        gap: 20
    }
});