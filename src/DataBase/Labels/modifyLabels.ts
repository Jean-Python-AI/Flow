import db from '../dataBase';

export const ModifyLabel = (
  id: number,
  name: string,
  color?: string,
  callback?: (success: boolean) => void
) => {
  db.transaction(tx => {
    if (color !== undefined) {
      tx.executeSql(
        `UPDATE labels
         SET name = ?, color = ?
         WHERE id = ?;`,
        [name, color, id],
        (_, result) => {
          console.log('Post updated successfully', result);
          if (callback) callback(true);
        },
        (_, error) => {
          console.log('Error updating post:', error);
          if (callback) callback(false);
          return false;
        }
      );
    } else {
      tx.executeSql(
        `UPDATE labels
         SET name = ?
         WHERE id = ?;`,
        [name, id],
        (_, result) => {
          console.log('Post updated successfully', result);
          if (callback) callback(true);
        },
        (_, error) => {
          console.log('Error updating post:', error);
          if (callback) callback(false);
          return false;
        }
      );
    }
  });
};
