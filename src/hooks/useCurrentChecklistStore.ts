import useChecklistStore from '../stores/checklistStore';
import useUiStore from '../stores/uiStore';

export const useCurrentChecklistStore = () => {
    const currentTab = useUiStore(state => state.currentTab);
    return useChecklistStore(currentTab);
};
