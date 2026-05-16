# Fonctionnement de l’algorithme

Ce document décrit le fonctionnement de l’algorithme de recommandation locale. L’objectif n’est pas de calculer un score unique, mais de faire évoluer un ensemble de candidats à travers plusieurs **tamis**, chacun ayant un rôle précis.

---

## 1. Représentation générale (graphe des postes)

Les postes (A, B, C, D, …) sont organisés sous forme de graphe. Chaque lien entre deux postes représente une proximité structurelle.

|     | A        | B        | C        | D        | ...      |
| --- | -------- | -------- | -------- | -------- | -------- |
| A   | 0        | Lf[AB]   | Lf[AC]   | Lf[AD]   | Lf[A...] |
| B   | Lf[AB]   | 0        | Lf[BC]   | Lf[BD]   | Lf[B...] |
| C   | Lf[AC]   | Lf[BC]   | 0        | Lf[CD]   | Lf[C...] |
| D   | Lf[AD]   | Lf[BD]   | Lf[CD]   | 0        | Lf[D...] |
| ... | Lf[A...] | Lf[B...] | Lf[C...] | Lf[D...] | 0        |

* **Lf[X,Y]** : force du lien structurel entre les postes X et Y.
* La diagonale est toujours à 0 (un poste n’a pas de lien avec lui-même).

Ce tableau change peu dans le temps.

---

## 2. Les forces individuelles

### Df (Dot force)

Df est une force **temporelle**, stockée par poste.

* Df = 0 signifie que le poste vient d’être vu.
* À chaque affichage d’un nouveau poste :

  * le poste affiché repasse à Df = 0
  * tous les autres postes voient leur Df augmenter progressivement

Df sert uniquement à empêcher la répétition récente. C’est un **tamis dur**.

---

## 3. Les tableaux internes

### Tableau S — Similarité structurelle (stable)

Ce tableau correspond aux **Lf**.

Il est basé uniquement sur des éléments relativement stables :

* labels similaires
* longueur du texte
* Date de création

Ce tableau :

* évolue lentement
* décrit la forme globale du graphe
* ne dépend pas directement de l’intention instantanée de l’utilisateur

Il sert à définir **où il est cohérent d’aller**.

---

### Tableau U — Intention utilisateur (dynamique)

Ce tableau capture l’**intention réelle** de l’utilisateur dans le temps.

Il est basé uniquement sur des actions observées :

* postes lus après d’autres
* postes souvent enchaînés
* postes fréquemment ouverts
* modifications successives

Ce tableau :

* se met à jour en permanence
* ne réinitialise pas à chaque session
* n’élimine jamais directement un poste

T est un **biais directionnel**, pas un filtre.

### Tamis Df — récence

Ce tamis est appliqué après les biais.

* Il ne modifie pas les probabilités
* Il ne favorise aucun poste
* Il exclut strictement les postes vus trop récemment

Df agit comme une contrainte temporelle : un poste récent est simplement indisponible à ce stade du parcours.

---

### Ef — Force d’exploration

Ef n’est pas un tableau de similarité.

Il sert à mesurer :

* les chemins déjà trop empruntés
* les zones jamais ou peu explorées

Ef :

* pénalise les liens sur-exploités
* favorise les liens peu ou jamais utilisés

Ef empêche l’algorithme de tourner en boucle.

---

## 4. Principe des tamis

Un tamis n’est pas un multiplicateur.
Il agit soit sur l’**ensemble des candidats**, soit sur leur **probabilité relative**.

Les tamis sont appliqués dans un ordre précis.

---

## 5. Fonctionnement de l’algorithme

### Au lancement de l’application

L’algorithme propose plusieurs postes provenant de zones différentes du graphe.
L’objectif est d’observer vers quelle zone l’utilisateur s’oriente.

---

### Génération d’une recommandation

Supposons que le dernier poste affiché est **A**.

1. **Tamis S — cohérence structurelle**

   * On part de la ligne/colonne A du tableau S
   * On élimine les liens trop faibles
   * On conserve environ 30–40 % des candidats les plus plausibles

2. **Tamis U — intention utilisateur**

   * Les candidats restants sont biaisés selon les habitudes de l’utilisateur
   * Aucun candidat n’est supprimé à cette étape, ont ne fait que multiplier les Weight de ce tableau avec ceux de la tableS

3. **Tamis Df — récence**

   * Les postes vus récemment sont supprimés
   * Filtrage strict

4. **Tamis Ef — exploration**

   * Les chemins trop empruntés sont pénalisés
   * Les chemins peu explorés sont favorisés

---

### Décision finale

Une fois tous les tamis appliqués :

* il reste un petit ensemble de candidats
* leurs probabilités ont été progressivement influencées

La sélection finale se fait à ce moment-là uniquement (choix du meilleur ou tirage pondéré).

Le poste sélectionné devient le nouveau point de départ, son Df repasse à 0, et le cycle recommence.

---

## 6. Idée clé

L’algorithme ne cherche jamais le meilleur poste trop tôt.
Il élimine lentement, biaise progressivement, et ne décide qu’à la fin.
