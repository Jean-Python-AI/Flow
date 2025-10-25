import db from '../dataBase';

export const ReadProject = (parentId:number, callback: (rows: {id: number, name: string}[]) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      "SELECT * FROM projects WHERE parentId = ?;",
      [parentId],
      (_, results) => {
        const rows = results.rows.raw(); // retourne un tableau d'objets
        console.log('Project: ', rows)
        callback(rows);
      },
      (_, error) => {
        console.log("Erreur with putting data in a list:", error);
        return false;
      }
    );
  });
};