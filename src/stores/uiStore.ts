import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { CheckSection } from '../types/checklist';

type UiState = {
    isTooltipOpen: boolean;
    tooltipText: string;
    hiddenSections: CheckSection[];
    shouldValidateChecks: boolean;
};

type UiActions = {
    setTooltipText: (text: string) => void;
    closeTooltip: () => void;
    openTooltip: () => void;
    toggleSection: (section: CheckSection) => void;
};

const INITIAL: UiState = {
    isTooltipOpen: false,
    tooltipText:
        '[Bro](Pure Vessel) was tarnished by an idea instilled 😭😭😭😭💀',
    hiddenSections: [],
    shouldValidateChecks: true,
};

const useUiStore = create<UiState & UiActions>()(
    persist(
        immer(set => ({
            ...INITIAL,

            setTooltipText: (text: string) =>
                set({
                    tooltipText:
                        Math.random() < 1 / 10000 ? INITIAL.tooltipText : text,
                }),

            closeTooltip: () => set({ isTooltipOpen: false }),

            openTooltip: () => set({ isTooltipOpen: true }),

            toggleSection: (section: CheckSection) =>
                set(state => {
                    const index = state.hiddenSections.indexOf(section);
                    if (index === -1) {
                        state.hiddenSections.push(section);
                    } else {
                        state.hiddenSections.splice(index, 1);
                    }
                }),

            toggleShouldValidateChecks: () =>
                set(state => {
                    state.shouldValidateChecks = !state.shouldValidateChecks;
                }),
        })),
        {
            name: 'ui-storage',
            partialize: (state: UiState) => ({
                hiddenSections: state.hiddenSections,
                shouldValidateChecks: state.shouldValidateChecks,
            }),
        }
    )
);

export default useUiStore;
