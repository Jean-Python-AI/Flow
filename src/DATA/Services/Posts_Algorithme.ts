import { Post } from '../types/Post';
import SQLite from 'react-native-sqlite-storage';

// Ouvre la base (tu peux aussi l'importer depuis un db.ts séparé)
const db = SQLite.openDatabase(
  { name: 'myapp.db', location: 'default' },
  () => {},
  (error) => console.error('Erreur ouverture DB:', error)
);

export interface AlgorithmeOptions {
    labelsId: number[];
    postIdUsed: number[];
    limit?: number;
}

export interface AlgorithmeResult {
    posts: Post[];
    error?: string;
}

// Constantes pour les types de tri
const SORT_TYPES = {
    OLDEST: -1,
    NEWEST: 0,
} as const;



export const Algorithme = ( options: AlgorithmeOptions, callback: (result: AlgorithmeResult) => void ): void => {
    const { labelsId, postIdUsed, limit = 10 } = options;
    
    // Validation of parameters
    if (!Array.isArray(labelsId) || !Array.isArray(postIdUsed)) {
        callback({ posts: [], error: 'Paramètres invalides' });
        return;
    }

    // Create SQL placeholders
    const createPlaceholders = (count: number): string => {
        return Array(count).fill('?').join(',');
    };

    // Global function for executing a SQL query
    const executeSQL = (
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
                            console.error(`Error processing results (${errorContext}):`, error);
                            callback({ posts: [], error: 'Error processing results' });
                        }
                    },
                    (_, error) => {
                        console.error(`SQL error (${errorContext}):`, error);
                        callback({ posts: [], error: `Database error: ${error.message}` });
                        return false;
                    }
                );
            },
            (error) => {
                console.error(`Transaction error (${errorContext}):`, error);
                callback({ posts: [], error: `Transaction error: ${error.message}` });
            }
        );
    };

    // Construct the WHERE clause to exclude posts already in use
    const excludeUsedPostsClause = postIdUsed.length > 0 
        ? `AND p.id NOT IN (${createPlaceholders(postIdUsed.length)})`
        : '';

    // Algorithms ----------------------------------------------------------
    // 1: No specific label (random posts)
    if (labelsId.length === 0) {
        const query = `
            SELECT p.*, 0 as relevance_score FROM posts p
            WHERE 1=1 ${excludeUsedPostsClause}
            ORDER BY RANDOM()
            LIMIT ?;
        `;
        const params = [...postIdUsed, limit];
        executeSQL(query, params, 'Random selection');
        return;
    }

    // 2: Sort by seniority (Oldest)
    if (labelsId.includes(SORT_TYPES.OLDEST)) {
        const otherLabels = labelsId.filter(id => id !== SORT_TYPES.OLDEST);
        
        // If only "Older"
        if (otherLabels.length === 0) {
            const query = `
                SELECT p.*, 0 as relevance_score FROM posts p
                WHERE 1=1 ${excludeUsedPostsClause}
                ORDER BY p.createdAt ASC
                LIMIT ?;
            `;
            const params = [...postIdUsed, limit];
            executeSQL(query, params, 'Sort by seniority');
            return;
        }
        
        // If "Older" + other labels
        const labelPlaceholders = createPlaceholders(otherLabels.length);
        const query = `
            SELECT p.*, COUNT(DISTINCT post_labels.labelId) as relevance_score FROM posts p
            INNER JOIN post_labels ON p.id = post_labels.postId
            WHERE post_labels.labelId IN (${labelPlaceholders})
            ${excludeUsedPostsClause}
            GROUP BY p.id
            HAVING COUNT(DISTINCT post_labels.labelId) >= 1
            ORDER BY relevance_score DESC, p.createdAt ASC
            LIMIT ?;
        `;
        const params = [...otherLabels, ...postIdUsed, limit];
        executeSQL(query, params, 'Sort by seniority with labels');
        return;
    }

    // 3: Sort by recency (Most Recent)
    if (labelsId.includes(SORT_TYPES.NEWEST)) {
        const otherLabels = labelsId.filter(id => id !== SORT_TYPES.NEWEST);
        
        // If only "Most Recent"
        if (otherLabels.length === 0) {
            const query = `
                SELECT p.*, 0 as relevance_score FROM posts p
                WHERE 1=1 ${excludeUsedPostsClause}
                ORDER BY p.createdAt DESC
                LIMIT ?;
            `;
            const params = [...postIdUsed, limit];
            executeSQL(query, params, 'Sort by recency');
            return;
        }
        
        // If "Most Recent" + other labels
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
        executeSQL(query, params, 'Sort by recency with labels');
        return;
    }

    // 4: just labels
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
    executeSQL(query, params, 'Sort by labels');
    return;
};