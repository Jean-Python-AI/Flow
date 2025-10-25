import SQLite from 'react-native-sqlite-storage';


// DEBUG utile en dev
SQLite.DEBUG(true);

// Ouvrir / créer la DB
const db = SQLite.openDatabase(
  { name: 'myapp.db', location: 'default' },
  () => console.log('SQLite : DB ouverte'),
  (err) => console.log('SQLite erreur ouverture :', err)
);



// DATABASE ==================================================================
// Créer les tables (à appeler une seule fois au démarrage)
export const createTables = async (): Promise<void> => {
  return new Promise((resolve, reject) => {

    db.transaction(tx => {
      tx.executeSql("PRAGMA foreign_keys = ON;");

      // User Tables ---------------------------------------------------
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS user (
          name TEXT,
          screenDayTime INTEGER
        );`,
        [],
        () => console.log('0 : Table Users => OK'),
        (_, error) => { console.log('Error creation table user: ', error); return false; }
      );

      // Table 1) WorkSpace --------------------------------------------
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS workspace (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        );`,
        [],
        () => console.log('1 : Table WorkSpace => OK'),
        (_, error) => { console.log('Error creation table 1: ', error); return false; }
      )

      // Table 2) Projects ---------------------------------------------
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          parentId INTEGER,
          FOREIGN KEY (parentId) REFERENCES workspace(id) ON DELETE CASCADE
        );`,
        [],
        () => console.log('2 : Table Project => OK'),
        (_, error) => { console.log('Error creation table 2: ', error); return false; }
      );

      // Table 3) Category -------------------------------------------
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS category (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL CHECK(length(name) <= 50),
          parentId INTEGER,
          FOREIGN KEY (parentId) REFERENCES projects(id) ON DELETE CASCADE
        );`,
        [],
        () => {
          console.log('3 : Table Category => OK');
          // Nettoyer les éventuelles catégories orphelines
          tx.executeSql(
            `DELETE FROM category WHERE parentId NOT IN (SELECT id FROM projects);`,
            [],
            (_, result) => console.log(`Categories orphelines supprimées: ${result.rowsAffected}`),
            (_, error) => { console.log("Erreur nettoyage categories :", error); return false; }
          );
        },
        (_, error) => { console.log('Error creation table category:', error); return false; }
      );

      // Table 4) Posts -----------------------------------------------
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          parentId INTEGER,
          title TEXT NOT NULL,
          text TEXT,
          createdAt TEXT,
          FOREIGN KEY (parentId) REFERENCES category(id) ON DELETE CASCADE
        );`,
        [],
        () => {
          console.log('4 : Table Postes => OK');
          // Nettoyer les éventuelles catégories orphelines
          tx.executeSql(
            `DELETE FROM posts WHERE parentId NOT IN (SELECT id FROM category);`,
            [],
            (_, result) => console.log(`Posts orphelines supprimées: ${result.rowsAffected}`),
            (_, error) => { console.log("Erreur nettoyage Postes :", error); return false; }
          );
        },
        (_, error) => { console.log('Error creation table 4: ', error); return false; }
      );

      // Table 5) Labels ----------------------------------------------
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS labels (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          color TEXT NOT NULL
        );`,
        [],
        () => console.log('SQLite : table 5 => OK'),
        (_, error) => { console.log('Error creation table 5: ', error); return false; }
      );
      
      // Table 6) Post Labels -----------------------------------------
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS post_labels (
          postId INTEGER,
          labelId INTEGER,
          PRIMARY KEY (postId, labelId),
          FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
          FOREIGN KEY (labelId) REFERENCES labels(id) ON DELETE CASCADE
        );`,
        [],
        () => console.log('SQLite : table 6 => OK'),
        (_, error) => { console.log('Error creation table 6: ', error); return false; }
      );

      }, (err) => {
        console.log("Erreur création tables", err);
        reject(err);
      }, () => {
        console.log("Toutes les tables sont créées !");
        resolve();
      }
    );
    
  });
};


// Fonction de debug pour vérifier l'état de la base de données
export const debugDatabase = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Vérifier les tables existantes
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table';",
        [],
        (_, results) => {
          console.log('Tables existantes:', results.rows.raw());
          
          // Vérifier la structure de la table projects
          tx.executeSql(
            "PRAGMA table_info(projects);",
            [],
            (_, info) => {
              console.log('Structure de la table projects:', info.rows.raw());
              
              // Vérifier les contraintes de clé étrangère
              tx.executeSql(
                "PRAGMA foreign_key_list(projects);",
                [],
                (_, fk) => {
                  console.log('Contraintes FK de projects:', fk.rows.raw());
                  
                  // Vérifier les données existantes
                  tx.executeSql(
                    "SELECT * FROM projects;",
                    [],
                    (_, data) => {
                      console.log('Données dans projects:', data.rows.raw());
                      resolve();
                    },
                    (_, error) => {
                      console.log('Erreur lors de la lecture des données projects:', error);
                      resolve();
                    }
                  );
                },
                (_, error) => {
                  console.log('Erreur lors de la vérification des FK:', error);
                  resolve();
                }
              );
            },
            (_, error) => {
              console.log('Erreur lors de la vérification de la structure:', error);
              resolve();
            }
          );
        },
        (_, error) => {
          console.log('Erreur lors de la vérification des tables:', error);
          reject(error);
        }
      );
    });
  });
};

// Fonction pour réinitialiser complètement la base de données (à utiliser en cas de problème)
export const resetDatabase = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Supprimer toutes les tables
      tx.executeSql("DROP TABLE IF EXISTS post_labels;");
      tx.executeSql("DROP TABLE IF EXISTS labels;");
      tx.executeSql("DROP TABLE IF EXISTS posts;");
      tx.executeSql("DROP TABLE IF EXISTS category;");
      tx.executeSql("DROP TABLE IF EXISTS projects;");
      tx.executeSql("DROP TABLE IF EXISTS workspace;");
      tx.executeSql("DROP TABLE IF EXISTS user;");
      
      console.log('Toutes les tables supprimées');
    }, (err) => {
      console.log("Erreur lors de la suppression des tables", err);
      reject(err);
    }, () => {
      console.log("Base de données réinitialisée !");
      resolve();
    });
  });
};

export default db;
