import db from '../dataBase';


export const NewProject = (name: string, parentId: number, callback?: () => void) => {
  // Validation des paramètres
  if (!name || name.trim().length === 0) {
    console.log('Erreur: Le nom du projet ne peut pas être vide');
    return;
  }

  console.log(`Tentative de création du projet: "${name}" avec parentId: ${parentId}`);

  db.transaction(tx => {
    tx.executeSql("PRAGMA foreign_keys = OFF;");

    // Verification que le workspace où ont veut mettre le project existe bien
    tx.executeSql(
      "SELECT 1 FROM workspace WHERE id = ?;",
      [parentId],
      (_, result) => {
        if (result.rows.length > 0) {
          console.log('WorkSpace existant');

          // création du project
          tx.executeSql(
            `INSERT INTO projects (name, parentId) VALUES (?, ?);`,
            [name, parentId],
            (_, result) => {
              console.log(`Projet créé avec succès! ID: ${result.insertId}`);
              if (callback) callback();
            },
            (_, error) => {
              console.log('Erreur INSERT projet:', error);
              return false;
            }
          );

        } else {
          console.log('Pas de WorkSpace avec cet id');
        }
      },
      (_, error) => {
        console.log('Erreur SQL:', error);
        return false;
      }
    );
  });
};