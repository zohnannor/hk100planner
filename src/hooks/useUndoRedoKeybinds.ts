import { useEffect } from 'react';

import useCurrentChecklistStore from './useCurrentChecklistStore';

const useUndoRedoKeybinds = () => {
    const { undo, redo } = useCurrentChecklistStore().temporal.getState();

    useEffect(() => {
        const handleUndoRedo = (e: KeyboardEvent): void => {
            if (!e.ctrlKey) {
                return;
            }

            switch (e.key) {
                case 'z': {
                    undo();
                    break;
                }
                case 'Z':
                case 'y': {
                    redo();
                    break;
                }
            }
        };
        window.addEventListener('keydown', handleUndoRedo);
        return () => window.removeEventListener('keydown', handleUndoRedo);
    });
};

export default useUndoRedoKeybinds;
