import db from '../dataBase';

export const NewPost = (parentId: number = 0, title: string = '', text?: string, callback?: (id: number) => void) => {
  const creationDate = new Date().toISOString(); // "2025-10-19T15:21:00.000Z"
  
  db.transaction(tx => {
    // Désactiver temporairement les clés étrangères pour cette transaction
    tx.executeSql("PRAGMA foreign_keys = OFF;");

    
    tx.executeSql(
      `INSERT INTO posts (parentId, title, text, createdAt) VALUES (?, ?, ?, ?);`,
      [parentId || null, title, text || '', creationDate],
      (_, result) => { 
        const newId = result.insertId;
        if (callback) callback(newId);
        console.log('Nouveau post inséré avec ID:', newId, 'parentId:', parentId);
      },
      (_, error) => { 
        console.log('Erreur INSERT post:', JSON.stringify(error));
        console.log('Détails de l\'erreur:', {
          parentId,
          title,
          text: text || '',
          creationDate,
          
        });
        return false; 
      }
    );
  });
};