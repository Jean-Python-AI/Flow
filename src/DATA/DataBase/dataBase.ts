import SQLite from 'react-native-sqlite-storage';


// DEBUG utile en dev
SQLite.DEBUG(false);

// Open / Create DB
const db = SQLite.openDatabase(
  { name: 'myapp.db', location: 'default' },
  () => {
    console.log('SQLite : DB ouverte');

    // Delete orphaned datas
    db.transaction(tx => {
      tx.executeSql('PRAGMA foreign_keys = ON;');

      // Delete orphaned post-labels
      tx.executeSql(
        `DELETE FROM post_labels WHERE postId NOT IN (SELECT id FROM posts);`
      );
    }),

    console.log('Nettoyage automatique terminé');
  },
  (err) => console.log('SQLite erreur ouverture :', err)
);

// Fonction pour ajouter une colonne si elle n'existe pas (synchrone dans la transaction)
function addColumnIfNotExists(tx: any, tableName: string, columnName: string, columnDef: string, callback: () => void) {
  tx.executeSql(
    `PRAGMA table_info(${tableName});`,
    [],
    (_: any, { rows }: any) => {
      const columnExists = Array.from(rows).some((row: any) => row.name === columnName);
      if (!columnExists) {
        tx.executeSql(
          `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef};`,
          [],
          () => {
            console.log(`Colonne ${columnName} ajoutée`);
            callback();
          },
          (_: any, error: any) => {
            console.error(`Erreur ajout colonne ${columnName}:`, error);
            callback(); // Appeler le callback même en cas d'erreur pour continuer
          }
        );
      } else {
        callback(); // La colonne existe déjà, continuer
      }
    },
    (_: any, error: any) => {
      console.error('Erreur PRAGMA:', error);
      callback(); // Appeler le callback même en cas d'erreur pour continuer
    }
  );
}


// DATABASE ==================================================================
// Créer les tables (à appeler une seule fois au démarrage)
export const createTables = async (): Promise<void> => {
  return new Promise((resolve, reject) => {

    db.transaction(tx => {
      tx.executeSql("PRAGMA foreign_keys = ON;");

      // Table 1) Posts -----------------------------------------------
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          text TEXT,
          createdAt TEXT,
          formatedDate TEXT,
          viewCount INTEGER DEFAULT 0,
          showCounter BOOLEAN DEFAULT 0,
          timeViewed INTEGER DEFAULT 0
        );`,
        [],
        () => {
          console.log('1 : Table Postes => OK');
          // Ajout des colones non existante
          addColumnIfNotExists(tx, 'posts', 'viewCount', 'INTEGER DEFAULT 0', () => {});
          addColumnIfNotExists(tx, 'posts', 'showCounter', 'BOOLEAN DEFAULT 0', () => {});
          addColumnIfNotExists(tx, 'posts', 'timeViewed', 'INTEGER DEFAULT 0', () => {});
          // Colonnes pour l'algorithme de recommandation
          addColumnIfNotExists(tx, 'posts', 'Df', 'REAL DEFAULT 0', () => {}); // Dot force (récence)
          addColumnIfNotExists(tx, 'posts', 'lastViewedAt', 'INTEGER DEFAULT 0', () => {}); // Timestamp de dernière vue
          // S'assurer que la colonne formatedDate existe bien sur TOUTES les bases,
          // même celles créées avant l'ajout de cette colonne.
          addColumnIfNotExists(
            tx,
            'posts',
            'formatedDate',
            'TEXT',
            () => {
              // La migration des anciens posts sera faite dans une transaction séparée
              // pour éviter les problèmes de callbacks asynchrones dans une transaction synchrone
              console.log('Colonne formatedDate vérifiée/ajoutée, migration des anciens posts sera effectuée après');
            }
          );
        },
        (_, error) => {
          console.log('Error creation table 1: ', error);
          return false;
        }
      );
      // Netoyage = Supprimer tous les postes vide
      tx.executeSql(
        `DELETE FROM posts WHERE text IS NULL OR text = '';`,
        [],
        () => {
          console.log('Posts sans texte supprimés');
        },
        (_, error) => {
          console.log('Erreur suppression posts sans texte:', error);
          return false;
        }
      );

      // Table 2) Images -----------------------------------------------
      // Réinitialiser les tables images et images_posts
      tx.executeSql(
        `DROP TABLE IF EXISTS images_posts;`,
        [],
        () => {
          console.log('Table images_posts supprimée');
        },
        (_, error) => {
          console.log('Erreur suppression images_posts:', error);
        }
      );
      tx.executeSql(
        `DROP TABLE IF EXISTS images;`,
        [],
        () => {
          console.log('Table images supprimée');
        },
        (_, error) => {
          console.log('Erreur suppression images:', error);
        }
      );

      // le "hash" permet de vérifier si l'image est déjà présente dans la database (évite les doublons)
      tx.executeSql(
        `CREATE TABLE images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          path_full TEXT NOT NULL,
          path_thumbnail TEXT NOT NULL,
          width INTEGER,
          height INTEGER,
          hash TEXT UNIQUE
        );`,
        [],
        () => console.log('2 : Table Images => OK'),
        (_, error) => { console.log('Error creation table 2: ', error); return false; }
      );

      // Table 2.5) Images-Posts ---------------------------------------
      tx.executeSql(
        `CREATE TABLE images_posts (
          postId INTEGER,
          imageId INTEGER,
          PRIMARY KEY (postId, imageId),
          FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
          FOREIGN KEY (imageId) REFERENCES images(id) ON DELETE CASCADE
        );`,
        [],
        () => console.log('2.5 : Table Images-Posts => OK'),
        (_, error) => { console.log('Error creation table 2.5: ', error); return false; }
      );

      // Table 3) Labels ----------------------------------------------
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS labels (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          color TEXT NOT NULL
        );`,
        [],
        () => console.log('3 : Table Labels => OK'),
        (_, error) => { console.log('Error creation table 3: ', error); return false; }
      );
      // Table 3.5) Post Labels -----------------------------------------
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS post_labels (
          postId INTEGER,
          labelId INTEGER,
          PRIMARY KEY (postId, labelId),
          FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
          FOREIGN KEY (labelId) REFERENCES labels(id) ON DELETE CASCADE
        );`,
        [],
        () => console.log('3.5 : Tables Post-Labels => OK'),
        (_, error) => { console.log('Error creation table 3.5: ', error); return false; }
      );


      // Algorithme ----------------------------------------------------
      // Supprimer l'ancienne table TableS pour créer la nouvelle
      //tx.executeSql(
        //`DROP TABLE IF EXISTS TableS;`,
        //[],
        //() => {
          //console.log('Ancienne table TableS supprimée');
        //},
        //(_, error) => {
          //console.log('Erreur suppression TableS:', error);
        //}
      //);
      // Table Structure (change peut)
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS TableS (
          poste1 INTEGER NOT NULL,
          poste2 INTEGER NOT NULL,
          ForceLabel INTEGER DEFAULT 0,
          ForceTextLength INTEGER DEFAULT 0,
          ForceDate INTEGER DEFAULT 0,
          ModifiedAfterOthers INTEGER DEFAULT 15,
          Weight INTEGER,
          UNIQUE(poste1, poste2)
        );`,
        [],
        () => console.log('TableS : Table Structure => OK'),
        (_, error) => { console.log('Error creation table TableS: ', error); return false; }
      );
      // Table Utilisation (change souvent)
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS TableU (
          poste INTEGER NOT NULL,
          toPoste INTEGER NOT NULL,
          timeBetweens INTEGER DEFAULT 0,
          clickAfter REAL DEFAULT 0.35,
          timeBYView REAL DEFAULT 0.4,
          Weight REAL DEFAULT 1,
          UNIQUE(poste, toPoste)
        );`,
        [],
        () => {
          console.log('TableU : Table Utilisation => OK');
        },
        (_, error) => {
          console.log('Error creation table TableU:', error);
          return false;
        }
      );
      // Table Exploration (Ef) - pour suivre les chemins explorés
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS TableEf (
          poste1 INTEGER NOT NULL,
          poste2 INTEGER NOT NULL,
          explorationCount INTEGER DEFAULT 0,
          lastExploredAt INTEGER DEFAULT 0,
          UNIQUE(poste1, poste2)
        );`,
        [],
        () => {
          console.log('TableEf : Table Exploration => OK');
        },
        (_, error) => {
          console.log('Error creation table TableEf:', error);
          return false;
        }
      );

      // Nettoyage = Supprimer les liens TableS avec des IDs de posts inexistants
      tx.executeSql(
        `DELETE FROM TableS 
         WHERE poste1 NOT IN (SELECT id FROM posts) 
            OR poste2 NOT IN (SELECT id FROM posts);`,
        [],
        () => {
          console.log('Liens TableS orphelins supprimés');
        },
        (_, error) => {
          console.log('Erreur suppression liens TableS orphelins:', error);
          return false;
        }
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

// Fonction de migration pour TableU - Ajouter les colonnes manquantes
export const migrateTableU = async (): Promise<void> => {
  return new Promise((resolve) => {
    // Timeout de sécurité pour éviter que la Promise ne reste bloquée
    const timeout = setTimeout(() => {
      console.log('⚠️ Migration TableU timeout après 3s, résolution forcée');
      resolve();
    }, 3000);

    db.transaction((tx) => {
      // Vérifier si la table existe
      tx.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='TableU';`,
        [],
        (_, results) => {
          if (results.rows.length === 0) {
            console.log('Table TableU n\'existe pas, migration ignorée');
            clearTimeout(timeout);
            resolve();
            return;
          }
          
          // Vérifier quelles colonnes existent déjà
          tx.executeSql(
            `PRAGMA table_info(TableU);`,
            [],
            (_, pragmaResults) => {
              const existingColumns = new Set<string>();
              for (let i = 0; i < pragmaResults.rows.length; i++) {
                const row = pragmaResults.rows.item(i);
                if (row && row.name) {
                  existingColumns.add(row.name);
                }
              }
              
              const columnsToAdd = [
                { name: 'timeBetweens', def: 'INTEGER DEFAULT 0' },
                { name: 'clickAfter', def: 'REAL DEFAULT 0.35' },
                { name: 'timeBYView', def: 'REAL DEFAULT 0.4' },
                { name: 'Weight', def: 'REAL DEFAULT 1' }
              ];
              
              let pendingOperations = 0;
              let completedOperations = 0;
              
              columnsToAdd.forEach((col) => {
                if (!existingColumns.has(col.name)) {
                  pendingOperations++;
                  tx.executeSql(
                    `ALTER TABLE TableU ADD COLUMN ${col.name} ${col.def};`,
                    [],
                    () => {
                      console.log(`✅ Colonne ${col.name} ajoutée à TableU`);
                      completedOperations++;
                      if (completedOperations >= pendingOperations) {
                        console.log('✅ Migration TableU terminée');
                        clearTimeout(timeout);
                        resolve();
                      }
                    },
                    (_, error) => {
                      console.error(`❌ Erreur ajout colonne ${col.name}:`, error);
                      completedOperations++;
                      if (completedOperations >= pendingOperations) {
                        clearTimeout(timeout);
                        resolve();
                      }
                    }
                  );
                }
              });
              
              // Si toutes les colonnes existent déjà
              if (pendingOperations === 0) {
                console.log('✅ Toutes les colonnes TableU existent déjà');
                clearTimeout(timeout);
                resolve();
              }
            },
            (_, error) => {
              console.error('Erreur PRAGMA table_info TableU:', error);
              clearTimeout(timeout);
              resolve();
            }
          );
        },
        (_, error) => {
          console.error('Erreur lors de la vérification de TableU:', error);
          clearTimeout(timeout);
          resolve();
        }
      );
    }, (error) => {
      console.error('Erreur transaction migration TableU:', error);
      clearTimeout(timeout);
      resolve();
    }, () => {
      // Transaction réussie
    });
  });
};

// Fonction de migration pour ajouter les colonnes Df et lastViewedAt à la table posts
export const migratePostsDfColumns = async (): Promise<void> => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.log('⚠️ Migration Posts Df columns timeout après 3s, résolution forcée');
      resolve();
    }, 3000);

    db.transaction((tx) => {
      // Vérifier si la table existe
      tx.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='posts';`,
        [],
        (_, results) => {
          if (results.rows.length === 0) {
            console.log('Table posts n\'existe pas, migration ignorée');
            clearTimeout(timeout);
            resolve();
            return;
          }
          
          // Vérifier quelles colonnes existent déjà
          tx.executeSql(
            `PRAGMA table_info(posts);`,
            [],
            (_, pragmaResults) => {
              const existingColumns = new Set<string>();
              for (let i = 0; i < pragmaResults.rows.length; i++) {
                const row = pragmaResults.rows.item(i);
                if (row && row.name) {
                  existingColumns.add(row.name);
                }
              }
              
              const columnsToAdd = [
                { name: 'Df', def: 'REAL DEFAULT 0' },
                { name: 'lastViewedAt', def: 'INTEGER DEFAULT 0' }
              ];
              
              let pendingOperations = 0;
              let completedOperations = 0;
              
              columnsToAdd.forEach((col) => {
                if (!existingColumns.has(col.name)) {
                  pendingOperations++;
                  tx.executeSql(
                    `ALTER TABLE posts ADD COLUMN ${col.name} ${col.def};`,
                    [],
                    () => {
                      console.log(`✅ Colonne ${col.name} ajoutée à posts`);
                      completedOperations++;
                      if (completedOperations >= pendingOperations) {
                        console.log('✅ Migration Posts Df columns terminée');
                        clearTimeout(timeout);
                        resolve();
                      }
                    },
                    (_, error) => {
                      console.error(`❌ Erreur ajout colonne ${col.name}:`, error);
                      completedOperations++;
                      if (completedOperations >= pendingOperations) {
                        clearTimeout(timeout);
                        resolve();
                      }
                    }
                  );
                }
              });
              
              // Si toutes les colonnes existent déjà
              if (pendingOperations === 0) {
                console.log('✅ Toutes les colonnes Df existent déjà dans posts');
                clearTimeout(timeout);
                resolve();
              }
            },
            (_, error) => {
              console.error('Erreur PRAGMA table_info posts:', error);
              clearTimeout(timeout);
              resolve();
            }
          );
        },
        (_, error) => {
          console.error('Erreur lors de la vérification de posts:', error);
          clearTimeout(timeout);
          resolve();
        }
      );
    }, (error) => {
      console.error('Erreur transaction migration Posts Df columns:', error);
      clearTimeout(timeout);
      resolve();
    }, () => {
      // Transaction réussie
    });
  });
};

// Fonction de migration pour mettre à jour formatedDate des anciens posts
export const migrateFormatedDateForOldPosts = async (): Promise<void> => {
  return new Promise((resolve) => {
    // D'abord, lire tous les posts à migrer dans une transaction
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT id, createdAt FROM posts WHERE formatedDate IS NULL OR formatedDate = '' OR TRIM(formatedDate) = '';`,
          [],
          (_tx, { rows }) => {
            const postsToUpdate: Array<{ id: number; createdAt: string }> = [];
            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              if (row && row.id && row.createdAt) {
                postsToUpdate.push({ id: row.id, createdAt: row.createdAt });
              }
            }

            if (postsToUpdate.length === 0) {
              console.log('✅ Aucun post à migrer pour formatedDate');
              resolve();
              return;
            }

            console.log(`🔄 Migration de formatedDate pour ${postsToUpdate.length} post(s)...`);

            // Fonction helper pour formater la date au format français
            const formatDateToFrench = (isoDateString: string): string => {
              try {
                if (!isoDateString || isoDateString === '' || isoDateString === '0') {
                  return 'Date inconnue';
                }
                const date = new Date(isoDateString);
                if (isNaN(date.getTime())) {
                  return 'Date inconnue';
                }
                return date.toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                });
              } catch (error) {
                console.error('Erreur formatage date:', error, isoDateString);
                return 'Date inconnue';
              }
            };

            // Mettre à jour tous les posts dans une seule transaction
            // On prépare toutes les valeurs formatées d'abord
            const updates: Array<{ id: number; formattedDate: string }> = postsToUpdate.map((post) => ({
              id: post.id,
              formattedDate: formatDateToFrench(post.createdAt),
            }));

            // Maintenant, mettre à jour chaque post dans une transaction séparée
            // pour garantir que chaque UPDATE est bien exécuté
            let updateIndex = 0;
            const updateNextPost = () => {
              if (updateIndex >= updates.length) {
                console.log(`✅ Migration terminée : formatedDate mis à jour pour ${updates.length} ancien(s) post(s) !`);
                resolve();
                return;
              }

              const update = updates[updateIndex];

              db.transaction(
                (updateTx) => {
                  updateTx.executeSql(
                    `UPDATE posts SET formatedDate = ? WHERE id = ?;`,
                    [update.formattedDate, update.id],
                    () => {
                      updateIndex++;
                      // Utiliser setTimeout pour permettre à la transaction de se terminer
                      setTimeout(updateNextPost, 0);
                    },
                    (_, error) => {
                      console.error(`❌ Erreur lors de la mise à jour formatedDate pour le post ${update.id}:`, error);
                      updateIndex++;
                      setTimeout(updateNextPost, 0);
                    }
                  );
                },
                (error) => {
                  console.error(`❌ Erreur de transaction pour le post ${update.id}:`, error);
                  updateIndex++;
                  setTimeout(updateNextPost, 0);
                },
                () => {
                  // Transaction réussie
                }
              );
            };

            // Démarrer la mise à jour du premier post
            updateNextPost();
          },
          (_, error) => {
            console.error('❌ Erreur lors de la lecture des posts à migrer:', error);
            resolve();
          }
        );
      },
      (error) => {
        console.error('❌ Erreur de transaction lors de la lecture pour migration formatedDate:', error);
        resolve();
      },
      () => {
        // Transaction de lecture réussie
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
      //tx.executeSql("DROP TABLE IF EXISTS post_labels;");
      //tx.executeSql("DROP TABLE IF EXISTS labels;");
      //tx.executeSql("DROP TABLE IF EXISTS posts;");
      
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
