import { db } from '../../DataBase/db';
import { getAllPosts } from '../../DataBase/postsRepository';

/**
 * Hook pour gérer Df (Dot force) - Force temporelle
 * Df = 0 signifie que le poste vient d'être vu
 * À chaque affichage d'un nouveau poste :
 *   - le poste affiché repasse à Df = 0
 *   - tous les autres postes voient leur Df augmenter progressivement
 * 
 * Df sert uniquement à empêcher la répétition récente. C'est un tamis dur.
 */

// Constante pour l'augmentation de Df par seconde
const DF_INCREMENT_PER_SECOND = 0.1; // Augmentation de 0.1 par seconde

/**
 * Met à jour Df pour un post spécifique (le poste affiché repasse à 0)
 * et augmente progressivement Df pour tous les autres posts
 */
export const updateDfForViewedPost = async (viewedPostId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const currentTime = Date.now();
    
    db.transaction((tx) => {
      // 1. Remettre Df à 0 pour le poste affiché et mettre à jour lastViewedAt
      tx.executeSql(
        `UPDATE posts SET Df = 0, lastViewedAt = ? WHERE id = ?;`,
        [currentTime, viewedPostId],
        () => {
          // 2. Augmenter Df pour tous les autres posts en fonction du temps écoulé
          tx.executeSql(
            `SELECT id, lastViewedAt, Df FROM posts WHERE id != ?;`,
            [viewedPostId],
            (tx, results) => {
              const posts = [];
              for (let i = 0; i < results.rows.length; i++) {
                posts.push(results.rows.item(i));
              }
              
              // Calculer le nouveau Df pour chaque post
              const updatePromises = posts.map((post) => {
                return new Promise<void>((resolveUpdate, rejectUpdate) => {
                  const lastViewed = post.lastViewedAt || 0;
                  const currentDf = post.Df || 0;
                  
                  // Calculer le temps écoulé depuis la dernière vue (en secondes)
                  const timeElapsed = (currentTime - lastViewed) / 1000;
                  
                  // Augmenter Df en fonction du temps écoulé
                  const newDf = currentDf + (timeElapsed * DF_INCREMENT_PER_SECOND);
                  
                  // Mettre à jour le post
                  tx.executeSql(
                    `UPDATE posts SET Df = ?, lastViewedAt = ? WHERE id = ?;`,
                    [newDf, currentTime, post.id],
                    () => resolveUpdate(),
                    (tx, error) => {
                      console.error(`Erreur mise à jour Df pour post ${post.id}:`, error);
                      resolveUpdate(); // Continuer même en cas d'erreur
                    }
                  );
                });
              });
              
              Promise.all(updatePromises)
                .then(() => {
                  console.log(`Df mis à jour: post ${viewedPostId} à 0, autres posts augmentés`);
                  resolve();
                })
                .catch((error) => {
                  console.error('Erreur lors de la mise à jour de Df:', error);
                  reject(error);
                });
            },
            (tx, error) => {
              console.error('Erreur lors de la lecture des posts pour Df:', error);
              reject(error);
            }
          );
        },
        (tx, error) => {
          console.error('Erreur lors de la mise à jour du poste affiché:', error);
          reject(error);
        }
      );
    }, (error) => {
      console.error('Erreur transaction updateDfForViewedPost:', error);
      reject(error);
    });
  });
};

/**
 * Initialise Df pour tous les posts au démarrage de l'application
 * Calcule Df en fonction du temps écoulé depuis la dernière vue
 */
export const initializeDfForAllPosts = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const currentTime = Date.now();
    
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT id, lastViewedAt, Df FROM posts;`,
        [],
        (tx, results) => {
          const posts = [];
          for (let i = 0; i < results.rows.length; i++) {
            posts.push(results.rows.item(i));
          }
          
          const updatePromises = posts.map((post) => {
            return new Promise<void>((resolveUpdate) => {
              const lastViewed = post.lastViewedAt || 0;
              const currentDf = post.Df || 0;
              
              // Si le post n'a jamais été vu, initialiser avec une valeur par défaut
              if (lastViewed === 0) {
                tx.executeSql(
                  `UPDATE posts SET Df = 10, lastViewedAt = ? WHERE id = ?;`,
                  [currentTime, post.id],
                  () => resolveUpdate(),
                  () => resolveUpdate() // Continuer même en cas d'erreur
                );
              } else {
                // Calculer le temps écoulé depuis la dernière vue
                const timeElapsed = (currentTime - lastViewed) / 1000;
                const newDf = currentDf + (timeElapsed * DF_INCREMENT_PER_SECOND);
                
                tx.executeSql(
                  `UPDATE posts SET Df = ?, lastViewedAt = ? WHERE id = ?;`,
                  [newDf, currentTime, post.id],
                  () => resolveUpdate(),
                  () => resolveUpdate() // Continuer même en cas d'erreur
                );
              }
            });
          });
          
          Promise.all(updatePromises)
            .then(() => {
              console.log('Df initialisé pour tous les posts');
              resolve();
            })
            .catch((error) => {
              console.error('Erreur lors de l\'initialisation de Df:', error);
              resolve(); // Résoudre quand même pour ne pas bloquer l'app
            });
        },
        (tx, error) => {
          console.error('Erreur lors de la lecture des posts pour initialisation Df:', error);
          resolve(); // Résoudre quand même
        }
      );
    }, (error) => {
      console.error('Erreur transaction initializeDfForAllPosts:', error);
      resolve(); // Résoudre quand même
    });
  });
};

/**
 * Récupère la valeur Df d'un post
 */
export const getDfForPost = async (postId: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT Df FROM posts WHERE id = ?;`,
        [postId],
        (tx, results) => {
          if (results.rows.length > 0) {
            const df = results.rows.item(0).Df || 0;
            resolve(df);
          } else {
            resolve(0); // Post non trouvé, retourner 0
          }
        },
        (tx, error) => {
          console.error(`Erreur lors de la lecture de Df pour post ${postId}:`, error);
          resolve(0); // En cas d'erreur, retourner 0
        }
      );
    });
  });
};
