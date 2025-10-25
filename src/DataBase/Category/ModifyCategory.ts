import db from '../dataBase';

export const ModifyCategory = (
  id: number,
  name: string,
  callback?: (success: boolean) => void
) => {
  db.transaction(tx => {
    tx.executeSql(
      `UPDATE category
       SET name = ?
       WHERE id = ?;`,
      [name, id],
      (_, result) => {
        console.log('Category updated successfully', result);
        if (callback) callback(true);
      },
      (_, error) => {
        console.log('Error updating Category:', error);
        if (callback) callback(false);
        return false;
      }
    );
  });
};