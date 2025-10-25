import db from '../dataBase';

export const UnlinkPostLabel = (PostId: number, LabelId: number, callback?: () => void) => {
    db.transaction(tx => {
        tx.executeSql("PRAGMA foreign_keys = ON;");
        
        tx.executeSql(
            "DELETE FROM post_labels WHERE postId = ? AND labelId = ?;",
            [PostId, LabelId],
            (_,) => {
                console.log("Lien post-label supprimé avec succès");
                if (callback) callback();
            },
            (_, error) => {
                console.log("Erreur suppression lien post-label:", error);
                return false;
            }
        );
    });
};

