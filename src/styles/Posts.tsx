import { StyleSheet } from 'react-native';
import { Colors } from './theme';



export const PostsStyles = StyleSheet.create({
    Post_Text: {
        width:'100%',
        padding:20,
        paddingTop:40,
        borderBottomWidth:2,
        borderBottomColor:Colors.Background_Elements,
        backgroundColor: Colors.Background_Primary,
        borderRadius:17,
        gap:20
    },
    Post_ImageText: {
        width:'100%',
        padding:0,
        borderBottomWidth:2,
        borderBottomColor:Colors.Background_Elements,
        backgroundColor: Colors.Background_Primary,
        borderRadius:25,
        overflow: "hidden"
    },
});