import db from '../dataBase';

// Read all of the Post
export const ReadPosts = (callback: (rows: {id: number, parentId: number, title: string, text: string}[]) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      "SELECT * FROM posts;",
      [],
      (_, results) => {
        const rows = results.rows.raw(); // retourne un tableau d'objets
        callback(rows);
      },
      (_, error) => {
        console.log("Erreur with putting data in a list:", error);
        return false;
      }
    );
  });
};

// Lire un Post depuis une ID
export const ReadPostById = (id: number, callback: (post: {id: number, parentId: number, title: string, text: string}) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      "SELECT * FROM posts WHERE id = ?;",
      [id],
      (_, results) => {
        const rows = results.rows.raw();
        if (rows.length > 0) {
          callback(rows[0]);
        }
      },
      (_, error) => {
        console.log("Erreur reading post by id:", error);
        return false;
      }
    );
  });
};