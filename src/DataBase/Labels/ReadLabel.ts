import db from '../dataBase';

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

export const ReadLabelsFrom_List = (
  labelIds: number[],
  callback: (rows: { id: number; name: string; color: string }[]) => void
) => {
  if (!labelIds || labelIds.length === 0) {
    callback([]);
    return;
  }

  // Génère un nombre de "?" égal au nombre d’IDs
  const placeholders = labelIds.map(() => '?').join(',');

  console.log(labelIds)

  const query = `SELECT * FROM labels WHERE id IN (${placeholders});`;

  db.transaction(tx => {
    tx.executeSql(
      query,
      labelIds, // <--- On passe directement la liste ici
      (_, results) => {
        const rows = results.rows.raw();
        callback(rows);
      },
      (_, error) => {
        console.log("Erreur lors de la lecture des labels:", error);
        return false;
      }
    );
  });
};
