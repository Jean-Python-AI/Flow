import db from '../dataBase';

export const LinkPostLabel = (PostId:number, LabelId:number, callback:()=>void) => {
    db.transaction(tx => {
        tx.executeSql(
            "INSERT INTO post_labels (postId, labelId) VALUES (?, ?);",
            [PostId, LabelId],
            (_,) => callback(),
            (_, error) => {
                console.log("Erreur INSERT simple:", error);
                return false;
            }
        );
    });
};