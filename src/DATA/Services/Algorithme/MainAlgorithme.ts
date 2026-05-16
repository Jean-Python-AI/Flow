import { Post } from '../../types/Post';
import { getAllPosts } from '../../DataBase/postsRepository';
import { db } from '../../DataBase/db';
import { sieve1_StructuralCoherence } from './sieve1';
import { sieve2_UserIntention } from './sieve2';
import { sieve3_Recency } from './sieve3';
import { sieve4_Exploration } from './sieve4';
import { recordExploration } from '../../Hooks/Algorithme/Ef';
import { updateDfForViewedPost } from '../../Hooks/Algorithme/Df';

/**
 * Interface pour les options de l'algorithme
 * Compatible avec l'ancien Posts_Algorithme.ts
 */
export interface AlgorithmeOptions {
  labelsId: number[];
  postIdUsed: number[];
  limit?: number;
  currentPostId?: number; // ID du post actuellement affiché (optionnel, pour le premier chargement)
}

/**
 * Interface pour le résultat de l'algorithme
 * Compatible avec l'ancien Posts_Algorithme.ts
 */
export interface AlgorithmeResult {
  posts: Post[];
  error?: string;
}

// Constantes pour les types de tri (compatibilité avec l'ancien algorithme)
const SORT_TYPES = {
  OLDEST: -1,
  NEWEST: 0,
} as const;

/**
 * Algorithme principal de recommandation
 * 
 * Cet algorithme applique une série de tamis pour recommander des posts :
 * 1. Tamis S (cohérence structurelle) - sélectionne 30-40% des meilleurs candidats
 * 2. Tamis U (intention utilisateur) - multiplie les Weight de TableU avec TableS
 * 3. Tamis Df (récence) - exclut les posts vus récemment
 * 4. Tamis Ef (exploration) - pénalise les chemins sur-exploités, favorise les peu explorés
 * 
 * @param options Options de l'algorithme
 * @param callback Fonction de callback appelée avec le résultat
 */
export const Algorithme = (
  options: AlgorithmeOptions,
  callback: (result: AlgorithmeResult) => void
): void => {
  const { labelsId, postIdUsed, limit = 10, currentPostId } = options;

  // Validation des paramètres
  if (!Array.isArray(labelsId) || !Array.isArray(postIdUsed)) {
    callback({ posts: [], error: 'Paramètres invalides' });
    return;
  }

  // Fonction principale asynchrone
  const runAlgorithm = async () => {
    try {
      // 1. Récupérer tous les posts candidats (exclure ceux déjà utilisés)
      const allPosts = await getAllPosts();
      let candidatePosts = allPosts.filter(
        (post) => !postIdUsed.includes(post.id)
      );

      // Si aucun candidat disponible
      if (candidatePosts.length === 0) {
        callback({ posts: [] });
        return;
      }

      // 2. Gérer les cas spéciaux (labels, tri par date, etc.)
      // Si des labels sont spécifiés, filtrer d'abord par labels
      if (labelsId.length > 0) {
        // Vérifier si c'est un tri par date (OLDEST ou NEWEST)
        const hasOldest = labelsId.includes(SORT_TYPES.OLDEST);
        const hasNewest = labelsId.includes(SORT_TYPES.NEWEST);

        if (hasOldest || hasNewest) {
          // Tri par date (ancien ou récent)
          const otherLabels = labelsId.filter(
            (id) => id !== SORT_TYPES.OLDEST && id !== SORT_TYPES.NEWEST
          );

          // Si seulement tri par date sans autres labels
          if (otherLabels.length === 0) {
            candidatePosts.sort((a, b) => {
              const dateA = new Date(a.createdAt).getTime();
              const dateB = new Date(b.createdAt).getTime();
              return hasOldest ? dateA - dateB : dateB - dateA;
            });
            // Prendre les premiers posts après tri
            candidatePosts = candidatePosts.slice(0, limit);
            callback({ posts: candidatePosts });
            return;
          }

          // Si tri par date + autres labels, filtrer d'abord par labels
          // (on garde la logique simple pour l'instant)
        }

        // Filtrer par labels si spécifiés (et pas seulement tri par date)
        const labelIds = labelsId.filter(
          (id) => id !== SORT_TYPES.OLDEST && id !== SORT_TYPES.NEWEST
        );

        if (labelIds.length > 0) {
          // Récupérer les posts avec ces labels
          const postsWithLabels = await new Promise<Post[]>((resolve) => {
            db.transaction((tx) => {
              const placeholders = labelIds.map(() => '?').join(',');
              const excludeUsed = postIdUsed.length > 0
                ? `AND p.id NOT IN (${postIdUsed.map(() => '?').join(',')})`
                : '';

              tx.executeSql(
                `SELECT DISTINCT p.* FROM posts p
                 INNER JOIN post_labels pl ON p.id = pl.postId
                 WHERE pl.labelId IN (${placeholders})
                 ${excludeUsed}
                 ORDER BY p.createdAt DESC;`,
                [...labelIds, ...(postIdUsed.length > 0 ? postIdUsed : [])],
                (tx, results) => {
                  const posts: Post[] = [];
                  for (let i = 0; i < results.rows.length; i++) {
                    posts.push(results.rows.item(i));
                  }
                  resolve(posts);
                },
                () => resolve([])
              );
            });
          });

          if (postsWithLabels.length > 0) {
            candidatePosts = postsWithLabels;
          }
        }
      }

      // 3. Si aucun post actuel n'est spécifié (premier chargement ou refresh), sélectionner un post random
      // mais favoriser ceux avec viewCount faible pour éviter la répétition
      if (!currentPostId || currentPostId === 0) {
        if (candidatePosts.length === 0) {
          callback({ posts: [] });
          return;
        }

        // Calculer un poids pour chaque post basé sur viewCount (plus viewCount est faible, plus le poids est élevé)
        // Cela permet de favoriser les posts peu vus tout en gardant du hasard
        const postsWithWeight = candidatePosts.map((post: any) => {
          const viewCount = post.viewCount || 0;
          // Poids inversement proportionnel à viewCount + 1
          // Plus viewCount est faible, plus le poids est élevé
          // Exemple: viewCount=0 -> poids=100, viewCount=1 -> poids=50, viewCount=2 -> poids=33, etc.
          const weight = 100 / (viewCount + 1);
          
          return {
            post,
            weight,
            viewCount
          };
        });

        // Sélectionner le premier post de manière pondérée (weighted random)
        // Les posts avec un poids élevé ont plus de chances d'être sélectionnés
        const totalWeight = postsWithWeight.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        
        let selectedFirstPost = postsWithWeight[0].post; // Fallback par défaut
        for (const item of postsWithWeight) {
          random -= item.weight;
          if (random <= 0) {
            selectedFirstPost = item.post;
            break;
          }
        }

        // Retirer le post sélectionné de la liste des candidats pour les autres posts
        const remainingPosts = candidatePosts.filter((p: any) => p.id !== selectedFirstPost.id);
        
        // Pour les autres posts, mélanger aléatoirement
        const shuffledRemaining = remainingPosts.sort(() => Math.random() - 0.5);
        
        // Construire la liste finale : premier post sélectionné + autres posts mélangés
        const selectedPosts = [selectedFirstPost, ...shuffledRemaining].slice(0, limit);
        
        const firstPost = selectedFirstPost as any;
        console.log(`🎲 Post random sélectionné: ID=${firstPost?.id}, viewCount=${firstPost?.viewCount || 0} (poids=${postsWithWeight.find((p: any) => p.post.id === firstPost.id)?.weight.toFixed(2)})`);
        
        callback({ posts: selectedPosts });
        return;
      }

      // 4. Appliquer les tamis dans l'ordre
      console.log(
        `🚀 Démarrage de l'algorithme avec ${candidatePosts.length} candidats initiaux`
      );

      // Tamis 1: Cohérence structurelle (sélectionne 30-40% des meilleurs)
      const afterSieve1 = await sieve1_StructuralCoherence(
        currentPostId,
        candidatePosts
      );

      if (afterSieve1.length === 0) {
        console.warn('⚠️ Aucun candidat après sieve1, retour de candidats aléatoires');
        // Fallback: retourner quelques candidats aléatoires
        const fallbackPosts = candidatePosts
          .sort(() => Math.random() - 0.5)
          .slice(0, limit);
        callback({ posts: fallbackPosts });
        return;
      }

      // Tamis 2: Intention utilisateur (multiplie TableU avec TableS)
      const afterSieve2 = await sieve2_UserIntention(
        currentPostId,
        afterSieve1
      );

      // Tamis 3: Récence (exclut les posts vus récemment)
      const afterSieve3 = await sieve3_Recency(afterSieve2);

      if (afterSieve3.length === 0) {
        console.warn('⚠️ Aucun candidat après sieve3 (Df), retour de candidats après sieve2');
        // Fallback: utiliser les candidats après sieve2
        const fallbackPosts = afterSieve2
          .slice(0, limit)
          .map((c) => c.post);
        callback({ posts: fallbackPosts });
        return;
      }

      // Tamis 4: Exploration (pénalise les chemins sur-exploités)
      const afterSieve4 = await sieve4_Exploration(
        currentPostId,
        afterSieve3
      );

      // 5. Sélection finale : prendre les meilleurs candidats selon le poids final
      const finalCandidates = afterSieve4
        .sort((a, b) => b.weight - a.weight) // Trier par poids décroissant
        .slice(0, limit) // Prendre les N meilleurs
        .map((c) => c.post); // Extraire uniquement les posts

      console.log(
        `✅ Algorithme terminé: ${finalCandidates.length} posts recommandés`
      );

      // 6. Enregistrer l'exploration pour chaque chemin emprunté
      // (en arrière-plan, ne pas bloquer le retour)
      finalCandidates.forEach((post) => {
        recordExploration(currentPostId, post.id).catch((error) => {
          console.error(
            `Erreur enregistrement exploration ${currentPostId} -> ${post.id}:`,
            error
          );
        });
      });

      callback({ posts: finalCandidates });
    } catch (error) {
      console.error('Erreur dans l\'algorithme principal:', error);
      callback({
        posts: [],
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  };

  // Lancer l'algorithme
  runAlgorithm();
};
