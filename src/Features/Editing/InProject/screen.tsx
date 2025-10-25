// IMPORTS ====================================================================
import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Pressable, Image, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
// Navigation récupération des données --------------------------------
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../App';
// Database ------------------------------------------------------------
import { ReadPosts } from '../../../DataBase/Posts/ReadPost';
import { NewPost } from '../../../DataBase/Posts/NewPost';
// Import Styles -------------------------------------------------------
import { Colors } from '../../../styles/theme';
import { Screens } from '../../../styles/screens';
import { TextStyles } from '../../../styles/Text';
import { ViewsStyles } from '../../../styles/Views';
// Import Components ---------------------------------------------------
import HeaderInProjects from './Components/Header';
import NavBarBack from './Components/NavBarBack';
import CathegoryView from './Components/CathegoryView';
import Posts from './Components/Posts';



type Props = NativeStackScreenProps<RootStackParamList, 'InProject'>;


// FUNCTION ====================================================================
function InProject({ route, navigation }: Props) {
    // Exctract the data from navigation
    const { id, title } = route.params;

    // Category Button Activate
    const [categoryActivate, setCategoryActivate] = useState<number | 0>(0);

    // Add A New Post function
    const AddANewPost = () => {
        const parentId = categoryActivate;
        const title = "Untitled";
        NewPost(parentId, title, '', (newId: number) => {
            // Après l'insertion, naviguer vers EditPost avec le nouvel ID
            navigation.navigate("EditPost", { id: newId, title: `Untitled` });
            // Recharger les posts pour afficher le nouveau post
            reloadPosts();
        });
    }

    // Projects State
    const [posts, setPosts] = useState<{id: number, parentId: number, title: string, text: string}[]>([]);

    // reload the project
    const reloadPosts = () => ReadPosts((allPosts) => {
        // Filtrer les posts pour n'afficher que ceux de cette catégorie
        const filteredPosts = allPosts.filter(post => post.parentId === categoryActivate);
        setPosts(filteredPosts);
    });

    // Function for interact with the data base
    useEffect(() => {
        reloadPosts();
    }, [categoryActivate]);

    // Recharger quand on revient sur la page
    const [reloadBubles, setReloadBubles] = useState(false)
    useFocusEffect(
        React.useCallback(() => {
            reloadPosts();
            setReloadBubles(value => !value);
        }, [])
    );

    // Assure le rechargement aussi via l'événement de focus de la navigation
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            reloadPosts();
        });
        return unsubscribe;
    }, [navigation, categoryActivate]);

    // Pour le chargemnent avec la Lottie
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 4000); // Simule un chargement de 2 secondes

        return () => clearTimeout(timer);
    }, []);


    // RETURN THE COMPONENT ------------------------------------------------------
    return(
        <View style={Screens.basic}>
            {/* Status Bar */}
            <StatusBar barStyle='dark-content' backgroundColor={Colors.Background_Primary}/>

            {/* Header */}
            <HeaderInProjects title={title}/>

            {/* Cathegory Filter */}
            <CathegoryView parentId={id} categoryActivate_info={categoryActivate} onCategoryPress={(id: number) => setCategoryActivate(id)}/>

            {/* Scroll View ---------------------------------------------*/}
            {categoryActivate === 0 ? (
                <Text style={[TextStyles.subText, {textAlign:'center', marginVertical:10}]}>Select a category to see posts</Text>
            ) : (
                <ScrollView style={Screens.scroll}>

                    {/* Create New Post */}
                    <View>
                        <View style={[ViewsStyles.Row_space, { paddingVertical: 10 }]}>
                            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                <Pressable
                                    onPress={() => {
                                        console.log('Button pressed, creating new post...');
                                        AddANewPost();
                                    }}
                                    style={({ pressed }) => [{opacity: pressed ? 0.5 : 1,},]}
                                    >
                                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10}}>
                                        <Image source={require('../../../../assets/icons/more.png')} style={{width:20,height:20,tintColor:Colors.ItemSecondary}} />
                                        <Text style={TextStyles.subText}>New Post</Text>
                                    </View>
                                </Pressable>
                            </View>
                        </View>


                        {/* List of posts -------------------------------------------------------------------*/}
                        {posts.length === 0 ? (
                            // Si pas de posts
                            <View style={{ alignItems:'center', justifyContent:'center'}}>
                                {isLoading ? (
                                    <LottieView
                                        source={require('../../../../assets/Lotties/loader-Instagram.json')}
                                        autoPlay
                                        loop
                                        style={{width:70, height:70}}
                                    />
                                ) : (
                                    <Text style={[TextStyles.subText, {marginTop:20}]}>No posts yet. Create your first post!</Text>
                                )}
                            </View>
                        ):(
                            // Afficher les postes
                            posts.map(post => (
                                <Posts key={post.id} id={post.id} title={post.title} reload={reloadBubles} actionAfterDelete={() => reloadPosts()}/>
                            ))
                        )}
                        
                    </View>

                    <View style={{height:100}}/>

                </ScrollView>
            )}
            {/* NavBar */}
            <NavBarBack/>

        </View>
    );
}

export default InProject;