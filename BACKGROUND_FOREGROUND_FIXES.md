# Fixes pour les problèmes de Background/Foreground

## Problèmes identifiés et corrigés

### 1. ✅ Gestion du lifecycle App (AppState)
**Problème** : L'app n'avait pas de gestion du cycle de vie, ce qui pouvait causer des reloads au retour en foreground.

**Solution** : Ajout d'un listener `AppState` dans `App.tsx` qui :
- Détecte quand l'app passe en background/foreground
- Rafraîchit les données critiques (session utilisateur) au retour en foreground
- Évite les reloads complets en ne rafraîchissant que ce qui est nécessaire
- Inclut un cleanup approprié pour éviter les fuites mémoire

**Fichier modifié** : `App.tsx`

### 2. ✅ ErrorBoundary global
**Problème** : Les erreurs JS non gérées pouvaient causer des crashes et des reloads complets.

**Solution** : Création d'un `ErrorBoundary` global qui :
- Catche toutes les erreurs JS non gérées
- Affiche une UI de fallback au lieu de crasher l'app
- Permet de réessayer sans reload complet
- Log les erreurs pour le debugging (en dev mode)

**Fichier créé** : `src/Components/ErrorBoundary.tsx`
**Fichier modifié** : `App.tsx` (ajout du ErrorBoundary autour de l'app)

### 3. ✅ Gestion des erreurs dans les hooks async
**Problème** : Les promises rejetées dans les hooks (`useLabel`, `useEditLabel`, `useEditPost`) n'étaient pas toujours gérées, causant des crashes.

**Solution** : Amélioration de la gestion des erreurs dans tous les hooks :
- Validation des paramètres avant les appels DB
- Try/catch appropriés avec fallbacks (tableaux vides au lieu de throw)
- Logs d'erreur détaillés pour le debugging
- Re-throw des erreurs seulement quand nécessaire pour que les composants puissent les gérer

**Fichiers modifiés** :
- `src/DATA/Hooks/Labels.ts`
- `src/DATA/Hooks/LabelEdit.ts`
- `src/DATA/Hooks/PostEdit.ts`

### 4. ✅ Cleanup dans les useEffect
**Problème** : Certains `useEffect` n'avaient pas de cleanup, causant des fuites mémoire et des mises à jour d'état sur des composants démontés.

**Solution** : Ajout de flags `isMounted` et cleanup dans les `useEffect` critiques :
- Vérification que le composant est toujours monté avant de mettre à jour l'état
- Cleanup approprié pour éviter les fuites mémoire
- Réinitialisation des états quand les composants se ferment

**Fichiers modifiés** :
- `src/Features/Application/Editing/Components/PopIn/Labels.tsx`

## Recommandations supplémentaires

### 1. Désactiver le live reload en production
Le live reload peut causer des reloads automatiques. Assurez-toi qu'il est désactivé en production :
- Dans le dev menu React Native, désactive "Fast Refresh" si nécessaire
- En production, le live reload ne devrait pas être actif

### 2. Optimisation de la mémoire
Pour les apps avec beaucoup de données :
- Considère utiliser `react-native-fast-list` ou `FlashList` au lieu de `FlatList` (déjà utilisé ✅)
- Limite les queries DB : utilise des paginations au lieu de `SELECT *`
- Persiste l'état critique avec `AsyncStorage` ou `MMKV` si nécessaire

### 3. Monitoring en production
Pour détecter les problèmes en production :
- Intègre un service de crash reporting (Sentry, Crashlytics)
- Ajoute des logs structurés pour tracker les changements d'AppState
- Monitor la mémoire avec Chrome DevTools

### 4. Tests
Pour tester les fixes :
1. Mettre l'app en background (bouton home)
2. Attendre 10-60 secondes
3. Revenir en foreground
4. Vérifier que l'app ne se recharge pas et que l'état est préservé
5. Vérifier les logs dans la console pour voir les changements d'AppState

## Notes techniques

### AppState dans React Native
- `active` : L'app est en foreground et reçoit des événements
- `background` : L'app est en background mais toujours en mémoire
- `inactive` : État transitoire (ex: pendant une transition)

### Gestion des erreurs
Les erreurs sont maintenant gérées à plusieurs niveaux :
1. **ErrorBoundary** : Catche les erreurs de rendu React
2. **Try/catch dans les hooks** : Gère les erreurs async
3. **Validation des paramètres** : Évite les erreurs avant qu'elles ne se produisent

### Cleanup patterns
Utilisation du pattern `isMounted` pour éviter les mises à jour d'état sur des composants démontés :
```typescript
useEffect(() => {
  let isMounted = true;
  // ... async operations
  return () => { isMounted = false; };
}, [dependencies]);
```

## Prochaines étapes (optionnel)

1. **Persistance d'état** : Si nécessaire, utilise `@react-native-async-storage/async-storage` pour sauvegarder l'état critique en background
2. **Navigation state persistence** : Utilise `@react-navigation/persist` si tu veux persister la navigation state
3. **Battery optimization** : Sur Android, demande une exemption de l'optimisation batterie si nécessaire
4. **Profiling** : Utilise React DevTools Profiler pour identifier les composants qui causent des re-renders inutiles

