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
        text TEXT,
        date TEXT DEFAULT (datetime('now', 'localtime'))
        colors TEXT
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
    
    // Table 5) Post Labels -----------------------------------------    
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS post_labels (
        postId INTEGER,
        labelId INTEGER,
        PRIMARY KEY (postId, labelId),
        FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (labelId) REFERENCES labels(id) ON DELETE CASCADE
      );`,
      [],
      () => console.log('SQLite : table 4 => OK'),
      (_, error) => { console.log('Error creation table 4: ', error); return false; }
    );

    // Nettoyer les données orphelines après création des tables
    console.log('SQLite : Nettoyage des données orphelines...');
    CleanCategory();
    CleanPosts();
    
    // Mettre à jour les posts existants qui n'ont pas de date
    console.log('SQLite : Mise à jour des dates manquantes...');
    tx.executeSql(
      "UPDATE posts SET date = datetime('now', 'localtime') WHERE date IS NULL OR date = '';",
      [],
      () => console.log('SQLite : Dates mises à jour'),
      (_, error) => { console.log('Error updating dates: ', error); return false; }
    );
  });
};


export default db;
