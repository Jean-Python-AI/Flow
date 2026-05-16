import { Label } from '../types/Label';
import { Alert } from 'react-native';
import {db} from './db';


// ==================== LIRE ====================

/** Récupère tous les labels */
export const getAllLabels = (): Promise<Label[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM labels ORDER BY name ASC;`,
        [],
        (_, { rows }) => {
          const labels: Label[] = [];
          for (let i = 0; i < rows.length; i++) {
            labels.push(rows.item(i));
          }
          resolve(labels); // Résout la Promise avec les labels
        },
        (_, error) => {
          console.error('Erreur getAllLabels:', error);
          reject(error); // Rejette la Promise en cas d'erreur
          return true; // Retourne true pour indiquer que l'erreur est gérée (convention SQLite)
        }
      );
    });
  });
};

/** Récupère les labels par une liste d'IDs */
export const getLabelsByIds = (labelIds: number[]): Promise<Label[]> => {
  if (!labelIds || labelIds.length === 0) {
    return Promise.resolve([]);
  }
  return new Promise((resolve, reject) => {
    const placeholders = labelIds.map(() => '?').join(',');
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM labels WHERE id IN (${placeholders});`,
        labelIds,
        (_, { rows }) => {
          const labels: Label[] = [];
          for (let i = 0; i < rows.length; i++) {
            labels.push(rows.item(i));
          }
          resolve(labels);
        },
        (_, error) => {
          console.error('Erreur getLabelsByIds:', error);
          reject(error);
          return true; // Retourne true pour indiquer que l'erreur est gérée
        }
      );
    });
  });
};

/** Récupère les labels associés à un post */
export const getLabelsByPostId = (postId: number): Promise<Label[]> => {
  return new Promise((resolve) => {
    db.transaction(
      (tx) => {
        // D'abord, récupérer les IDs des labels liés au post
        tx.executeSql(
          `SELECT labelId FROM post_labels WHERE postId = ?;`,
          [postId],
          (_, { rows }) => {
            if (rows.length === 0) {
              resolve([]);
              return;
            }
            // Récupérer les IDs
            const labelIds: number[] = [];
            for (let i = 0; i < rows.length; i++) {
              labelIds.push(rows.item(i).labelId);
            }
            // Ensuite, récupérer les informations complètes des labels
            const placeholders = labelIds.map(() => '?').join(',');
            tx.executeSql(
              `SELECT * FROM labels WHERE id IN (${placeholders});`,
              labelIds,
              (_, { rows: labelRows }) => {
                const labels: Label[] = [];
                for (let i = 0; i < labelRows.length; i++) {
                  labels.push(labelRows.item(i));
                }
                resolve(labels);
              },
              () => {
                resolve([]);
                return true; // Continuer la transaction malgré l'erreur
              }
            );
          },
          () => {
            resolve([]);
            return true; // Continuer la transaction malgré l'erreur
          }
        );
      },
      () => {
        resolve([]); // Erreur de transaction
      }
    );
  });
};


// ==================== AJOUTER ====================

/** Ajoute un nouveau label */
export const insertLabel = (name: string, color: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!name) {
            Alert.alert('Name required', 'Please provide a name for the label.');
            return;
        }

        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO labels (name, color) VALUES (?, ?);`,
                [name, color],
                () => resolve(),
                (_, error) => reject(error)
            );
        });
    });
};

/** Créer un nouveau liens entre poste et label */
export const addLinkPostLabel = (
  postId: number,
  labelId: number
): Promise<void> => {

    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
        tx.executeSql(
            `INSERT INTO post_labels (postId, labelId)
            VALUES (?, ?);`,
            [postId, labelId],
            () => resolve(),
            (_, error) => reject(error)
        );
        });
    });
};


// ==================== MODIFIER ====================

/** Met à jour un post existant */
export const updateLabel = (
  id: number,
  name: string,
  color?: string
): Promise<void> => {

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
        if (color !== undefined) {
            tx.executeSql(
                `UPDATE labels
                SET name = ?, color = ?
                WHERE id = ?;`,
                [name, color, id],
                () => resolve(),
                (_, error) => reject(error)
            );
        } else {
            tx.executeSql(
                `UPDATE labels
                SET name = ?
                WHERE id = ?;`,
                [name, id],
                () => resolve(),
                (_, error) => reject(error)
            );
        }
    });
  });
};


// ==================== SUPPRIMER ====================

/** Supprime un liens entre poste et label */
export const deleteLinkPostLabel = (
  postId: number,
  labelId: number
): Promise<void> => {

    return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM post_labels
         WHERE postId = ? AND labelId = ?;`,
        [postId, labelId],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

/** Supprime un label par ID */
export const deleteLabel = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM post_labels WHERE labelId = ?;`,
        [id],
        () => {
          // Après avoir supprimé les liens, supprimer le label lui-même
          tx.executeSql(
            `DELETE FROM labels WHERE id = ?;`,
            [id],
            () => resolve(),
            (_, error) => reject(error)
          );
        },
        (_, error) => reject(error)
      );
    });
  });
};

/** Supprime tous les labels (utile pour debug ou reset) */
export const deleteAllLabel= (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM labels;`,
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};