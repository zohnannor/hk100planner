import useChecklistStore from '../stores/checklistStore';
import useUiStore from '../stores/uiStore';

const useCurrentChecklistStore = () => {
    const currentTab = useUiStore(state => state.currentTab);
    return useChecklistStore(currentTab);
};

export default useCurrentChecklistStore;
