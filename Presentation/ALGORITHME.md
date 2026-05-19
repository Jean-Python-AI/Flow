# Algorithme — Fonctionnement

L'algorithme de Flow pour recommander les posts a été conçu sur mesure pour des contraintes d'exécution locale, sans dépendance à un modèle de ML externe.
L'objectif est de recommander des posts qui vont bien ensemble, tout en étant léger pour pouvoir tourner en local.

## Fonctionnement

Pour concevoir l'algorithme, je me suis inspiré de l'idée d'un réseau où tous les posts sont interconnectés.
Chaque post a donc des scores de liens avec les différents autres posts.
La version finale ressemble à une série de tamis dans lesquels on va tester les liens qu'a le dernier post affiché avec tous les autres, en se basant sur différents critères à chaque étape.

### Les différents tamis

#### 1. Tamis S — Similarité **S**tructurelle

Ce tamis permet de déterminer où il est cohérent d'aller.
Il est constitué d'un tableau dans lequel se trouve la force de chaque lien entre les posts.
Les poids des liens sont uniquement basés sur des éléments stables :
- Labels similaires
- Longueur du texte
- Date de création

Ce tamis évolue lentement et ne dépend pas de l'intention instantanée de l'utilisateur.

Voici à quoi ressemble le tableau du tamis S :

|     | A        | B        | C        | D        | ...      |
| --- | -------- | -------- | -------- | -------- | -------- |
| A   | 0        | Lf[AB]   | Lf[AC]   | Lf[AD]   | Lf[A...] |
| B   | Lf[AB]   | 0        | Lf[BC]   | Lf[BD]   | Lf[B...] |
| C   | Lf[AC]   | Lf[BC]   | 0        | Lf[CD]   | Lf[C...] |
| D   | Lf[AD]   | Lf[BD]   | Lf[CD]   | 0        | Lf[D...] |
| ... | Lf[A...] | Lf[B...] | Lf[C...] | Lf[D...] | 0        |

- **Lf[X,Y]** : **L**ink **f**orce structurelle entre les 2 posts.
- La diagonale est toujours à 0 (un post n'a pas de lien avec lui-même).

#### 2. Tamis U — Intention **U**tilisateur

Ce tamis filtre les posts en fonction des intentions de l'utilisateur.
Il est constitué d'un tableau similaire au tableau ci-dessus, mais basé sur :
- Les posts lus après un autre
- Les posts modifiés après un autre

Ce tableau se met à jour en permanence, il ne se réinitialise pas (contrairement au suivant) et n'élimine jamais un post, mais sert à influencer leur score.

#### 3. Tamis Df — Récence

Ce tamis empêche une répétition dans les posts affichés.
Df est un score qui indique la récence du dernier visionnage.
Df = 0 signifie que le post vient d'être vu.
À chaque nouveau post affiché, les autres posts voient leur Df augmenter.

#### 4. Tamis Ef — Exploration Force

Ce tamis sert à mesurer si un chemin entre deux posts a déjà été trop emprunté, pour empêcher l'algorithme de tourner en boucle.
Grâce à ce score, on pourra pénaliser les liens sur-exploités pour privilégier ceux qui sont jamais, voire peu utilisés.

### Fonctionnement de l'algorithme

#### Au lancement de l'application

L'algorithme affiche un post choisi au hasard.

#### Choix des posts suivants

Supposons que le dernier post affiché est **A**.

##### 1. Tamis S — cohérence structurelle
- On part de la ligne *A* sur le tableau S.
- On élimine les posts qui ont des liens trop faibles pour garder les 30 à 40 % des candidats les plus plausibles.

##### 2. Tamis U — intention utilisateur
- Aucun candidat n'est supprimé à cette étape. On pondère uniquement les scores des liens du tableau S avec les habitudes de l'utilisateur.
- Les candidats restants sont maintenant biaisés.

##### 3. Tamis Df — récence
- Les posts vus récemment sont supprimés.
- Filtrage strict.

##### 4. Tamis Ef — exploration
- Les chemins trop empruntés sont pénalisés.
- Les chemins peu explorés sont favorisés.

##### 5. Choix final

Une fois tous les tamis appliqués, il ne reste qu'un petit ensemble de candidats dont les scores ont été influencés.
La sélection finale se fait à ce moment-là : on choisit celui qui a le meilleur score.
Le post sélectionné devient le nouveau point de départ, son Df repasse à 0 et le cycle recommence.