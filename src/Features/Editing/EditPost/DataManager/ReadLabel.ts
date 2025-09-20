import db from '../../../../DataBase/dataBase';

export const ReadAllLabels = (callback: (rows: {id: number, name: string, color: string}[]) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      "SELECT * FROM labels;",
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

export const ReadLabelsFrom_ = (labelId: number, callback: (rows: {id: number, name: string, color: string}[]) => void) => {
    db.transaction(tx => {
    tx.executeSql(
      "SELECT * FROM labels WHERE id = ?;",
      [labelId],
      (_, results) => {
        const rows = results.rows.raw();
        callback(rows);
      },
      (_, error) => {
        console.log("Erreur with putting data in a list:", error);
        return false;
      }
    );
  });
}