import { useState } from 'react';
import { Label } from '../../types/Label';
import { insertLabel, addLinkPostLabel, updateLabel, deleteLinkPostLabel, deleteLabel } from '../../DataBase/labelsRepository';

// Hook to read labels informations
export function useEditLabel(refresh:number) {
    
    // Create a new label avec gestion d'erreur améliorée
    const addLabel = async (name: string, color?: string): Promise<void> => {
        try {
            // Validation des paramètres
            if (!name || typeof name !== 'string' || name.trim().length === 0) {
                console.error('Erreur addLabel: name invalide');
                throw new Error('Le nom du label est requis');
            }
            
            await insertLabel(name, color ? color : '');
            console.log('Label ajouté avec succès');
        } catch (error) {
            console.error('Erreur insertLabel:', error);
            // Re-throw pour que le composant puisse gérer l'erreur si nécessaire
            throw error;
        }
    };

    // Link a post to a label avec gestion d'erreur améliorée
    const LinkPostLabel = async (postId: number, labelId: number): Promise<void> => {
        try {
            // Validation des paramètres
            if (!postId || !labelId || typeof postId !== 'number' || typeof labelId !== 'number') {
                console.error('Erreur LinkPostLabel: paramètres invalides', { postId, labelId });
                throw new Error('Paramètres invalides pour lier le post au label');
            }
            
            await addLinkPostLabel(postId, labelId);
            console.log('Post linked to label successfully');
        } catch (error) {
            console.error('Erreur LinkPostLabel:', error);
            throw error;
        }
    };

    // Unlink a post from a label avec gestion d'erreur améliorée
    const UnlinkPostLabel = async (postId: number, labelId: number): Promise<void> => {
        try {
            // Validation des paramètres
            if (!postId || !labelId || typeof postId !== 'number' || typeof labelId !== 'number') {
                console.error('Erreur UnlinkPostLabel: paramètres invalides', { postId, labelId });
                throw new Error('Paramètres invalides pour délier le post du label');
            }
            
            await deleteLinkPostLabel(postId, labelId);
            console.log('Post unlinked from label successfully');
        } catch (error) {
            console.error('Erreur UnlinkPostLabel:', error);
            throw error;
        }
    }

    // Update a label avec gestion d'erreur améliorée
    const EditLabel = async (id: number, name: string, color?: string): Promise<void> => {
        try {
            // Validation des paramètres
            if (!id || typeof id !== 'number' || !name || typeof name !== 'string') {
                console.error('Erreur EditLabel: paramètres invalides', { id, name });
                throw new Error('Paramètres invalides pour modifier le label');
            }
            
            await updateLabel(id, name, color);
            console.log('Label mis à jour avec succès');
        } catch (error) {
            console.error('Erreur EditLabel:', error);
            throw error;
        }
    };

    // Delete a label avec gestion d'erreur améliorée
    const DeleteLabel = async (id: number): Promise<void> => {
        try {
            // Validation des paramètres
            if (!id || typeof id !== 'number') {
                console.error('Erreur DeleteLabel: id invalide', id);
                throw new Error('ID invalide pour supprimer le label');
            }
            
            await deleteLabel(id);
            console.log('Label supprimé avec succès');
        } catch (error) {
            console.error('Erreur DeleteLabel:', error);
            throw error;
        }
    };

    return { addLabel, LinkPostLabel, UnlinkPostLabel, EditLabel, DeleteLabel };
};