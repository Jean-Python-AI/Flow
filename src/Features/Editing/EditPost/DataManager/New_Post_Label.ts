import db from '../../../../DataBase/dataBase';

export const LinkPostLabel = (PostId:number, LabelId:number, callback:()=>void) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO post_labels (postId, labelId) VALUES (?, ?);',
            [PostId, LabelId],
            () => { if (callback) callback(); },
            (_, error) => { console.log('Erreur INSERT:', error); return false; }
        );
    });
};