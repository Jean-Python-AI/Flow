import db from '../../../../DataBase/dataBase';

export const ModifyPost = (
  id: number,
  title: string,
  text: string,
  callback?: (success: boolean) => void
) => {
  db.transaction(tx => {
    tx.executeSql(
      `UPDATE posts
       SET title = ?, text = ?
       WHERE id = ?;`,
      [title, text, id],
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
  });
};
