import db from '../dataBase';
import { Alert } from 'react-native';

export const NewLabel = (name:string, color:string, callback?: () => void) => {

  // Alert if name is empty
  if (!name) {
    Alert.alert('Nom requis et color requi', 'Entrez un nom ou une couleur');
    return;
  };

  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO labels (name, color) VALUES (?, ?);`,
      [name, color],
      () => { if (callback) callback(); },
      (_, error) => { console.log('Erreur INSERT:', error); return false; }
    );
  });
};