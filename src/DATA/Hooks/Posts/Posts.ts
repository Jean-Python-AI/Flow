import { useState } from 'react';
import { Post } from '../../types/Post';
import { getAllPosts, getPostById, getPostsCount } from '../../DataBase/postsRepository';

// Hook to read posts informations
export function usePost(refresh:number) {
    const [posts, setPosts] = useState<Post[]>([]);

    // Get all posts by date descending
    const getAllPostsHook = async () => {
        getAllPosts().then((data: Post[]) => {
            return setPosts(data);
        }).catch((error) => {
            console.error('Erreur getAllPosts:', error);
            return [];
        });
    };

    // get post by ID
    const getPostByIdHook = async (postId: number) => {
        return getPostById(postId).then((data: { data: Post } | null) => {
            return data;
        }).catch((error) => {
            console.error('Erreur getPostById:', error);
            return null;
        });
    };

    // Count number of posts
    const getNumberOfPostsHook = async () => {
        return getPostsCount().then((data: number) => {
            return data;
        }).catch((error) => {
            console.error('Erreur getNumberOfPosts:', error);
            return 0;
        });
    };

    return { posts, getAllPostsHook, getPostByIdHook, getNumberOfPostsHook };
};