import { Label } from '../../types/Label';
import { getAllLabels, getLabelsByPostId, getLabelsByIds } from '../../DataBase/labelsRepository';

// Hook to read labels informations
export function useLabel() {

    // Get all labels avec gestion d'erreur robuste
    const getAllLabelsHook = async (): Promise<Label[]> => {
        try {
            const data = await getAllLabels();
            console.log('Labels récupérés avec succès');
            return data;
        } catch (error) {
            console.error('Erreur dans getAllLabelsHook:', error);
            // Retourner un tableau vide au lieu de throw pour éviter les crashes
            // L'app peut continuer à fonctionner même si les labels ne se chargent pas
            return [];
        }
    };

    // get labels by post ID avec gestion d'erreur robuste
    const getLabelsByPostIDHook = async (postId: number): Promise<Label[]> => {
        try {
            // Validation du paramètre
            if (!postId || typeof postId !== 'number' || isNaN(postId)) {
                console.warn('getLabelsByPostIDHook: postId invalide', postId);
                return [];
            }
            
            const data = await getLabelsByPostId(postId);
            return data;
        } catch (error) {
            console.error('Erreur dans getLabelsByPostIDHook:', error);
            // Retourner un tableau vide au lieu de throw pour éviter les crashes
            return [];
        }
    };
    
    // Get labels by a list of IDs avec gestion d'erreur robuste
    const getLabelsByIdsHook = async (labelIds: number[]): Promise<Label[]> => {
        try {
        // Validation des paramètres
        if (!labelIds || !Array.isArray(labelIds) || labelIds.length === 0 || labelIds.some(id => typeof id !== 'number' || isNaN(id))) {
            console.warn('getLabelsByIdsHook: labelIds invalide', labelIds);
            return [];
        }
        const data = await getLabelsByIds(labelIds);
        console.log('Labels by IDs récupérés avec succès');
        return data;
        } catch (error) {
        console.error('Erreur dans getLabelsByIdsHook:', error);
        // Retourner un tableau vide au lieu de throw pour éviter les crashes
        return [];
        }
    };

    return { getAllLabelsHook, getLabelsByPostIDHook, getLabelsByIdsHook }
};