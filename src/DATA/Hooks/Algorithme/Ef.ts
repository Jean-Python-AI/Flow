import { db } from '../../DataBase/db';

/**
 * Hook pour gérer Ef (Exploration force) - Force d'exploration
 * Ef n'est pas un tableau de similarité.
 * Il sert à mesurer :
 *   - les chemins déjà trop empruntés
 *   - les zones jamais ou peu explorées
 * 
 * Ef :
 *   - pénalise les liens sur-exploités
 *   - favorise les liens peu ou jamais utilisés
 * 
 * Ef empêche l'algorithme de tourner en boucle.
 */

/**
 * Enregistre qu'un chemin entre deux posts a été exploré
 * @param postId1 Premier post (peut être dans n'importe quel ordre)
 * @param postId2 Deuxième post
 */
export const recordExploration = async (postId1: number, postId2: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Déterminer poste1 (id le plus élevé) et poste2 (id le plus bas) pour cohérence
    const poste1 = Math.max(postId1, postId2);
    const poste2 = Math.min(postId1, postId2);
    const currentTime = Date.now();
    
    db.transaction((tx) => {
      // Vérifier si le chemin existe déjà
      tx.executeSql(
        `SELECT explorationCount, lastExploredAt FROM TableEf WHERE poste1 = ? AND poste2 = ?;`,
        [poste1, poste2],
        (tx, results) => {
          if (results.rows.length > 0) {
            // Le chemin existe, incrémenter le compteur
            const currentCount = results.rows.item(0).explorationCount || 0;
            const newCount = currentCount + 1;
            
            tx.executeSql(
              `UPDATE TableEf 
               SET explorationCount = ?, lastExploredAt = ?
               WHERE poste1 = ? AND poste2 = ?;`,
              [newCount, currentTime, poste1, poste2],
              () => {
                console.log(`Exploration enregistrée: ${poste1} -> ${poste2} (count: ${newCount})`);
                resolve();
              },
              (tx, error) => {
                console.error(`Erreur mise à jour exploration ${poste1} -> ${poste2}:`, error);
                reject(error);
              }
            );
          } else {
            // Le chemin n'existe pas, l'insérer
            tx.executeSql(
              `INSERT INTO TableEf (poste1, poste2, explorationCount, lastExploredAt)
               VALUES (?, ?, 1, ?);`,
              [poste1, poste2, currentTime],
              () => {
                console.log(`Nouveau chemin exploré: ${poste1} -> ${poste2}`);
                resolve();
              },
              (tx, error) => {
                console.error(`Erreur insertion exploration ${poste1} -> ${poste2}:`, error);
                reject(error);
              }
            );
          }
        },
        (tx, error) => {
          console.error(`Erreur lecture exploration ${poste1} -> ${poste2}:`, error);
          reject(error);
        }
      );
    }, (error) => {
      console.error('Erreur transaction recordExploration:', error);
      reject(error);
    });
  });
};

/**
 * Récupère le nombre d'explorations d'un chemin entre deux posts
 * @param postId1 Premier post
 * @param postId2 Deuxième post
 * @returns Le nombre d'explorations (0 si jamais exploré)
 */
export const getExplorationCount = async (postId1: number, postId2: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const poste1 = Math.max(postId1, postId2);
    const poste2 = Math.min(postId1, postId2);
    
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT explorationCount FROM TableEf WHERE poste1 = ? AND poste2 = ?;`,
        [poste1, poste2],
        (tx, results) => {
          if (results.rows.length > 0) {
            const count = results.rows.item(0).explorationCount || 0;
            resolve(count);
          } else {
            resolve(0); // Jamais exploré
          }
        },
        (tx, error) => {
          console.error(`Erreur lecture exploration count ${poste1} -> ${poste2}:`, error);
          resolve(0); // En cas d'erreur, retourner 0
        }
      );
    });
  });
};

/**
 * Calcule le facteur Ef pour un chemin
 * Plus le chemin est exploré, plus le facteur est faible (pénalisation)
 * Moins le chemin est exploré, plus le facteur est élevé (favorisation)
 * 
 * @param explorationCount Nombre de fois que le chemin a été exploré
 * @returns Facteur Ef (entre 0.1 et 2.0)
 */
export const calculateEfFactor = (explorationCount: number): number => {
  // Si jamais exploré, facteur maximum (2.0)
  if (explorationCount === 0) {
    return 2.0;
  }
  
  // Formule décroissante : plus exploré = facteur plus faible
  // Utilise une fonction logarithmique pour une décroissance douce
  // Facteur minimum de 0.1 pour éviter de complètement exclure un chemin
  const factor = Math.max(0.1, 2.0 / (1 + Math.log(explorationCount + 1)));
  
  return factor;
};

/**
 * Récupère tous les chemins explorés depuis un post donné
 * @param postId ID du post de départ
 * @returns Map des postId de destination -> nombre d'explorations
 */
export const getExplorationsFromPost = async (postId: number): Promise<Map<number, number>> => {
  return new Promise((resolve, reject) => {
    const explorations = new Map<number, number>();
    
    db.transaction((tx) => {
      // Chercher les chemins où postId est poste1
      tx.executeSql(
        `SELECT poste2, explorationCount FROM TableEf WHERE poste1 = ?;`,
        [postId],
        (tx, results) => {
          for (let i = 0; i < results.rows.length; i++) {
            const row = results.rows.item(i);
            explorations.set(row.poste2, row.explorationCount || 0);
          }
          
          // Chercher aussi les chemins où postId est poste2
          tx.executeSql(
            `SELECT poste1, explorationCount FROM TableEf WHERE poste2 = ?;`,
            [postId],
            (tx, results2) => {
              for (let i = 0; i < results2.rows.length; i++) {
                const row = results2.rows.item(i);
                explorations.set(row.poste1, row.explorationCount || 0);
              }
              
              resolve(explorations);
            },
            (tx, error) => {
              console.error(`Erreur lecture explorations depuis post ${postId}:`, error);
              resolve(explorations); // Retourner ce qu'on a déjà trouvé
            }
          );
        },
        (tx, error) => {
          console.error(`Erreur lecture explorations depuis post ${postId}:`, error);
          resolve(explorations); // Retourner une map vide en cas d'erreur
        }
      );
    });
  });
};
