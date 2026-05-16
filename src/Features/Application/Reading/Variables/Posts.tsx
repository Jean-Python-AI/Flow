import {useState, useEffect} from 'react';
import { Algorithme } from '../../../../DATA/Services/Algorithme/MainAlgorithme';
import { Post } from '../../../../DATA/types/Post';


// Posts Variables
export function usePost() {

    const [noMorePosts, setNoMorePosts] = useState(false);

    const [posts, addPosts] = useState<Post[]>([]);

    useEffect( () => {
        // Au premier chargement, pas de post actuel (currentPostId = undefined)
        Algorithme(
            { labelsId: [], postIdUsed: [], currentPostId: undefined }, 
            (result) => {
                if (result.error) {
                    console.error('Erreur FilterPosts:', result.error);
                    setNoMorePosts(true);
                    return;
                };
                addPosts(result.posts);
                // Si on récupère moins que la limite (10 par défaut), tester si il y a encore des posts
                if (result.posts.length > 10) {
                    AddPosts();
                };
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
        
        // Au refresh, passer undefined pour prioriser les posts peu vus (comme au premier chargement)
        const currentPostId = undefined;
        
        Algorithme(
            { labelsId, postIdUsed: [], currentPostId }, 
            (result) => {
                if (result.error) {
                    console.error('Erreur FilterPosts refresh:', result.error);
                    setNoMorePosts(true);
                    setRefreshing(false);
                    return;
                }
                addPosts(result.posts);
                // Si on récupère moins que la limite (10 par défaut), tester si il y a encore des posts
                if (result.posts.length > 10) {
                    AddPosts();
                };
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
            
            // Utiliser le dernier post affiché comme point de départ pour l'algorithme
            // (le dernier post dans la liste est celui qui est actuellement visible)
            const currentPostId = posts.length > 0 ? posts[posts.length - 1].id : undefined;

            Algorithme(
                { labelsId: [], postIdUsed: Array.from(existingIds), currentPostId }, 
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
                    setNoMorePosts(result.posts.length === 0);
                    setLoading(false);
                }
            );
        };
    };


    return { posts, viewedPosts, noMorePosts, refreshing, AddPosts, refreshPosts };
};