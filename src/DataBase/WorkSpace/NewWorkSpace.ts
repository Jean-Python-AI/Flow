import db from '../dataBase';

export const NewWorkSpace = (name: string, callback?: () => void) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO workspace (name) VALUES (?);`,
      [name],
      () => { if (callback) callback();},
      (_, error) => { console.log('Erreur INSERT:', error); return false; }
    );
  });
};