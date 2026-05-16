import { useState } from 'react';
import { Post } from '../../types/Post';
import { insertPost, updatePost, deletePost } from '../../DataBase/postsRepository';
import { useTableS } from '../Algorithme/TableS';

// Hook to read posts informations
export function useEditPost() {

    // Hooks
    const { createNewPost } = useTableS();

    // Add a new post
    const AddPostHook = async (title: string, text: string) => {
        try {
            const newId = await insertPost(title, text);
            createNewPost(newId);
            console.log('Post ajouté avec succès', newId);
            return newId;
        } catch (error) {
            console.error('Erreur insertPost:', error);
            throw error;
        }
    };

    // Update post avec gestion d'erreur améliorée
    const UpdatePostHook = async (id: number, title: string, text: string): Promise<void> => {
        try {
            // Validation des paramètres
            if (!id || typeof id !== 'number' || isNaN(id)) {
                console.error('Erreur UpdatePostHook: id invalide', id);
                throw new Error('ID invalide pour mettre à jour le post');
            }
            
            await updatePost(id, title, text);
            console.log('Post mis à jour avec succès');
        } catch (error) {
            console.error('Erreur updatePost:', error);
            throw error;
        }
    };

    // Delete post avec gestion d'erreur améliorée
    const DeletePostHook = async (id: number): Promise<void> => {
        try {
            // Validation des paramètres
            if (!id || typeof id !== 'number' || isNaN(id)) {
                console.error('Erreur DeletePostHook: id invalide', id);
                throw new Error('ID invalide pour supprimer le post');
            }
            
            await deletePost(id);
            console.log('Post supprimé avec succès');
        } catch (error) {
            console.error('Erreur deletePost:', error);
            throw error;
        }
    };

    return { AddPostHook, UpdatePostHook, DeletePostHook };
};