import db from '../dataBase';
import { ReadCategory } from './Read';
import { ReadProject } from '../Projects/Read';

export const CleanCategory = () => {
  ReadProject((projects: {id: number, name: string}[]) => {
    const validProjectIds = projects.map(p => p.id);

    // Lire TOUTES les catégories (pas seulement celles avec parentId = 0)
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM category;",
        [],
        (_, results) => {
          const categories = results.rows.raw();
          categories.forEach(category => {
            if (!validProjectIds.includes(category.parentId)) {
              // Supprime la catégorie orpheline
              db.transaction(tx2 => {
                tx2.executeSql(
                  "DELETE FROM category WHERE id = ?;",
                  [category.id],
                  () => console.log("Catégorie supprimée, parentId inexistant:", category.id),
                  (_, error) => { console.log("Erreur suppression catégorie:", error); return false; }
                );
              });
            }
          });
        },
        (_, error) => { console.log("Erreur lecture catégories:", error); return false; }
      );
    });
  });
};