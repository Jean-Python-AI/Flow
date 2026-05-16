import { useState } from "react";
// Import du DB
import { Post } from "../../types/Post";
import { getPostById, getAllPosts } from "../../DataBase/postsRepository";
import { insertTableSLinkWeight_Date, insertTableSLinkWeight_Labels, insertTableSLinkWeight_TextLength, insertTableSLinkWeight_ModifyAfter, getTableSLinkWeight } from "../../DataBase/TableSRepository";
import { getLabelsByPostId } from "../../DataBase/labelsRepository";


// Enregistre les postes modifié
let modifiedPosts: number[] = [];


export function useTableS() {

    // Création d'un nouveau post ------------------------------------------
    // Calcul de proximité via Date avec tous les autres posts
    const createNewLinkTableS = async(postId:number | null) => {
        // Vérifier que le post n'est pas null et a une date de création
        if (!postId) {
            console.warn("createNewPost: post is null or missing createdAt");
            return;
        }
        const post = await getPostById(postId);
        if (!post || !post.data.createdAt) {
            console.warn("createNewPost: post not found or missing createdAt");
            return;
        }

        // Récupérer tous les autres posts (exclure le post actuel)
        const allPosts = await getAllPosts();
        const otherPosts = allPosts.filter(p => p.id !== postId);

        if (otherPosts.length === 0) {
            console.log("createNewPost: aucun autre post trouvé, pas de calcul de proximité");
            return;
        }

        const postCreatedAt = new Date(post.data.createdAt).getTime();

        // Calculer la proximité avec chaque autre post
        for (const otherPost of otherPosts) {
            if (!otherPost.createdAt) {
                console.warn(`createNewPost: post ${otherPost.id} n'a pas de createdAt, ignoré`);
                continue;
            }

            const otherPostCreatedAt = new Date(otherPost.createdAt).getTime();
            
            // Calcul de la différence en jours entre les deux dates de création
            const deltaMs = Math.abs(postCreatedAt - otherPostCreatedAt);
            const deltaDays = deltaMs / (1000 * 60 * 60 * 24);

            // Calcul de la proximité sur 15 points
            const proximity = 15 * Math.exp(((-Math.log(2)) / 30) * deltaDays);

            if (proximity < 2) {
                // Proximité entre les deux poste <2, liens ignoré
                continue;
            } else {
                
                console.log(
                    `Proximité entre post ${postId} et post ${otherPost.id} => Proximité: ${proximity.toFixed(2)}/15 DATE`
                );

                // Enregistrer dans TableS
                // ForceDate = proximité (arrondie à l'entier le plus proche car INTEGER)
                // Weight = ajouter la proximité au Weight existant
                try {
                    await insertTableSLinkWeight_Date(
                        post.data.id,
                        otherPost.id,
                        Math.round(proximity),
                        proximity
                    );
                } catch (error) {
                    console.error(
                        `Erreur lors de l'enregistrement du lien entre post ${post.data.id} et post ${otherPost.id}:`,
                        error
                    );
                }
            };
        }

        console.log(`createNewPost: calculs terminés pour le post ${post.data.id} avec ${otherPosts.length} autres posts`);
    };

    // Modification d'un post -----------------------------------------------
    // Mise à jour des labels
    const updateLabels = async (postId:number) => {
        try {
            const allPosts = await getAllPosts();
            const allPostIds = allPosts.filter(p => p.id !== postId);
            
            const postLabels = await getLabelsByPostId(postId);
            const postLabelIds = postLabels.map(label => label.id);

            // S'assurer que tous les liens existent dans TableS entre postId et tous les autres posts
            // IMPORTANT: Attendre que tous les liens soient créés avant de les mettre à jour
            await createNewLinkTableS(postId);

            // Calculer la proximité basée sur les labels avec tous les autres posts
            // Utiliser Promise.allSettled pour gérer toutes les promesses même si certaines échouent
            const updatePromises = allPostIds.map(async (otherPost) => {
                try {
                    const otherPostLabels = await getLabelsByPostId(otherPost.id);
                    const otherPostLabelIds = otherPostLabels.map(label => label.id);

                    // Calcul du nombre de labels communs et différents
                    const commonLabelCount = postLabelIds.filter(id => otherPostLabelIds.includes(id)).length;
                    // Calculer le nombre de labels différents (différence symétrique)
                    // Labels uniquement dans post1 + labels uniquement dans post2
                    const labelsOnlyInPost1 = postLabelIds.filter(id => !otherPostLabelIds.includes(id));
                    const labelsOnlyInPost2 = otherPostLabelIds.filter(id => !postLabelIds.includes(id));
                    const uniqueLabelsCount = (labelsOnlyInPost1.length + labelsOnlyInPost2.length)/2; // Pour calculer la moyenne de labels différents dans les deux posts
                    
                    if (uniqueLabelsCount === 0 && commonLabelCount === 0) {  // Éviter la division par zéro
                        console.log(`Aucun label pour les deux posts ${postId} et ${otherPost.id}, proximité de 0`);
                        return;
                    }
                    
                    const proximity = ((3000 * commonLabelCount) / (100*(uniqueLabelsCount+commonLabelCount)));

                    if (proximity < 7) {
                        // Proximité entre les deux poste <7, liens ignoré
                        return;
                    }

                    // Attendre la mise à jour et gérer les erreurs
                    try {
                        await insertTableSLinkWeight_Labels(
                            postId,
                            otherPost.id,
                            Math.round(Number(proximity))
                        );
                        console.log(
                            `Proximité entre post ${postId} et post ${otherPost.id} => Proximité: ${proximity}/30 LABEL`
                        );
                    } catch (error) {
                        // Erreur silencieuse si le lien n'existe pas (c'est normal si le lien n'a pas encore été créé)
                        if (error && typeof error === 'object' && 'message' in error) {
                            const errorMessage = String(error.message);
                            // Ne logger que les erreurs non liées à l'absence de lien
                            if (!errorMessage.includes('lien n\'existe pas') && !errorMessage.includes('link does not exist')) {
                                console.error(
                                    `Erreur lors de l'enregistrement du lien de labels entre post ${postId} et post ${otherPost.id}:`,
                                    error
                                );
                            }
                        }
                    }
                } catch (error) {
                    console.error(
                        `Erreur lors du traitement des labels pour le post ${otherPost.id}:`,
                        error
                    );
                }
            });

            // Attendre que toutes les mises à jour soient terminées (même si certaines échouent)
            await Promise.allSettled(updatePromises);
            console.log(`updateLabels terminé pour le post ${postId}`);
        } catch (error) {
            console.error(`Erreur critique dans updateLabels pour le post ${postId}:`, error);
        }
    };

    // Mise à jour de la longueur du texte
    const updateTextLength = async (postId:number, newText:string) => {
        const TextLength = newText.length;

        const allPosts = await getAllPosts();
        const allPostIds = allPosts.filter(p => p.id !== postId);
        for (const otherPost of allPostIds) {
            // Calcul de la proximité basée sur la longueur du texte
            const otherPostTextLength = otherPost.text ? otherPost.text.length : 0;
            const lengthDifference = Math.abs(TextLength - otherPostTextLength);

            // Proximité sur 5 points
            const proximity = (25/Math.max(TextLength, otherPostTextLength)) * Math.min(TextLength, otherPostTextLength);

            console.log(
                `Proximité entre post ${postId} et post ${otherPost.id} => Proximité: ${proximity.toFixed(2)}/25 TEXTLENGHT`
            );

            insertTableSLinkWeight_TextLength(
                postId,
                otherPost.id,
                Math.round(Number(proximity))
            ).catch((error: unknown) => {
                console.error(
                    `Erreur lors de l'enregistrement du lien de longueur de texte entre post ${postId} et post ${otherPost.id}:`,
                    error
                );
            });
        };
    };

    // Mise à jour de "modifié après les 3 autres" (Attention, [dernier modifier, avant dernier modifier , modifier en permier])
    const updateModifiedAfterOthers = (postId:number) => {
        // Distribution des points en fonction de l'ordre de modification
        const first = postId===modifiedPosts[0]? -1 : modifiedPosts[0]? modifiedPosts[0] : -1;
        const second = postId===modifiedPosts[1] || modifiedPosts[1]===first? -1 : modifiedPosts[1]? modifiedPosts[1] : -1;
        const third = postId===modifiedPosts[2] || modifiedPosts[2]===first || modifiedPosts[2]===second? -1 : modifiedPosts[2]? modifiedPosts[2] : -1;

        // Calcul
        insertTableSLinkWeight_ModifyAfter(postId, first, second, third);

        // Mise à jour des postes modifiés
        modifiedPosts = [postId, ...modifiedPosts].slice(0, 3);
        console.log("Posts modifiés mis à jour :", modifiedPosts);
    };

    const ReadLink = async (postId: number) => {
        const allPosts = await getAllPosts();
        const allPostIds = allPosts.filter(p => p.id !== postId);
        console.log(`Lecture des liens pour le post ${postId}:`);
        for (const otherPost of allPostIds) {
            try {
                const weight = await getTableSLinkWeight(postId, otherPost.id);
                const weightValue = weight !== null ? weight : 0;
                console.log(`Weight entre post ${postId} et post ${otherPost.id}: ${weightValue}`);
            } catch (error) {
                console.error(`Erreur lors de la lecture du poids entre post ${postId} et post ${otherPost.id}: `, error);
            }
        }
    }

    return {
        createNewPost: createNewLinkTableS,
        updateLabels,
        updateTextLength,
        updateModifiedAfterOthers,
        ReadLink,
    };
};