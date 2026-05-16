import { CandidateWithWeight } from './sieve1';
import { getExplorationCount, calculateEfFactor } from '../../Hooks/Algorithme/Ef';

/**
 * Tamis 4: Exploration (Ef - Exploration force)
 * 
 * Ce tamis pénalise les chemins sur-exploités et favorise les chemins peu explorés.
 * Il empêche l'algorithme de tourner en boucle en diversifiant les recommandations.
 * 
 * @param currentPostId ID du post actuellement affiché
 * @param candidates Liste des candidats avec leurs poids ajustés (après sieve3)
 * @returns Liste des candidats avec leurs poids ajustés par le facteur Ef
 */
export const sieve4_Exploration = async (
  currentPostId: number,
  candidates: CandidateWithWeight[]
): Promise<CandidateWithWeight[]> => {
  if (candidates.length === 0) {
    return [];
  }

  try {
    // Pour chaque candidat, récupérer le nombre d'explorations et calculer le facteur Ef
    const adjustedCandidates: CandidateWithWeight[] = await Promise.all(
      candidates.map(async (candidate) => {
        try {
          // Récupérer le nombre de fois que ce chemin a été exploré
          const explorationCount = await getExplorationCount(currentPostId, candidate.post.id);
          
          // Calculer le facteur Ef (pénalise les chemins sur-exploités, favorise les peu explorés)
          const efFactor = calculateEfFactor(explorationCount);
          
          // Multiplier le poids actuel par le facteur Ef
          const adjustedWeight = candidate.weight * efFactor;
          
          return {
            post: candidate.post,
            weight: adjustedWeight
          };
        } catch (error) {
          console.error(
            `Erreur lors du calcul Ef pour candidat ${candidate.post.id}:`,
            error
          );
          // En cas d'erreur, retourner le candidat sans modification
          return candidate;
        }
      })
    );
    
    // Trier par poids ajusté décroissant
    adjustedCandidates.sort((a, b) => b.weight - a.weight);
    
    console.log(
      `Sieve4: ${candidates.length} candidats -> poids ajustés avec Ef (exploration)`
    );
    
    return adjustedCandidates;
  } catch (error) {
    console.error('Erreur dans sieve4:', error);
    // En cas d'erreur, retourner les candidats sans modification
    return candidates;
  }
};
