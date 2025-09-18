import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Pressable, Image } from 'react-native';
// Navigation récupération des données --------------------------------
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
// Database ------------------------------------------------------------
import { ReadPosts } from '../DataBase/Posts/Read';
import { NewPost } from '../DataBase/Posts/New';
// Import Styles
import { Colors } from '../styles/theme';
import { Screens } from '../styles/screens';
import { ScrollView } from 'react-native-gesture-handler';
import { TextStyles } from '../styles/Text';
// Import Components ---------------------------------------------------
import HeaderInProjects from '../components/Headers/InProject';
import Element from '../components/Projects/elements';
import NewProjectPopIn from '../components/PopIns/NewProject';
import NavBarBack from '../components/NavBar/NavBarBack';
import CathegoryFilter from '../components/Filter/CathegoryFilter';
import Posts from '../components/Projects/Posts';



type InProjectRouteProp = RouteProp<RootStackParamList, 'InProject'>;


interface InProjectProps {
  route: InProjectRouteProp;
};



// =======================================================================
// Function InProject ----------------------------------------------------
//========================================================================

function Category({ route }: InProjectProps) {
    // Exctract the data from navigation
    const { id, title } = route.params;

    // Category Activate
    const [categoryActivate, setCategoryActivate] = useState<number | null>(null);
    
    // Information in Project
    const [post, modifyPost] = useState<{id:number, parentId:number, title:string, text:string }[]>([]);
    // Add A New Post function
    const AddANewPost = () => {
        const parentId = categoryActivate || 0;
        const title = "Untitled";
        NewPost(parentId, title, '', (newId: number) => {
            // Après l'insertion, naviguer vers EditPost avec le nouvel ID
            navigation.navigate("EditPost", { id: newId, title: `Untitled ${newId}` });
            // Recharger les posts pour afficher le nouveau post
            reloadPosts();
        });
    }

    // Navigation
    const navigation = useNavigation<any>();
    // Pop In New State
    const [NewProjectPopIn_IsVisible, modify_NewProjectPopIn_IsVisible] = useState(false);
    // Projects State
    const [posts, setPosts] = useState<{id: number, parentId: number, title: string, text: string}[]>([]);
    // reload the project
    const reloadPosts = () => ReadPosts((allPosts) => {
        // Filtrer les posts pour n'afficher que ceux de cette catégorie
        const filteredPosts = allPosts.filter(post => post.parentId === categoryActivate || 0);
        setPosts(filteredPosts);
    });

    // Function for interact with the data base
    useEffect(() => {
        reloadPosts();
    }, [categoryActivate]);

    // Recharger quand on revient sur la page
    useFocusEffect(
        React.useCallback(() => {
            reloadPosts();
        }, [categoryActivate])
    );

    // Return the component ---------------------------------------------
    return(
        <View style={Screens.basic}>
            {/* Status Bar */}
            <StatusBar barStyle='dark-content' backgroundColor={Colors.Background_Primary}/>

            {/* Header */}
            <HeaderInProjects title={title}/>

            {/* Cathegory Filter */}
            <CathegoryFilter parentId={id} onCategoryPress={(id: number) => setCategoryActivate(id)}/>

            {/* Scroll View ---------------------------------------------*/}
            <ScrollView style={Screens.scroll}>

                {/* Create New Post */}
                <Element>
                    <Pressable
                      onPress={() => {
                        console.log('Button pressed, creating new post...');
                        AddANewPost();
                      }}
                      style={({ pressed }) => [{opacity: pressed ? 0.5 : 1,},]}
                      >
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10}}>
                            <Image source={require('../../assets/icons/more.png')} style={{width:20,height:20,tintColor:Colors.Text_Secondary}} />
                            <Text style={[TextStyles.Paragraph, TextStyles.semiBold, TextStyles.subText]}>New Post</Text>
                        </View>
                    </Pressable>
                </Element>

                <View style={{height:30}}/>


                {/* List of posts */}
                {posts.map(post => (
                    <Posts key={post.id} id={post.id} title={post.title} dots={true} onChanged={reloadPosts}/>
                ))}



                <View style={{height:100}}/>

            </ScrollView>
            {/* NavBar */}
            <NavBarBack/>

            {/* Pop In */}
            <NewProjectPopIn visible={NewProjectPopIn_IsVisible} onClose={() => modify_NewProjectPopIn_IsVisible(false)}/>

        </View>
    );
}

export default Category;