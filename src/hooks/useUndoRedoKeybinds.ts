import { useEffect } from 'react';

import useChecklistStore from '../stores/checklistStore';
import useUiStore from '../stores/uiStore';

const useUndoRedoKeybinds = () => {
    const currentTab = useUiStore.getState().currentTab;
    const { undo, redo } = useChecklistStore[currentTab].temporal.getState();

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
