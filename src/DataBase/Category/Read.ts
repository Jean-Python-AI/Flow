import db from '../dataBase';

export const ReadCategory = (parentId:number, callback: (rows: {id: number, name: string, parentId: number}[]) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      "SELECT * FROM category WHERE parentId = ?;",
      [parentId],
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