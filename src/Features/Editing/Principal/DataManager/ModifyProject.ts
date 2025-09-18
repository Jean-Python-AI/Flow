import db from '../../../../DataBase/dataBase';

export const ModifyProject = (
  id: number,
  name: string,
  callback?: (success: boolean) => void
) => {
  db.transaction(tx => {
    tx.executeSql(
      `UPDATE projects
       SET name = ?
       WHERE id = ?;`,
      [name, id],
      (_, result) => {
        console.log('Project updated successfully', result);
        if (callback) callback(true);
      },
      (_, error) => {
        console.log('Error updating project:', error);
        if (callback) callback(false);
        return false;
      }
    );
  });
};
