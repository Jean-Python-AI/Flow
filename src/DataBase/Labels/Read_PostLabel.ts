import React from 'react';
import db from '../dataBase';


type Label = { id: number; name: string; color: string };

export const ReadLabelsByPostId = (postId: number, callback: (labels: Label[]) => void) => {
  db.transaction(tx => {
    // Récupère les id des labels liés au post
    tx.executeSql(
      "SELECT labelId FROM post_labels WHERE postId = ?;",
      [postId],
      (_, results) => {
        const rows = results.rows.raw();
        const labelIds = rows.map(row => row.labelId); // Assure la casse correcte
        if (labelIds.length === 0) {
          callback([]);
          return;
        }
        // Récupère les infos des labels avec les ids trouvés
        const placeholders = labelIds.map(() => '?').join(',');
        tx.executeSql(
          `SELECT * FROM labels WHERE id IN (${placeholders});`,
          labelIds,
          (_, labelResults) => {
            const labelRows = labelResults.rows.raw();
            callback(labelRows);
            console.log("Labels info for post:", labelRows);
          },
          (_, error) => {
            console.log("Erreur reading label infos:", error);
            return false;
          }
        );
      },
      (_, error) => {
        console.log("Erreur reading labels for post:", error);
        return false;
      }
    );
  });
};
