import { db } from '../../DataBase/db';
import { Post } from '../../types/Post';

/**
 * Tamis 1: Sélectionne les 30-40% meilleurs postes en fonction de similarité structurelle
 * 
 * Ce tamis utilise TableS pour déterminer la cohérence structurelle entre le post actuel
 * et les autres posts candidats. Il élimine les liens trop faibles et conserve
 * environ 30-40% des candidats les plus plausibles.
 * 
 * @param currentPostId ID du post actuellement affiché (point de départ)
 * @param candidatePosts Liste de tous les posts candidats
 * @returns Liste des posts filtrés (30-40% des meilleurs) avec leurs poids
 */
export interface CandidateWithWeight {
  post: Post;
  weight: number; // Poids de TableS
}

export const sieve1_StructuralCoherence = async (
  currentPostId: number,
  candidatePosts: Post[]
): Promise<CandidateWithWeight[]> => {
  return new Promise((resolve, reject) => {
    if (candidatePosts.length === 0) {
      resolve([]);
      return;
    }

    db.transaction((tx) => {
      // Récupérer tous les poids de TableS pour le post actuel
      tx.executeSql(
        `SELECT poste1, poste2, Weight FROM TableS 
         WHERE (poste1 = ? OR poste2 = ?) AND Weight > 0
         ORDER BY Weight DESC;`,
        [currentPostId, currentPostId],
        (tx, results) => {
          // Créer une map des poids pour chaque post candidat
          const weightMap = new Map<number, number>();
          
          for (let i = 0; i < results.rows.length; i++) {
            const row = results.rows.item(i);
            const otherPostId = row.poste1 === currentPostId ? row.poste2 : row.poste1;
            const weight = row.Weight || 0;
            
            // Si le post candidat est dans notre liste, enregistrer son poids
            if (candidatePosts.some(p => p.id === otherPostId)) {
              weightMap.set(otherPostId, weight);
            }
          }
          
          // Créer la liste des candidats avec leurs poids
          const candidatesWithWeight: CandidateWithWeight[] = candidatePosts
            .map(post => ({
              post,
              weight: weightMap.get(post.id) || 0
            }))
            .filter(candidate => candidate.weight > 0) // Éliminer les candidats sans lien dans TableS
            .sort((a, b) => b.weight - a.weight); // Trier par poids décroissant
          
          // Sélectionner les 30-40% meilleurs candidats
          // On prend 35% comme compromis entre 30% et 40%
          const percentageToKeep = 0.35;
          const numberOfCandidatesToKeep = Math.max(
            1, // Au moins 1 candidat
            Math.ceil(candidatesWithWeight.length * percentageToKeep)
          );
          
          const filteredCandidates = candidatesWithWeight.slice(0, numberOfCandidatesToKeep);
          
          console.log(
            `Sieve1: ${candidatePosts.length} candidats initiaux -> ${filteredCandidates.length} candidats après filtrage structurel (${Math.round(percentageToKeep * 100)}%)`
          );
          
          resolve(filteredCandidates);
        },
        (tx, error) => {
          console.error('Erreur lors de la lecture de TableS dans sieve1:', error);
          // En cas d'erreur, retourner tous les candidats avec poids 0
          const candidatesWithWeight: CandidateWithWeight[] = candidatePosts.map(post => ({
            post,
            weight: 0
          }));
          resolve(candidatesWithWeight);
        }
      );
    }, (error) => {
      console.error('Erreur transaction sieve1:', error);
      // En cas d'erreur, retourner tous les candidats avec poids 0
      const candidatesWithWeight: CandidateWithWeight[] = candidatePosts.map(post => ({
        post,
        weight: 0
      }));
      resolve(candidatesWithWeight);
    });
  });
};
