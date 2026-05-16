import { db } from '../../DataBase/db';
import { CandidateWithWeight } from './sieve1';

/**
 * Tamis 2: Intention utilisateur
 * 
 * Ce tamis applique le biais de l'intention utilisateur en multipliant les Weight
 * de TableU avec ceux de TableS. Aucun candidat n'est supprimé à cette étape,
 * on ne fait que modifier les probabilités relatives.
 * 
 * @param currentPostId ID du post actuellement affiché
 * @param candidates Liste des candidats avec leurs poids de TableS (après sieve1)
 * @returns Liste des candidats avec leurs poids ajustés (TableS * TableU)
 */
export const sieve2_UserIntention = async (
  currentPostId: number,
  candidates: CandidateWithWeight[]
): Promise<CandidateWithWeight[]> => {
  return new Promise((resolve, reject) => {
    if (candidates.length === 0) {
      resolve([]);
      return;
    }

    db.transaction((tx) => {
      // Récupérer tous les poids de TableU pour le post actuel
      const candidateIds = candidates.map(c => c.post.id);
      const placeholders = candidateIds.map(() => '?').join(',');
      
      tx.executeSql(
        `SELECT toPoste, Weight FROM TableU 
         WHERE poste = ? AND toPoste IN (${placeholders}) AND Weight > 0;`,
        [currentPostId, ...candidateIds],
        (tx, results) => {
          // Créer une map des poids TableU pour chaque post candidat
          const tableUWeightMap = new Map<number, number>();
          
          for (let i = 0; i < results.rows.length; i++) {
            const row = results.rows.item(i);
            const toPostId = row.toPoste;
            const tableUWeight = row.Weight || 1; // Par défaut 1 si non trouvé
            tableUWeightMap.set(toPostId, tableUWeight);
          }
          
          // Multiplier les poids TableS avec les poids TableU
          const adjustedCandidates: CandidateWithWeight[] = candidates.map(candidate => {
            const tableUWeight = tableUWeightMap.get(candidate.post.id) || 1;
            // Multiplier le poids TableS par le poids TableU
            const adjustedWeight = candidate.weight * tableUWeight;
            
            return {
              post: candidate.post,
              weight: adjustedWeight
            };
          });
          
          // Trier par poids ajusté décroissant
          adjustedCandidates.sort((a, b) => b.weight - a.weight);
          
          console.log(
            `Sieve2: ${candidates.length} candidats -> poids ajustés avec TableU (intention utilisateur)`
          );
          
          resolve(adjustedCandidates);
        },
        (tx, error) => {
          console.error('Erreur lors de la lecture de TableU dans sieve2:', error);
          // En cas d'erreur, retourner les candidats sans modification
          resolve(candidates);
        }
      );
    }, (error) => {
      console.error('Erreur transaction sieve2:', error);
      // En cas d'erreur, retourner les candidats sans modification
      resolve(candidates);
    });
  });
};
