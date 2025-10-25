import db from '../dataBase';

// Types pour une meilleure type safety
export interface Post {
    id: number;
    parentId: number;
    title: string;
    text: string;
    createdAt: number;
}

export interface FilterPostsOptions {
    labelsId: number[];
    postIdUsed: number[];
    limit?: number;
}

export interface FilterPostsResult {
    posts: Post[];
    error?: string;
}

// Constantes pour les types de tri
const SORT_TYPES = {
    OLDEST: -1,
    NEWEST: 0,
} as const;

/**
 * Algorithme amélioré de filtrage des posts avec gestion d'erreurs et optimisation
 */
export const FilterPosts = (
    options: FilterPostsOptions,
    callback: (result: FilterPostsResult) => void
): void => {
    const { labelsId, postIdUsed, limit = 10 } = options;
    
    // Validation des paramètres
    if (!Array.isArray(labelsId) || !Array.isArray(postIdUsed)) {
        callback({ posts: [], error: 'Paramètres invalides' });
        return;
    }

    // Fonction helper pour créer les placeholders SQL
    const createPlaceholders = (count: number): string => {
        return Array(count).fill('?').join(',');
    };

    // Fonction helper pour exécuter une requête SQL avec gestion d'erreurs
    const executeQuery = (
        query: string, 
        params: any[], 
        errorContext: string
    ): void => {
        db.transaction(
            (tx) => {
                tx.executeSql(
                    query,
                    params,
                    (_, results) => {
                        try {
                            const posts: Post[] = results.rows.raw();
                            callback({ posts });
                        } catch (error) {
                            console.error(`Erreur lors du traitement des résultats (${errorContext}):`, error);
                            callback({ posts: [], error: 'Erreur lors du traitement des résultats' });
                        }
                    },
                    (_, error) => {
                        console.error(`Erreur SQL (${errorContext}):`, error);
                        callback({ posts: [], error: `Erreur de base de données: ${error.message}` });
                        return false;
                    }
                );
            },
            (error) => {
                console.error(`Erreur de transaction (${errorContext}):`, error);
                callback({ posts: [], error: `Erreur de transaction: ${error.message}` });
            }
        );
    };

    // Construire la clause WHERE pour exclure les posts déjà utilisés
    const excludeUsedPostsClause = postIdUsed.length > 0 
        ? `AND p.id NOT IN (${createPlaceholders(postIdUsed.length)})`
        : '';

    // Cas 1: Aucun label spécifique (posts aléatoires)
    if (labelsId.length === 0) {
        const query = `
            SELECT p.*, 0 as relevance_score FROM posts p
            WHERE 1=1 ${excludeUsedPostsClause}
            ORDER BY RANDOM()
            LIMIT ?;
        `;
        const params = [...postIdUsed, limit];
        executeQuery(query, params, 'sélection aléatoire');
        return;
    }

    // Cas 2: Tri par ancienneté (Plus Anciens)
    if (labelsId.includes(SORT_TYPES.OLDEST)) {
        const otherLabels = labelsId.filter(id => id !== SORT_TYPES.OLDEST);
        
        // Si seulement "Plus Anciens"
        if (otherLabels.length === 0) {
            const query = `
                SELECT p.*, 0 as relevance_score FROM posts p
                WHERE 1=1 ${excludeUsedPostsClause}
                ORDER BY p.createdAt ASC
                LIMIT ?;
            `;
            const params = [...postIdUsed, limit];
            executeQuery(query, params, 'tri par ancienneté');
            return;
        }
        
        // Si "Plus Anciens" + autres labels
        const labelPlaceholders = createPlaceholders(otherLabels.length);
        const query = `
            SELECT p.*, COUNT(DISTINCT pl.labelId) as relevance_score FROM posts p
            INNER JOIN post_labels pl ON p.id = pl.postId
            WHERE pl.labelId IN (${labelPlaceholders})
            ${excludeUsedPostsClause}
            GROUP BY p.id
            HAVING COUNT(DISTINCT pl.labelId) >= 1
            ORDER BY relevance_score DESC, p.createdAt ASC
            LIMIT ?;
        `;
        const params = [...otherLabels, ...postIdUsed, limit];
        executeQuery(query, params, 'tri par ancienneté avec labels');
        return;
    }

    // Cas 3: Tri par récence (Plus Récents)
    if (labelsId.includes(SORT_TYPES.NEWEST)) {
        const otherLabels = labelsId.filter(id => id !== SORT_TYPES.NEWEST);
        
        // Si seulement "Plus Récents"
        if (otherLabels.length === 0) {
            const query = `
                SELECT p.*, 0 as relevance_score FROM posts p
                WHERE 1=1 ${excludeUsedPostsClause}
                ORDER BY p.createdAt DESC
                LIMIT ?;
            `;
            const params = [...postIdUsed, limit];
            executeQuery(query, params, 'tri par récence');
            return;
        }
        
        // Si "Plus Récents" + autres labels
        const labelPlaceholders = createPlaceholders(otherLabels.length);
        const query = `
            SELECT p.*, COUNT(DISTINCT pl.labelId) as relevance_score FROM posts p
            INNER JOIN post_labels pl ON p.id = pl.postId
            WHERE pl.labelId IN (${labelPlaceholders})
            ${excludeUsedPostsClause}
            GROUP BY p.id
            HAVING COUNT(DISTINCT pl.labelId) >= 1
            ORDER BY relevance_score DESC, p.createdAt DESC
            LIMIT ?;
        `;
        const params = [...otherLabels, ...postIdUsed, limit];
        executeQuery(query, params, 'tri par récence avec labels');
        return;
    }

    // Cas 4: Labels spécifiques uniquement (tri par pertinence)
    const labelPlaceholders = createPlaceholders(labelsId.length);
    const query = `
        SELECT p.*, COUNT(DISTINCT pl.labelId) as relevance_score FROM posts p
        INNER JOIN post_labels pl ON p.id = pl.postId
        WHERE pl.labelId IN (${labelPlaceholders})
        ${excludeUsedPostsClause}
        GROUP BY p.id
        HAVING COUNT(DISTINCT pl.labelId) >= 1
        ORDER BY relevance_score DESC, RANDOM()
        LIMIT ?;
    `;
    const params = [...labelsId, ...postIdUsed, limit];
    executeQuery(query, params, 'labels spécifiques');
};