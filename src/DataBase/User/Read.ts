import db from '../dataBase';

export const ReadUser = (callback: (rows: {name: number, email: string}[]) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      "SELECT * FROM user;",
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