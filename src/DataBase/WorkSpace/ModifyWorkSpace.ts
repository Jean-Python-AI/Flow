import db from '../dataBase';

export const ModifyWorkSpace = (
  id: number,
  name: string,
  callback?: (success: boolean) => void
) => {
  db.transaction(tx => {
    tx.executeSql(
      `UPDATE workspace
       SET name = ?
       WHERE id = ?;`,
      [name, id],
      (_, result) => {
        console.log('WorkSpace updated successfully', result);
        if (callback) callback(true);
      },
      (_, error) => {
        console.log('Error updating WorkSpace:', error);
        if (callback) callback(false);
        return false;
      }
    );
  });
};
