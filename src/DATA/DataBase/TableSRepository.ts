import {db} from './db';
import { getPostById } from './postsRepository';

// =================== MODIFIER ==================================================================================================== //

/** ----------------------------------------------------------
 * AU LANCEMENT DE L'APPLICATION
 * Vérifie que le poste à max 30 liens 
 *  Attention : à appeler seulement au DÉMARAGE de l'app
 * -----------------------------------------------------------
*/
export const checkAndReduceTableSLinks = (postId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    /**
    db.transaction((tx) => {
      // Compter les liens
      tx.executeSql(
        `SELECT COUNT(*) as count FROM TableS WHERE poste1 = ? OR poste2 = ?;`,
        [postId, postId],
        (tx, results) => {
          const count = results.rows.item(0).count;
          if (count > 30) {
            const toDelete = count - 30;

            // Supprimer les liens avec le Weight le plus petit
            tx.executeSql(
              `DELETE FROM TableS
               WHERE rowid IN (
                 SELECT rowid FROM TableS
                 WHERE poste1 = ? OR poste2 = ?
                 ORDER BY Weight ASC
                 LIMIT ?
               );`,
              [postId, postId, toDelete],
              () => resolve(),
              (tx, error) => reject(error)
            );
          } else {
            resolve();
          }
        },
        (tx, error) => reject(error)
      );
    });
    */    // Pour l'instant, ne rien faire: Car cela détrusait juste trop de liens importants
    resolve();
  });
};

/** ----------------------------------------------------------
 * INSÉRER OU METTRE À JOUR UN LIEN ENTRE DEUX POSTES
 * -----------------------------------------------------------
*/
// DATE
export const insertTableSLinkWeight_Date = ( postId1: number, postId2: number, forceDate: number, addWeight: number ): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Déterminer poste1 (id le plus élevé) et poste2 (id le plus bas)
    const poste1 = Math.max(postId1, postId2);
    const poste2 = Math.min(postId1, postId2);

    db.transaction((tx) => {
      // Vérifier si le lien existe déjà
      tx.executeSql(
        `SELECT rowid FROM TableS WHERE poste1 = ? AND poste2 = ?;`,
        [poste1, poste2],
        (tx, results) => {
          if (results.rows.length > 0) {
            /** Si le liens existe, ne riens faire
             * Car, la date ne change pas après la création du post et la date est le première élément mis dans le calcul de Weight 
            */
            resolve();
          } else {
            // Le lien n'existe pas, l'insérer
            tx.executeSql(
              `INSERT INTO TableS (poste1, poste2, ForceDate, Weight, ForceLabel, ForceTextLength, ModifiedAfterOthers)
               VALUES (?, ?, ?, ?+15, 0, 0, 15);`,
              [Math.max(poste1, poste2), Math.min(poste1, poste2), forceDate, addWeight],
              () => resolve(),
              (tx, error) => reject(error)
            );
          };
        },
        (tx, error) => reject(error)
      );
    });
  });
};

// LABELS
export const insertTableSLinkWeight_Labels = async ( post1: number, post2: number, ForceLabel: number, ): Promise<void> => {
  // Déterminer poste1 (id le plus élevé) et poste2 (id le plus bas)
  const Poste1 = Math.max(post1, post2);
  const Poste2 = Math.min(post1, post2);

  // D'abord, vérifier si le lien existe et récupérer ForceTextLength
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT rowid, ForceLabel, ForceTextLength FROM TableS WHERE poste1 = ? AND poste2 = ?;`,
        [Poste1, Poste2],
        (tx, results) => {
          if (results.rows.length > 0) {
            const oldForceLabel = results.rows.item(0).ForceLabel || 0;
            const ForceTextLength = results.rows.item(0).ForceTextLength || 0;
            
            // Si ForceTextLength === 0, le recalculer de manière optimisée
            if (ForceTextLength === 0) {
              // Faire les appels asynchrones en dehors de la transaction
              Promise.all([
                getPostById(Poste1),
                getPostById(Poste2)
              ]).then(([post1Data, post2Data]) => {
                let calculatedForceTextLength = 0;
                
                if (post1Data && post2Data) {
                  const text1 = post1Data.data.text || '';
                  const text2 = post2Data.data.text || '';
                  const textLength1 = text1.length;
                  const textLength2 = text2.length;
                  
                  // Calcul de la proximité (même formule que dans TableS.ts)
                  const maxLength = Math.max(textLength1, textLength2 || 1);
                  calculatedForceTextLength = maxLength > 0 ? Math.round((25 / maxLength) * Math.min(textLength1, textLength2)) : 0;
                }
                
                // Mettre à jour dans une nouvelle transaction
                db.transaction((updateTx) => {
                  updateTx.executeSql(
                    `UPDATE TableS
                     SET Weight = Weight - ? + ? + ?,
                         ForceLabel = ?,
                         ForceTextLength = ?
                     WHERE poste1 = ? AND poste2 = ?;`,
                    [oldForceLabel, ForceLabel, calculatedForceTextLength, ForceLabel, calculatedForceTextLength, Poste1, Poste2],
                    () => resolve(),
                    (tx, error) => reject(error)
                  );
                });
              }).catch(() => {
                // En cas d'erreur, mettre à jour seulement ForceLabel
                db.transaction((updateTx) => {
                  updateTx.executeSql(
                    `UPDATE TableS
                     SET Weight = Weight - ? + ?,
                         ForceLabel = ?
                     WHERE poste1 = ? AND poste2 = ?;`,
                    [oldForceLabel, ForceLabel, ForceLabel, Poste1, Poste2],
                    () => resolve(),
                    (tx, error) => reject(error)
                  );
                });
              });
            } else {
              // ForceTextLength existe déjà, mettre à jour seulement ForceLabel et Weight
              tx.executeSql(
                `UPDATE TableS
                 SET Weight = Weight - ? + ?,
                     ForceLabel = ?
                 WHERE poste1 = ? AND poste2 = ?;`,
                [oldForceLabel, ForceLabel, ForceLabel, Poste1, Poste2],
                () => resolve(),
                (tx, error) => reject(error)
              );
            }
          } else {
            // Le lien n'existe pas, on ne met pas à jour
            // Rejeter avec un message d'erreur explicite pour faciliter le debugging
            reject(new Error(`Le lien entre post ${Poste1} et post ${Poste2} n'existe pas dans TableS`));
          }
        },
        (tx, error) => reject(error)
      );
    });
  });
};

// TEXT LENGTH
export const insertTableSLinkWeight_TextLength = async ( post1: number, post2: number, ForceTextLength: number, ): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Déterminer poste1 (id le plus élevé) et poste2 (id le plus bas)
    const poste1 = Math.max(post1, post2);
    const poste2 = Math.min(post1, post2);

    db.transaction((tx) => {
      // Vérifier si le lien existe déjà
      tx.executeSql(
        `SELECT rowid, ForceTextLength FROM TableS WHERE poste1 = ? AND poste2 = ?;`,
        [poste1, poste2],
        (tx, results) => {
          if (results.rows.length > 0) {
            // Le lien existe, récupérer l'ancien ForceTextLength
            const oldForceTextLength = results.rows.item(0).ForceTextLength || 0;
            // Mettre à jour ForceTextLength et Weight
            // Weight = Weight - ancien ForceTextLength + nouveau ForceTextLength
            tx.executeSql(
              `UPDATE TableS
               SET Weight = Weight - ? + ?,
                   ForceTextLength = ?
               WHERE poste1 = ? AND poste2 = ?;`,
              [oldForceTextLength, ForceTextLength, ForceTextLength, poste1, poste2],
              () => resolve(),
              (tx, error) => reject(error)
            );
          } else {
            // Le lien n'existe pas, on ne peut pas mettre à jour
            // Rejeter avec un message d'erreur explicite pour faciliter le debugging
            reject(new Error(`Le lien entre post ${poste1} et post ${poste2} n'existe pas dans TableS`));
          }
        },
        (tx, error) => reject(error)
      );
    });
  });
};

// MODIFY AFTER OTHER
export const insertTableSLinkWeight_ModifyAfter = (MainPost:number, post1:number, post2:number, post3:number): Promise<void> => {
  return new Promise((resolve, reject)=> {
    // Créer un set des posts modifiés pour exclure les autres
    const modifiedPosts = new Set<number>();
    if (post1 !== -1) modifiedPosts.add(post1);
    if (post2 !== -1) modifiedPosts.add(post2);
    if (post3 !== -1) modifiedPosts.add(post3);

    db.transaction((tx)=>{
      // MainPost - post1 ===========================
      if (post1 !== -1) {
        const Post1 = Math.max(MainPost, post1);
        const Post2 = Math.min(MainPost, post1);
        tx.executeSql(
          `SELECT rowid, ModifiedAfterOthers FROM TableS WHERE poste1 = ? AND poste2 = ?;`,
          [Post1, Post2],
          (tx, results) => {
            if (results.rows.length > 0) {
              const oldModifiedAfterOthers = results.rows.item(0).ModifiedAfterOthers || 15;
              // Calculer le nouveau ModifiedAfterOthers avec limite entre 0 et 30
              const newModifiedAfterOthers = Math.min(30, oldModifiedAfterOthers * 1.2);
              // Mettre à jour Weight et ModifiedAfterOthers
              tx.executeSql(
                `UPDATE TableS
                SET Weight = Weight - ? + ?,
                    ModifiedAfterOthers = ?
                WHERE poste1 = ? AND poste2 = ?;`,
                [oldModifiedAfterOthers, newModifiedAfterOthers, newModifiedAfterOthers, Post1, Post2],
                () => console.log(`Liens entre ${MainPost} et ${post1} modifier`),
                (tx, error) => console.log(`Error lors de la modification du liens entre ${MainPost} et ${post1}: ${error}`)
              );
            }
          },
          (tx, error) => console.log(`Error lors de la sélection du liens entre ${MainPost} et ${post1}: ${error}`)
        );
      }
      // MainPost - post2 ===========================
      if (post2 !== -1) {
        const Post1 = Math.max(MainPost, post2);
        const Post2 = Math.min(MainPost, post2);
        tx.executeSql(
          `SELECT rowid, ModifiedAfterOthers FROM TableS WHERE poste1 = ? AND poste2 = ?;`,
          [Post1, Post2],
          (tx, results) => {
            if (results.rows.length > 0) {
              const oldModifiedAfterOthers = results.rows.item(0).ModifiedAfterOthers || 15;
              // Calculer le nouveau ModifiedAfterOthers avec limite entre 0 et 30
              const newModifiedAfterOthers = Math.min(30, oldModifiedAfterOthers * 1.1);
              // Mettre à jour Weight et ModifiedAfterOthers
              tx.executeSql(
                `UPDATE TableS
                SET Weight = Weight - ? + ?,
                    ModifiedAfterOthers = ?
                WHERE poste1 = ? AND poste2 = ?;`,
                [oldModifiedAfterOthers, newModifiedAfterOthers, newModifiedAfterOthers, Post1, Post2],
                () => console.log(`Liens entre ${MainPost} et ${post2} modifier`),
                (tx, error) => console.log(`Error lors de la modification du liens entre ${MainPost} et ${post2}: ${error}`)
              );
            }
          },
          (tx, error) => console.log(`Error lors de la sélection du liens entre ${MainPost} et ${post2}: ${error}`)
        );
      }
      
      // Réduire les liens de tous ceux qui n'ont pas été modifiés
      // Récupérer tous les liens du MainPost
      const excludedPosts = [post1, post2, post3].filter(p => p !== -1);
      tx.executeSql(
        `SELECT poste1, poste2, ModifiedAfterOthers FROM TableS 
         WHERE poste1 = ? OR poste2 = ?;`,
        [MainPost, MainPost],
        (tx, results) => {
          // Pour chaque lien, vérifier s'il n'est pas dans les posts modifiés
          for (let i = 0; i < results.rows.length; i++) {
            const row = results.rows.item(i);
            const poste1 = row.poste1;
            const poste2 = row.poste2;
            // Vérifier si ce lien n'est pas avec un des posts modifiés
            const otherPost = poste1 === MainPost ? poste2 : poste1;
            if (!excludedPosts.includes(otherPost)) {
              const oldModifiedAfterOthers = row.ModifiedAfterOthers || 15;
              // Calculer le nouveau ModifiedAfterOthers avec limite entre 0 et 30
              const newModifiedAfterOthers = Math.max(0, oldModifiedAfterOthers * 0.9);
              
              tx.executeSql(
                `UPDATE TableS
                SET Weight = Weight - ? + ?,
                    ModifiedAfterOthers = ?
                WHERE poste1 = ? AND poste2 = ?;`,
                [oldModifiedAfterOthers, newModifiedAfterOthers, newModifiedAfterOthers, poste1, poste2],
                () => {},
                (tx, error) => console.log(`Error lors de la réduction du liens entre ${poste1} et ${poste2}: ${error}`)
              );
            }
          }
        },
        (tx, error) => {
          console.log(`Error lors de la sélection des liens non modifiés: ${error}`);
        }
      );
    }, (error) => {
      console.log(`Error transaction insertTableSLinkWeight_ModifyAfter: ${error}`);
      reject(error);
    }, () => {
      resolve();
    });
  });
};


// =================== LIRE ======================================================================================================== //

// Lire la force des liens entre deux posts
export const getTableSLinkWeight = ( postId1: number, postId2: number ): Promise<number | null> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT Weight FROM TableS WHERE poste1 = ? AND poste2 = ? OR poste1 = ? AND poste2 = ?;`,
        [postId1, postId2, postId2, postId1],
        (tx, results) => {
          if (results.rows.length > 0) {
            const weight = results.rows.item(0).Weight;
            resolve(weight);
          } else {
            resolve(null); // Lien non trouvé
          }
        },
        (tx, error) => reject(error)
      );
    });
  });
};