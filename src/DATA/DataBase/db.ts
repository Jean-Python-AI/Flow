import SQLite from 'react-native-sqlite-storage'

// Ouvre la base
export const db = SQLite.openDatabase(
  { name: 'myapp.db', location: 'default' },
  () => {},
  (error) => console.error('Erreur ouverture DB:', error)
);