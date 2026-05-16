import { db } from '../../DataBase/db';
import { CandidateWithWeight } from './sieve1';

/**
 * Tamis 3: Récence (Df - Dot force)
 * 
 * Ce tamis exclut strictement les posts vus récemment.
 * Df = 0 signifie que le poste vient d'être vu.
 * 
 * C'est un tamis dur : les posts avec Df trop faible sont simplement supprimés.
 * 
 * @param candidates Liste des candidats avec leurs poids ajustés (après sieve2)
 * @param minDfThreshold Seuil minimum de Df pour qu'un post soit accepté (défaut: 5.0)
 * @returns Liste des candidats filtrés (posts avec Df suffisant)
 */
export const sieve3_Recency = async (
  candidates: CandidateWithWeight[],
  minDfThreshold: number = 5.0
): Promise<CandidateWithWeight[]> => {
  return new Promise((resolve, reject) => {
    if (candidates.length === 0) {
      resolve([]);
      return;
    }

    db.transaction((tx) => {
      // Récupérer les valeurs Df pour tous les candidats
      const candidateIds = candidates.map(c => c.post.id);
      const placeholders = candidateIds.map(() => '?').join(',');
      
      tx.executeSql(
        `SELECT id, Df FROM posts 
         WHERE id IN (${placeholders});`,
        candidateIds,
        (tx, results) => {
          // Créer une map des valeurs Df
          const dfMap = new Map<number, number>();
          
          for (let i = 0; i < results.rows.length; i++) {
            const row = results.rows.item(i);
            const postId = row.id;
            const df = row.Df || 0;
            dfMap.set(postId, df);
          }
          
          // Filtrer les candidats : garder uniquement ceux avec Df >= minDfThreshold
          const filteredCandidates = candidates.filter(candidate => {
            const df = dfMap.get(candidate.post.id) || 0;
            return df >= minDfThreshold;
          });
          
          console.log(
            `Sieve3: ${candidates.length} candidats -> ${filteredCandidates.length} candidats après filtrage Df (seuil: ${minDfThreshold})`
          );
          
          if (filteredCandidates.length === 0) {
            console.warn('⚠️ Aucun candidat après le tamis Df. Le seuil pourrait être trop élevé.');
          }
          
          resolve(filteredCandidates);
        },
        (tx, error) => {
          console.error('Erreur lors de la lecture de Df dans sieve3:', error);
          // En cas d'erreur, retourner tous les candidats (ne pas bloquer)
          resolve(candidates);
        }
      );
    }, (error) => {
      console.error('Erreur transaction sieve3:', error);
      // En cas d'erreur, retourner tous les candidats (ne pas bloquer)
      resolve(candidates);
    });
  });
};
