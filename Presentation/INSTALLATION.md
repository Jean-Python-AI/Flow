# Installation

## Prérequis

- React Native CLI
- Un émulateur configuré ou un appareil physique

## Cloner le projet

```bash
git clone https://github.com/Jean-Python-AI/Flow
cd Flow
npm install
```

## Lancer le projet en développement

```bash
# Pour connecter un appareil physique
adb devices # permet de voire quelle machine a les permissions pour simuler l'app

# lancer le metro
npm start

# Android
npm run android

# iOS
cd ios && pod install && cd ..
npm run ios
```

## Générer un APK (Android)

```bash
cd android
./gradlew assembleRelease
```

L'APK généré se trouve dans `android/app/build/outputs/apk/release/`.