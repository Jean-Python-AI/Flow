import SQLite from 'react-native-sqlite-storage';
import { CleanCategory } from './Category/Clean';
import { CleanPosts } from './Posts/Clean';

// DEBUG utile en dev
SQLite.DEBUG(true);

// Ouvrir / créer la DB
const db = SQLite.openDatabase(
  { name: 'myapp.db', location: 'default' },
  () => console.log('SQLite : DB ouverte'),
  (err) => console.log('SQLite erreur ouverture :', err)
);

// Créer les tables (à appeler une seule fois au démarrage)
export const createTables = (): void => {
  db.transaction(tx => {

    // Table 1) Projects ---------------------------------------------
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS projects (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT NOT NULL
       );`,
      [],
      () => console.log('SQLite : table 1 => OK'),
      (_, error) => { console.log('Error creation table 1: ', error); return false; }
    );

    // Table 2) Category -------------------------------------------
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS category (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL CHECK(length(name) <= 50),
        parentId INTEGER
      );`,
      [],
      () => console.log('SQLite : table 2 => OK'),
      (_, error) => { console.log('Error creation table 2: ', error); return false; }
    );

    // Table 3) Posts -----------------------------------------------
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        parentId INTEGER,
        title TEXT NOT NULL,
        text TEXT
      );`,
      [],
      () => console.log('SQLite : table 3 => OK'),
      (_, error) => { console.log('Error creation table 3: ', error); return false; }
    );

    // Table 4) Labels ----------------------------------------------
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS labels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        color TEXT NOT NULL
      );`,
      [],
      () => console.log('SQLite : table 4 => OK'),
      (_, error) => { console.log('Error creation table 4: ', error); return false; }
    );

    // Nettoyer les données orphelines après création des tables
    console.log('SQLite : Nettoyage des données orphelines...');
    CleanCategory();
    CleanPosts();
  });
};


export default db;
