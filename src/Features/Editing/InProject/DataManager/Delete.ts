import db from '../../../../DataBase/dataBase';


export const DeleteProject = (id_delete: number, callback?: () => void) => {
  db.transaction((tx: any) => {
    tx.executeSql(
        "DELETE FROM projects WHERE id = ?;",
        [id_delete],
        () => { console.log("Élément supprimé avec succès"); if (callback) callback(); },
        (_: any, error: any) => { console.log("Erreur suppression: ", error); return false; }
    );
  });
}