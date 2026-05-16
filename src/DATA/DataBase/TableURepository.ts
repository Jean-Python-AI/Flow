import {db} from './db';

// =================== MODIFIER ==================================================================================================== //

/** ----------------------------------------------------------
 * AU LANCEMENT DE L'APPLICATION
 * Vérifie que le poste à max 30 liens 
 *  Attention : à appeler seulement au DÉMARAGE de l'app
 * -----------------------------------------------------------
*/
export const checkAndReduceTableULinks = (postId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Compter les liens
      tx.executeSql(
        `SELECT COUNT(*) as count FROM TableU WHERE poste = ?;`,
        [postId],
        (tx, results) => {
          const count = results.rows.item(0).count;
          if (count > 30) {
            const toDelete = count - 30;

            // Supprimer les liens avec le Weight le plus petit
            tx.executeSql(
              `DELETE FROM TableU
               WHERE rowid IN (
                 SELECT rowid FROM TableU
                 WHERE poste = ?
                 ORDER BY Weight ASC
                 LIMIT ?
               );`,
              [postId, toDelete],
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
  });
};

/** ----------------------------------------------------------
 * INSÉRER OU METTRE À JOUR UN LIEN ENTRE DEUX POSTES
 * -----------------------------------------------------------
*/
// Clicked After other
export const insertOrUpdateTableULink_ClickedAfter = (postId: number, toPostId: number, force: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO TableU (poste, toPoste, clickAfter, timeBYView, Weight) 
                 VALUES (?, ?, 0.35, 0.4, 1)
                 ON CONFLICT(poste, toPoste) DO UPDATE SET
                 clickAfter = clickAfter * ?`,
                [postId, toPostId, force],
                () => {
                    // Lecture du nouveau clickAfter
                    tx.executeSql(
                        `SELECT clickAfter, timeBYView, Weight FROM TableU WHERE poste = ? AND toPoste = ?`,
                        [postId, toPostId],
                        (tx, results) => {
                            if (results.rows.length === 0) {
                                reject(new Error(`Lien entre poste ${postId} et toPoste ${toPostId} non trouvé après insertion`));
                                return;
                            }
                            
                            const clickedAfter = results.rows.item(0).clickAfter || 0.35;
                            const timeBYView = results.rows.item(0).timeBYView || 0.4;
                            const currentWeight = results.rows.item(0).Weight || 1;
                            
                            // Calcul du nouveau Weight
                            const clickAfterAdjusted = clickedAfter < 0.34 ? 1 - clickedAfter : 1 + clickedAfter;
                            const timeBYViewAdjusted = timeBYView < 0.39 ? 1 - timeBYView : 1 + timeBYView;
                            
                            const newWeight = ((clickAfterAdjusted + timeBYViewAdjusted)/2) * currentWeight;
                            console.log(`Updated Weight for poste ${postId} to toPoste ${toPostId}: ${newWeight} CLICKED AFTER`);

                            // Mise à jour du Weight
                            tx.executeSql(
                                `UPDATE TableU SET Weight = ? WHERE poste = ? AND toPoste = ?`,
                                [newWeight, postId, toPostId],
                                () => resolve(),
                                (tx, error) => reject(error)
                            );
                        },
                        (tx, error) => reject(error)
                    );
                },
                (tx, error) => reject(error)
            );
        }, (error) => {
            console.error('Erreur transaction insertOrUpdateTableULink_ClickedAfter:', error);
            reject(error);
        });
    });
};

// Time View BY Number View
export const insertOrUpdateTableULink_TimeViewBYNumberView = (postId: number, toPostId: number, force: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
        }, (error) => {
            reject(error)
        }, () => {
            resolve();
        });
    });
};