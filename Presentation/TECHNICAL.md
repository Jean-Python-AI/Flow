# Fonctionnement technique — Flow_

## Stack

React Native (sans Expo)

TypeScript

SQLite

Supabase (pour enregistrer les adresses des utilisateurs)

---

## Architecture

Le projet suit une **feature-based architecture** : chaque écran regroupe
ses propres composants, styles et logique. Les éléments partagés remontent
dans des dossiers globaux (`components/`, `styles/`, `DATA/`).

La logique métier est découplée de l'UI via des **custom hooks**
placés dans `DATA/Hooks/`. Les écrans ne font qu'appeler ces hooks
et afficher les données.

---

## Organisation du code
```
src/
├── components/       # Composants réutilisables dans toute l'application
├── styles/           # Styles globaux partagés
├── utils/            # Utilitaires (ex: gestion de la status bar)
├── DATA/
│   ├── Database/     # Initialisation SQLite et repositories (notes, catégories)
│   ├── Hooks/        # Custom hooks — toute la logique métier
│   ├── Services/     # Algorithme de tri/sélection des notes
│   └── types/        # Types TypeScript partagés (Post, Label)
└── Features/
├── Application/
│   ├── Editing/  # Écran de création et modification de notes
│   ├── Reading/  # Écran feed — lecture des notes
│   └── Settings/ # Écran paramètres
├── Load/         # Écran de chargement initial
└── StartingApp/  # Écrans affichés à la première ouverture
```
---

[Fonctionement de l'Algorithme](./ALGORITHME.md)
