import db from '../dataBase';
import { ReadCategory } from '../Category/Read';
import { ReadPosts } from './Read';

export const CleanPosts = () => {
  // Lire TOUTES les catégories (pas seulement celles avec parentId = 0)
  db.transaction(tx => {
    tx.executeSql(
      "SELECT * FROM category;",
      [],
      (_, results) => {
        const categories = results.rows.raw();
        const validIds = categories.map(c => c.id);

        ReadPosts((posts) => {
          posts.forEach(post => {
            if (!validIds.includes(post.parentId)) {
              // Supprime le post orphelin
              db.transaction(tx2 => {
                tx2.executeSql(
                  "DELETE FROM posts WHERE id = ?;",
                  [post.id],
                  () => console.log("Post supprimé, parentId inexistant:", post.id),
                  (_, error) => { console.log("Erreur suppression post:", error); return false; }
                );
              });
            }
          });
        });
      },
      (_, error) => { console.log("Erreur lecture catégories:", error); return false; }
    );
  });
};
