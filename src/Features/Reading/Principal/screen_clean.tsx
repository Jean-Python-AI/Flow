// External Biblioteque
import React, {useState, useEffect, use} from 'react';
import { View, FlatList, Text } from 'react-native';
import LottieView from 'lottie-react-native';
// Data
import { ReadPosts } from '../../../DataBase/Posts/ReadPost';
import { FilterPosts, Post } from '../../../DataBase/Posts/Algorithme';
import { WorkSpaceActivate } from '../../../DataBase/WorkSpace/WorkSpaceActivate';
// Styles
import { Screens } from '../../../styles/screens';
import { Colors } from '../../../styles/theme';
// Local Components
import Post_Text from './Components/Posts/Post_Text';
import Post_ImageText from './Components/Posts/Post_ImageText';
import CathegoryView from './Components/CathegoryView';
import { TextStyles } from '../../../styles/Text';
import RefreshPopIn from './Components/PopInRefresh';



// Labels Variables
function useLabels() {
    const [labelActivate, setLabelActivate] = useState<number[]>([]);

    const setLabels = (labelId: number) => {
        if (labelId === -1) {
            setLabelActivate(prev =>
                prev.includes(-1)
                    ? prev.filter(id => id !== -1) // si déjà activé, on retire
                    : [...prev.filter(id => id !== 0), -1] // sinon on ajoute
            );
            return;
        } else if (labelId === 0) {
            setLabelActivate(prev =>
                prev.includes(0)
                    ? prev.filter(id => id !== 0) // si déjà activé, on retire
                    : [...prev.filter(id => id !== -1), 0] // sinon on ajoute
            );
            return;
        } else {
            setLabelActivate(prev =>
                prev.includes(labelId)
                    ? prev.filter(id => id !== labelId) // si déjà activé, on retire
                    : [...prev, labelId] // sinon on ajoute
            );
            return;
        }
    };

    return { labelActivate, setLabelActivate, setLabels };
};



// Posts Variables
function usePost(refresh:number) {
    const [idWorkSpaceActivate, setIdWorkSpaceActivate] = useState(WorkSpaceActivate.getState().id || -1);
    useEffect(() => {
        setIdWorkSpaceActivate(WorkSpaceActivate.getState().id); // update à chaque refresh
    }, [refresh]);

    const [noMorePosts, setNoMorePosts] = useState(false);

    const [posts, addPosts] = useState<Post[]>([]);

    useEffect( () => {
        FilterPosts(
            { labelsId: [], postIdUsed: [] }, 
            (result) => {
                if (result.error) {
                    console.error('Erreur FilterPosts:', result.error);
                    setNoMorePosts(true);
                    return;
                }
                addPosts(result.posts);
                // Si on récupère moins que la limite (10 par défaut), il n'y a pas plus de posts
                setNoMorePosts(result.posts.length < 10);
            }
        );
    }, []);
    
    // Viewed Posts
    const [viewedPosts, addViewedPost] = useState<number[]>([]);
    useEffect(() => {
        addViewedPost(posts.map(post => post.id));
    }, [posts]);

    // Refresh the posts and the screen
    const [refreshing, setRefreshing] = useState(false);
    const refreshPosts = async (labelsId: number[]) => {
        await addViewedPost([]);
        await setNoMorePosts(false);
        setRefreshing(true);
        
        FilterPosts(
            { labelsId, postIdUsed: [] }, 
            (result) => {
                if (result.error) {
                    console.error('Erreur FilterPosts refresh:', result.error);
                    setNoMorePosts(true);
                    setRefreshing(false);
                    return;
                }
                addPosts(result.posts);
                // Met à jour l'indicateur de fin lorsque le rafraîchissement renvoie moins que la limite
                setNoMorePosts(result.posts.length < 10);
                setRefreshing(false);
            }
        );
    };

    // Add Posts
    const [loading, setLoading] = useState(false);
    const AddPosts = async () => {
        if(loading || noMorePosts) {
            setNoMorePosts(true);
            return;
        } else {
            setLoading(true);
            
            // Utiliser les IDs déjà présents à l'écran pour exclure correctement
            const existingIds = new Set(posts.map(p => p.id));

            FilterPosts(
                { labelsId: [], postIdUsed: Array.from(existingIds) }, 
                (result) => {
                    if (result.error) {
                        console.error('Erreur FilterPosts AddPosts:', result.error);
                        setLoading(false);
                        return;
                    }

                    const rows = result.posts;
                    // Conserver uniquement les nouveaux éléments réellement nouveaux
                    const newRows = rows.filter(r => !existingIds.has(r.id));

                    if (newRows.length === 0) {
                        setNoMorePosts(true);
                        setLoading(false);
                        return;
                    }

                    setNoMorePosts(false);
                    addPosts(prevPosts => {
                        const map = new Map(prevPosts.map(p => [p.id, p]));
                        newRows.forEach(r => map.set(r.id, r));
                        return Array.from(map.values());
                    });
                    addViewedPost(Array.from(new Set([...Array.from(existingIds), ...newRows.map(r => r.id)])));
                    setLoading(false);
                }
            );
        };
    };


    return { posts, viewedPosts, noMorePosts, refreshing, AddPosts, refreshPosts };
};







// Function
function PostScroll() {
    // Init values
    const [refresh, setRefresh] = useState(0)
    const { posts, viewedPosts, noMorePosts, refreshing, AddPosts, refreshPosts } = usePost(refresh);
    const { labelActivate, setLabels } = useLabels();

    // Montre le fix component pour recherger la page
    const [refreshPopIn, setRefreshPopIn] = useState(false)
    useEffect(() => {
        const timer = setTimeout(() => {
            setRefreshPopIn(true);
        }, 500);
    }, [labelActivate]);

    // Waiter
    const waitAfterReloadNewPosts = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    // Loading
    const [loadingNewPosts, setLoadingNewPosts] = useState(false);

    const [showNoPosts, setShowNoPosts] = useState(false);

    useEffect(() => {
        setShowNoPosts(false);

        const timer_ = setTimeout(() => {
            setShowNoPosts(true);
        }, 1500);
    }, [labelActivate]);

    // pour revenir en haut de page pour le chargement
    const flatListRef = React.useRef<FlatList<Post>>(null);


    return (
            <View style={Screens.basic}>

            <CathegoryView 
                onLabelsPress={(idLabel: number) => setLabels(idLabel)}
                refreshPosts={()=> {refreshPosts(labelActivate); setRefresh(set=>set+1);}}
                refreshing={posts}
            />

            <FlatList
                ref={flatListRef}
                style={Screens.ScrollPosts}
                showsVerticalScrollIndicator={false}

                // Take the posts without the empty posts
                data={posts.filter(post => post.text && post.text.trim() !== "")}
                // Key element
                keyExtractor={(item) => item.id.toString()}
                    
                removeClippedSubviews={true}

                // Posts
                renderItem={({item}) => {
                    return (
                        <Post_Text key={item.id} id={item.id} title={item.title} text={item.text} date={item.createdAt} reload={refresh}/>
                    );
                }}

                refreshing={refreshing}
                onRefresh={() => {refreshPosts(labelActivate); setRefresh(set=>set+1)}}

                onEndReachedThreshold={0.2}
                onEndReached={() => {
                    if (!loadingNewPosts && !noMorePosts) {
                        AddPosts();
                    }
                }}

                onScrollBeginDrag={() => {
                    // si l’utilisateur repart avant la fin → annule le timer
                    if (waitAfterReloadNewPosts.current) {
                        clearTimeout(waitAfterReloadNewPosts.current);
                        waitAfterReloadNewPosts.current = null;
                    }
                }}

                ListFooterComponent={() => {
                    if (noMorePosts) return null;
                    return (
                        <View style={{ alignItems:'center', width:'100%', height:80}}>
                            <LottieView
                                source={require('../../../../assets/Lotties/loader-Instagram.json')}
                                autoPlay
                                loop
                                style={{width:80, height:80}}
                            />
                        </View>
                    );
                }}


                ListEmptyComponent={() => {
                    if (showNoPosts) return (
                        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                            <Text style={[TextStyles.SubTitle, { textAlign: 'center' }]}>
                                write your first post
                            </Text>
                        </View>
                    )
                }}

            />

            <RefreshPopIn labelActivate={labelActivate} onRefresh={()=> {flatListRef.current?.scrollToOffset({ offset: 0, animated: true }); refreshPosts(labelActivate);}} visible={refreshPopIn} onClose={()=> {setRefreshPopIn(false)}}/>

        </View>
    );
}

export default PostScroll;