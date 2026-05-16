# Flow_

Flow_ est une application de prise de note pensée pour la relecture des notes.
Tu écrit et tu relis.

Par la suite, l'objectif est de permettre de collecter des postes provenant d'autre réseaux sociaux pour les relir dans Flow_


### 1. Stack Technique

- React Native v[version] [typescript ou pas : tsx] [sans expo]
- Backend: Supabase


### 2. Organisation du code

```md
.
├── src/
│   ├── components/
|   |   |   # les composants utilisé dans toute l'application
│   │   └── LabelsBuble.tsx
|   |
│   ├── DATA/
│   │   ├── Database
|   |   |   ├── dataBase.ts
|   |   |   ├── labelsRepository.ts
|   |   |   └── postsRepository.ts
|   |   ├── Hooks
|   |   |   ├── Labels.ts
|   |   |   ├── LabelEdit.ts
|   |   |   ├── Post.ts
|   |   |   └── ...
|   |   ├── Services
|   |   |   |   # Là où est actuelement le fichier algorithme
|   |   ├── types
|   |   |   |   # definition des types pour les variable Label et Post
|   |
│   ├── Features/
|   |   ├── Application
|   │   │   ├── Editing/
|   |   |   |   |   # Tous se qui concerne le screen Editing
|   |   |   |   ├── Components/
|   |   |   |   |   |   # Components strictement utilisé pour cette feature uniquement
|   |   |   |   |   ├── PopIn/
|   |   |   |   |   └── components...
|   |   |   |   └── screen.tsx
|   │   │   ├── Reading/
|   |   |   |   |   # Tous se qui concerne le screen Reading
|   |   |   |   ├── Components/
|   |   |   |   |   ├── PopIn/
|   |   |   |   |   ├── Posts/
|   |   |   |   |   └── components...
|   |   |   |   ├── Variables/
|   |   |   |   └── screen.tsx
|   │   │   ├── Settings/
|   |   |   |   |   # Tous se qui concerne le screen Settings
|   |   |   |   ├── Components/
|   |   |   |   |   ├── PopIn/
|   |   |   |   |   └── components...
|   |   |   |   └── screen.tsx
|   |   ├── Load/
|   |   |   |   # Le screen de chargement
|   |   |   └── screen.tsx
│   │   └── StartingApp/
|   |   |   |   # Les screens qui s'affiche lors de la première ouverture
|   |   |   └── FirstOpen.tsx
|   |
│   ├── styles/
│   │   |   # Tous les styles
│   |   ├── Button.tsx
│   |   ├── PopIn.tsx
│   │   └── ...
|   |
│   └── utils/
│       └── StatusBarNative.ts
|
└── App.tsx
```


```md
.
├── src/
│   ├── components/
|   |   ├── UI/
|   |   |   |   # Tous les style de l'UI
|   |   |   ├── Button.tsx
|   |   |   ├── PopIn.tsx
|   |   |   └── ...
|   |   |   # les composants utilisé dans toute l'application
|   |   ├── PopIn.tsx
│   │   └── LabelsBuble.tsx
|   |
│   ├── DataBase/
│   │   ├── Label/
|   |   |   |   # Tous se qui concerne la gestion des Labels dans la Database
|   |   |   ├── addLabel.ts
|   |   |   ├── modifyLabels.ts
|   |   |   ├── ReadLabel.ts
|   |   |   └── DeleteLabel.ts
|   |   ├── Posts/
|   |   |   |   # Tous se qui concerne la gestion des Posts dans la Database
|   |   |   └── ...
│   │   └── User/
|   |   |   |   # Tous se qui concerne la connection
|   |   |   └── ...
|   |
│   ├── Features/
│   │   ├── App/
|   │   │   ├── Editing/
|   |   |   |   |   # Tous se qui concerne le screen Editing
|   |   |   |   ├── Components/
|   |   |   |   |   |   # Components strictement utilisé pour cette feature uniquement
|   |   |   |   |   ├── PopIn/
|   |   |   |   |   └── components...
|   |   |   |   └── screen.tsx
|   │   │   ├── Reading/
|   |   |   |   |   # Tous se qui concerne le screen Reading
|   |   |   |   ├── Components/
|   |   |   |   |   ├── PopIn/
|   |   |   |   |   ├── Posts/
|   |   |   |   |   └── components...
|   |   |   |   ├── Variables/
|   |   |   |   └── screen.tsx
|   │   │   ├── Settings/
|   |   |   |   |   # Tous se qui concerne le screen Settings
|   |   |   |   ├── Components/
|   |   |   |   |   ├── PopIn/
|   |   |   |   |   └── components...
|   |   |   |   └── screen.tsx
|   |   └── Auth/
|   |   |   |   # Les screens pour la connection par Email
|   |   |   ├── SignUp/
|   |   |   ├── Login.tsx
|   |   |   └── screen.tsx
|   |   ├── Load/
|   |   |   |   # Le screen de chargement
|   |   |   └── screen.tsx
│   │   └── StartingApp/
|   |   |   |   # Les screens qui s'affiche lors de la première ouverture
|   |   |   ├── OnboardingScreens/
|   |   |   ├── FirstOpen.tsx
|   |   |   └── Onboarding.tsx
|   |
│   ├── styles/
│   │   |   # Tous les styles
|   |   ├── theme.tsx
|   |   ├── screens.tsx
│   │   └── ...
|   |
│   └── utils/
│       └── StatusBarNative.ts
|
└── App.tsx
```