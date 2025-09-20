// IMPORTS ====================================================================
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StatusBar, Pressable, Image, ScrollView, Animated } from 'react-native';
// Navigation récupération des données --------------------------------
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../App';
// Database ------------------------------------------------------------
import { ReadPosts } from './DataManager/ReadPost';
import { NewPost } from './DataManager/NewPost';
// Import Styles -------------------------------------------------------
import { Colors } from '../../../styles/theme';
import { Screens } from '../../../styles/screens';
import { TextStyles } from '../../../styles/Text';
import { ViewsStyles } from '../../../styles/Views';
// Import Components ---------------------------------------------------
import HeaderInProjects from './Components/Top/Header';
import Element from './Components/Mid/elements';
import NavBarBack from './Components/Bottom/NavBarBack';
import CathegoryView from './Components/Top/CathegoryView';
import Posts from './Components/Mid/Posts';
import { ButtonStyles } from '../../../styles/Button';



type InProjectRouteProp = RouteProp<RootStackParamList, 'InProject'>;


// The import definitions
interface InProjectProps {
  route: InProjectRouteProp;
};


// FUNCTION ====================================================================
function InProject({ route }: InProjectProps) {
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

    // Navigation
    const navigation = useNavigation<any>();

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

    // for the animation if er is no post
    const [showFallback, setShowFallback] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (posts.length === 0) {
            // reset avant d'animer
            fadeAnim.setValue(0);

            const timer = setTimeout(() => {
                setShowFallback(true);

                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            }, 400);

            return () => clearTimeout(timer);
        } else {
            setShowFallback(false);
            fadeAnim.setValue(0); // reset quand il y a des posts
        }
    }, [posts]);

    useEffect(() => {
        if (showFallback) {
            Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            }).start();
        } else {
            fadeAnim.setValue(0);
        }
    }, [showFallback, categoryActivate]);


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
            <ScrollView style={Screens.scroll}>

                {/* Create New Post */}
                {categoryActivate != 0 ? (
                    <View>
                        <Element>
                            <Pressable
                            onPress={() => {
                                console.log('Button pressed, creating new post...');
                                AddANewPost();
                            }}
                            style={({ pressed }) => [{opacity: pressed ? 0.5 : 1,},]}
                            >
                                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10}}>
                                    <Image source={require('../../../../assets/icons/more.png')} style={{width:20,height:20,tintColor:Colors.Text_Secondary}} />
                                    <Text style={[TextStyles.Paragraph, TextStyles.semiBold, TextStyles.subText]}>New Post</Text>
                                </View>
                            </Pressable>
                        </Element>


                        {/* List of posts -------------------------------------------------------------------*/}
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <Posts key={post.id} id={post.id} title={post.title} dots={true} actionAfterDelete={() => reloadPosts()}/>
                            ))
                        ) : (
                            showFallback && (
                                <Animated.View style={{ marginTop:50, padding:20, borderRadius:20, width: '100%', backgroundColor:Colors.Background_Elements, opacity: fadeAnim }}>
                                    <View style={{paddingBottom:20, alignItems:'center'}}>
                                        <Text style={[ TextStyles.SubTitle, TextStyles.medium, TextStyles.subText ]}>No Post</Text>
                                    </View>
                                    <Pressable style={({pressed}) => ([ButtonStyles.ButtonBase, {backgroundColor: pressed ? Colors.Text_Secondary : Colors.Button}])} onPress={() => AddANewPost()}>
                                        <Text style={[TextStyles.Paragraph, TextStyles.medium]}>Creat a Post</Text>
                                    </Pressable>
                                </Animated.View>
                            )                    
                        )}
                    </View>
                ) : (
                    showFallback && (
                        <Animated.View style={{flexDirection:'row', paddingLeft:20, opacity: fadeAnim}}>
                            <Image source={require('../../../../assets/icons/Row_curve.png')} style={{width:50, height:50, marginTop:-25, tintColor:Colors.text, transform:[{ scaleX: -1 }]}}/>
                            <Text style={[TextStyles.SubTitle, TextStyles.bold]}>Creat a Category</Text>
                        </Animated.View>
                    )
                )}



                <View style={{height:100}}/>

            </ScrollView>
            {/* NavBar */}
            <NavBarBack/>

        </View>
    );
}

export default InProject;