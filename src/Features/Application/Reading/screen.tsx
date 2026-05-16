// External Biblioteque
import React, {useState, useEffect, useCallback, useRef} from 'react';
import { View, FlatList, Text, StatusBar, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';
// Styles
import { Screens } from '../../../styles/screens';
import { TextStyles } from '../../../styles/Text';
import { Colors } from '../../../styles/theme';
// Utils
import { setStatusBarColorNative } from '../../../utils/StatusBarNative';
// Local Components
import Post_Text from './Components/Posts/Post';
import BottomBar from './Components/BottomBar';
import CathegoryView from './Components/CathegoryView';
import RefreshPopIn from './Components/PopIn/PopInRefresh';
// Data
import { Post } from '../../../DATA/types/Post';
import { useLabels } from './Variables/Labels';
import { usePost } from './Variables/Posts';
import PopInDelete from './Components/PopIn/PopInDeletePost';
import PopInLabels from './Components/PopIn/PopInLabels';
import EmptySection from './Components/EmptySection';








// Screen
function PostScroll() {
    // Init values
    const [refresh, setRefresh] = useState(0)
    const { posts, noMorePosts, refreshing, AddPosts, refreshPosts } = usePost();
    const { labelActivate, setLabels } = useLabels();

    //PopIns
    const [LabelsPopInVisible, setLabelsPopInVisible] = useState(false);
    const [DeletePopInVisible, setDeletePopInVisible] = useState(false);
    const [idPost, setIdPost] = useState(0);
    // État pour le popover contextuel (ID du post qui a le popover ouvert)
    const [popoverPostId, setPopoverPostId] = useState<number | null>(null);
    
    // Fonction pour actver les popIns
    const handleDeletePopIn = useCallback((id:number)=>{
        setDeletePopInVisible(true);
        setIdPost(id);
    }, []);
    const handleLabelsPopIn = useCallback((id:number)=>{
        // Si le même post est cliqué, fermer le popover, sinon l'ouvrir
        setPopoverPostId(currentId => currentId === id ? null : id);
    }, []);
    
    // Fermer le popover
    const closePopover = useCallback(() => {
        setPopoverPostId(null);
    }, []);


    // Montre le fix component pour recherger la page
    const [firstLoad, setFirstLoad] = useState(true);
    const [refreshPopIn, setRefreshPopIn] = useState(false);
    const refreshPopInTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prevLabelActivateLength = useRef(labelActivate.length);
    
    useEffect(() => {
        if (firstLoad) {
            setFirstLoad(false);
            prevLabelActivateLength.current = labelActivate.length;
        } else {
            const currentLength = labelActivate.length;
            const prevLength = prevLabelActivateLength.current;
            
            // Afficher la PopInRefresh uniquement si c'est une sélection (longueur augmente)
            // Ne pas l'afficher si c'est une désélection (longueur diminue ou reste identique)
            if (currentLength > prevLength) {
                // Annuler le timer précédent si on clique rapidement plusieurs fois
                if (refreshPopInTimerRef.current) {
                    clearTimeout(refreshPopInTimerRef.current);
                }
                // Fermer la popIn si elle est ouverte avant d'en ouvrir une nouvelle
                setRefreshPopIn(false);
                
                refreshPopInTimerRef.current = setTimeout(() => {
                    setRefreshPopIn(true);
                    refreshPopInTimerRef.current = null;
                }, 100);
            } else {
                // Si c'est une désélection, ne rien faire (ne pas afficher la PopIn)
                // Annuler tout timer en cours
                if (refreshPopInTimerRef.current) {
                    clearTimeout(refreshPopInTimerRef.current);
                    refreshPopInTimerRef.current = null;
                }
                setRefreshPopIn(false);
            }
            
            prevLabelActivateLength.current = currentLength;
            
            return () => {
                if (refreshPopInTimerRef.current) {
                    clearTimeout(refreshPopInTimerRef.current);
                }
            };
        };
    }, [labelActivate]);

    // Waiter
    const waitAfterReloadNewPosts = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    // Loading
    const [showNoPosts, setShowNoPosts] = useState(false);

    useEffect(() => {
        setShowNoPosts(false);

        const timer_ = setTimeout(() => {
            setShowNoPosts(true);
        }, 1500);
    }, [labelActivate]);

    // pour revenir en haut de page pour le chargement
    const flatListRef = React.useRef<FlatList<Post>>(null);
    
    // Détecter quand un item devient invisible pour fermer le popover
    const viewabilityConfig = React.useRef({
        itemVisiblePercentThreshold: 50,
        minimumViewTime: 100,
    }).current;
    
    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<{ item: Post; isViewable: boolean | null }> }) => {
        if (popoverPostId !== null) {
            // Vérifier si le post avec le popover ouvert est toujours visible
            const isPostVisible = viewableItems.some(
                viewableItem => viewableItem.item.id === popoverPostId && viewableItem.isViewable === true
            );
            if (!isPostVisible) {
                closePopover();
            }
        }
    }, [popoverPostId, closePopover]);

    // refresh la page à chaque fois que l'ont reviens dessus
    useFocusEffect(
        React.useCallback(() => {
            // Code exécuté à chaque fois que la page est visible
            setRefresh(r => r + 1);
            setRefreshPopIn(false);

            // Configuration de la StatusBar pour cet écran
            if (Platform.OS === 'android') {
                StatusBar.setTranslucent(false);
                StatusBar.setBarStyle('dark-content', true);
                setStatusBarColorNative(Colors.Background_Primary);
            } else {
                StatusBar.setBarStyle('dark-content', true);
            }

            // Cleanup: restaurer la StatusBar par défaut quand on quitte l'écran
            return () => {
                if (Platform.OS === 'android') {
                    StatusBar.setTranslucent(false);
                    StatusBar.setBarStyle('dark-content', true);
                    setStatusBarColorNative(Colors.Background_Primary);
                } else {
                    StatusBar.setBarStyle('dark-content', true);
                }
            };
        }, [labelActivate])
    );


    return (
            <View style={Screens.basic}>

            <CathegoryView 
                onLabelsPress={(idLabel: number) => setLabels(idLabel)}
                refreshPosts={()=> {refreshPosts(labelActivate);}}
                refreshing={posts}
            />

            <View style={[Screens.ScrollPosts, {flex:1}]}>
                <FlatList
                    ref={flatListRef}
                    style={{borderRadius:17}}
                    showsVerticalScrollIndicator={false}

                    // Take the posts without the empty posts
                    data={posts}
                    // Key element
                    keyExtractor={(item) => item.id.toString()}
                        
                    removeClippedSubviews={true} //
                    initialNumToRender={5} // évite le rendu de 20 éléments d'un coup
                    maxToRenderPerBatch={10} // batchs de rendu plus petits
                    windowSize={5} // plus petit buffer = moins de mémoire
                    updateCellsBatchingPeriod={100} // plus lent à updater = plus fluide visuellement
                    
                    // Détecter la visibilité des items pour fermer le popover
                    viewabilityConfig={viewabilityConfig}
                    onViewableItemsChanged={onViewableItemsChanged}

                    // Posts
                    renderItem={({item}) => {
                        // Posts
                        return (
                            <Post_Text
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                text={item.text}
                                date={item.formatedDate}
                                reload={refresh}
                                DeletePopInVisible={handleDeletePopIn}
                                LabelsPopInVisible={handleLabelsPopIn}
                                showPopover={popoverPostId === item.id}
                                onClosePopover={closePopover}
                            />
                        );
                    }}
                    // ExtraData pour forcer le re-render uniquement quand refresh change
                    extraData={refresh}

                    refreshing={refreshing}
                    onRefresh={() => {refreshPosts(labelActivate); setRefresh(set=>set+1)}}

                    onEndReachedThreshold={0.2}
                    onEndReached={() => {
                        if (!noMorePosts) {
                            AddPosts();
                        }
                    }}

                    onScrollBeginDrag={() => {
                        // si l'utilisateur repart avant la fin → annule le timer
                        if (waitAfterReloadNewPosts.current) {
                            clearTimeout(waitAfterReloadNewPosts.current);
                            waitAfterReloadNewPosts.current = null;
                        }
                    }}

                    ListFooterComponent={() => {
                        // Fake Post and button to make a new Post
                        if (noMorePosts && posts.length !== 0) return (
                            <View style={{width:'100%', height:300}}>
                                <Text style={[TextStyles.TextPost, {textAlign:'center', marginTop:20}]}>No more posts</Text>
                            </View>
                        );
                        // Loader
                        if (posts.length > 0) return (
                            <View style={{ alignItems:'center', width:'100%', height:80}}>
                                <LottieView
                                    source={require('../../../../assets/Lotties/loader-Instagram.json')}
                                    autoPlay
                                    loop
                                    style={{width:80, height:80}}
                                />
                            </View>
                        );
                        else return null;
                    }}


                    ListEmptyComponent={() => {
                        return (
                            <EmptySection/>
                        );
                    }}

                />
                {/* PopIns */}
                <RefreshPopIn onRefresh={()=> {flatListRef.current?.scrollToOffset({ offset: 0, animated: true }); refreshPosts(labelActivate);}} visible={refreshPopIn} onClose={()=> {setRefreshPopIn(false)}}/>
            </View>

            <BottomBar empty={posts.length === 0}/>

            {/* PopIns */}
            <PopInLabels idPost={idPost} visible={LabelsPopInVisible} reLoadLabels={refresh} onClose={()=>setLabelsPopInVisible(false)}/>
            <PopInDelete idPost={idPost} visible={DeletePopInVisible} onDelete={()=> {flatListRef.current?.scrollToOffset({ offset: 0, animated: true }); refreshPosts(labelActivate);}} onClose={()=>setDeletePopInVisible(false)}/>

        </View>
    );
}


export default React.memo(PostScroll);