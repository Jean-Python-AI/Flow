import {useState} from 'react';

// Labels Variables
export function useLabels() {
    const [labelActivate, setLabelActivate] = useState<number[]>([]);

    const setLabels = (labelId: number) => {
        if (labelId === -1) {
            setLabelActivate(prev =>
                prev.includes(-1)
                    ? prev.filter(id => id !== -1) // si déjà activé, on retire
                    : [...prev.filter(id => id !== 0), -1] // sinon on ajoute
            );
            return;
        } else if (labelId === 0) {
            setLabelActivate(prev =>
                prev.includes(0)
                    ? prev.filter(id => id !== 0) // si déjà activé, on retire
                    : [...prev.filter(id => id !== -1), 0] // sinon on ajoute
            );
            return;
        } else {
            setLabelActivate(prev =>
                prev.includes(labelId)
                    ? prev.filter(id => id !== labelId) // si déjà activé, on retire
                    : [...prev, labelId] // sinon on ajoute
            );
            return;
        }
    };

    return { labelActivate, setLabelActivate, setLabels };
};