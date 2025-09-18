import db from '../../../../DataBase/dataBase';

export const NewPost = (parentId: number = 0, title: string = '', text?: string, callback?: (id: number) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO posts (parentId, title, text) VALUES (?, ?, ?);`,
      [parentId, title, text],
      (_, result) => { 
        const newId = result.insertId;
        if (callback) callback(newId);
        console.log('Nouveau post inséré avec ID:', newId); 
      },
      (_, error) => { console.log('Erreur INSERT post:', error); return false; }
    );
  });
};