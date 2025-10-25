import db from '../dataBase';

export const DeleteWorkSpace = (id_delete: number, callback?: () => void) => {
  db.transaction((tx: any) => {
    tx.executeSql("PRAGMA foreign_keys = ON;");
    
    // Supprimer le projet
    tx.executeSql(
      "DELETE FROM workspace WHERE id = ?;",
      [id_delete],
      () => {
        console.log("WorkSpace supprimé avec succès");
        if (callback) callback();
      },
      (_: any, error: any) => { console.log("Erreur suppression du WorkSpace: ", error); return false; }
    );
  });
}