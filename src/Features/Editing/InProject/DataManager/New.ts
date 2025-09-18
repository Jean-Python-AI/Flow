import db from '../../../../DataBase/dataBase';
import { Alert } from 'react-native';

export const NewCategory = (name: string, parentId: number, callback?: () => void) => {

  // Alert if name is empty
  if (!name) {
    Alert.alert('Nom requis', 'Entrez un nom de projet.');
    return;
  };

  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO category (name, parentId) VALUES (?, ?);`,
      [name, parentId],
      () => { if (callback) callback(); },
      (_, error) => { console.log('Erreur INSERT:', error); return false; }
    );
  });
};