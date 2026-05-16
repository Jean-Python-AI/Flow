import { Post } from '../types/Post';
import {db} from './db';


// ==================== LIRE ====================

/** Récupère tous les posts triés par date descendante */
export const getAllPosts = (): Promise<Post[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM posts ORDER BY createdAt DESC;`,
        [],
        (_, { rows }) => {
          const posts: Post[] = [];
          for (let i = 0; i < rows.length; i++) {
            posts.push(rows.item(i));
          }
          resolve(posts);
        },
        (_, error) => reject(error)
      );
    });
  });
};

/** Récupère un post par son ID */
export const getPostById = (id: number): Promise<{ data: Post } | null> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM posts WHERE id = ?;`,
        [id],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve({ data: rows.item(0) });
          } else {
            resolve(null);
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};

/** Compte le nombre total de posts */
export const getPostsCount = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT COUNT(*) as count FROM posts;`,
        [],
        (_, { rows }) => resolve(rows.item(0).count),
        (_, error) => reject(error)
      );
    });
  });
};

/** Récupère les IDs de tous les posts (utile pour ton algorithme d’exclusion) */
export const getAllPostIds = (): Promise<number[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT id FROM posts;`,
        [],
        (_, { rows }) => {
          const ids: number[] = [];
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows.item(i).id);
          }
          resolve(ids);
        },
        (_, error) => reject(error)
      );
    });
  });
};

// ==================== AJOUTER ====================

/** Ajoute un nouveau post */
export const insertPost = (
  title: string,
  text: string
): Promise<number> => {  // retourne l'ID du nouveau post
  const createdAt = new Date().toISOString();
  const formatedDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  return new Promise((resolve, reject) => {
    // La colonne formatedDate est désormais garantie par createTables() au démarrage.
    // On peut donc insérer directement sans migration supplémentaire ici.
    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO posts (title, text, createdAt, formatedDate)
           VALUES (?, ?, ?, ?);`,
          [title, text, createdAt, formatedDate],
          (_, result) => {
            const insertId = result.insertId;
            console.log('insertPost: résultat insertion', result);
            if (insertId === undefined || insertId === null) {
              // Essayer d'utiliser last_insert_rowid comme fallback
              tx.executeSql(
                'SELECT last_insert_rowid() as id;',
                [],
                (_, { rows }) => {
                  const lastId = rows.item(0)?.id;
                  if (lastId) {
                    resolve(lastId);
                  } else {
                    reject(new Error("Impossible de récupérer l'ID du post inséré"));
                  }
                },
                (_, error) => {
                  console.error(
                    "Erreur lors de la récupération de l'ID du post inséré:",
                    error
                  );
                  reject(
                    new Error(
                      "insertId est undefined et impossible de récupérer l'ID"
                    )
                  );
                }
              );
              return;
            }
            resolve(insertId);
          },
          (_, error) => {
            console.error("Erreur lors de l'insertion du post:", error);
            reject(error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Erreur de transaction:', error);
        reject(error);
      }
    );
  });
}

// ==================== MODIFIER ====================

/** Met à jour un post existant */
export const updatePost = (
  id: number,
  title: string,
  text: string
): Promise<void> => {

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE posts
         SET title = ?, text = ?
         WHERE id = ?;`,
        [title, text, id],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

// ==================== SUPPRIMER ====================

/** Supprime un post par ID */
export const deletePost = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM posts WHERE id = ?;`,
        [id],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

/** Supprime tous les posts (utile pour debug ou reset) */
export const deleteAllPosts = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM posts;`,
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};