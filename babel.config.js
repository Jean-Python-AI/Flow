module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['transform-remove-console', { exclude: ['error', 'warn'] }], // Pour désactiver la console
    'react-native-reanimated/plugin',
  ],
};