import db from '../../../../DataBase/dataBase';

export const NewProject = (name: string, callback?: () => void) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO projects (name) VALUES (?);`,
      [name],
      () => { if (callback) callback(); },
      (_, error) => { console.log('Erreur INSERT:', error); return false; }
    );
  });
};