import db from '../dataBase';

export const DeleteProject = (id_delete: number, callback?: () => void) => {
  db.transaction((tx: any) => {
    tx.executeSql("PRAGMA foreign_keys = ON;");
    
    // 1) Supprimer d'abord les posts liés aux catégories de ce projet
    tx.executeSql(
      "DELETE FROM posts WHERE parentId IN (SELECT id FROM category WHERE parentId = ?);",
      [id_delete],
      () => { console.log("Posts liés au projet supprimés avec succès"); },
      (_: any, error: any) => { console.log("Erreur suppression des posts liés: ", error); return false; }
    );

    // 2) Supprimer ensuite les catégories du projet
    tx.executeSql(
      "DELETE FROM category WHERE parentId = ?;",
      [id_delete],
      () => { console.log("Catégories liées au projet supprimées avec succès"); },
      (_: any, error: any) => { console.log("Erreur suppression des catégories liées: ", error); return false; }
    );

    // 3) Enfin, supprimer le projet lui-même
    tx.executeSql(
      "DELETE FROM projects WHERE id = ?;",
      [id_delete],
      () => {
        console.log("Project supprimé avec succès");
        if (callback) callback();
      },
      (_: any, error: any) => { console.log("Erreur suppression du projet: ", error); return false; }
    );
  });
}