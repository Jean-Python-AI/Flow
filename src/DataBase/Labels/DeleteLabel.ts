import db from '../dataBase';

export const DeleteLabel = (labelId:number, callback: (success: boolean) => void) => {
    db.transaction(tx => {
        tx.executeSql(
            "DELETE FROM labels WHERE id = ?;",
            [labelId],
            (_, results) => {
                console.log("Label deleted with id:", labelId);
                callback(true);
            },
            (_, error) => {
                console.log("Error deleting label:", error);
                callback(false);
                return false;
            }
        );
    });
};