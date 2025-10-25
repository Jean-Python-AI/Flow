import db from '../dataBase';


export const DeleteCategory = (id_delete: number, callback?: () => void) => {
  db.transaction((tx: any) => {
    // Activer les clés étrangères pour cette transaction
    tx.executeSql("PRAGMA foreign_keys = ON;");
    
    tx.executeSql(
        "DELETE FROM category WHERE id = ?;",
        [id_delete],
        () => { console.log("Élément supprimé avec succès"); if (callback) callback(); },
        (_: any, error: any) => { console.log("Erreur suppression: ", error); return false; }
    );
  });
}