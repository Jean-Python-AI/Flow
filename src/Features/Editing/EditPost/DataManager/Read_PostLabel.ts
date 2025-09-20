import db from '../../../../DataBase/dataBase';


export const ReadLabelsByPostId = (postId: number, callback: (labelIds: number[]) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      "SELECT labelId FROM post_labels WHERE postId = ?;",
      [postId],
      (_, results) => {
        // rows.raw() renvoie un tableau d'objets {labelId: 1}, ...
        const rows = results.rows.raw();
        // On ne garde que les id des labels
        const labelIds = rows.map(row => row.labelId);
        callback(labelIds);
      },
      (_, error) => {
        console.log("Erreur reading labels for post:", error);
        return false;
      }
    );
  });
};
