import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { CheckSection } from '../types/checklist';

type UiState = {
    /** Whether the tooltip is open. */
    isTooltipOpen: boolean;
    /** The text of the tooltip. */
    tooltipText: string;

    /** The sections that are hidden. */
    hiddenSections: CheckSection[];

    /** Whether the checks should be validated. */
    shouldValidateChecks: boolean;

    /** Whether the checklist has errors. */
    checklistHasErrors: boolean;

    useOfficialTMGrubNames: boolean;
};

type UiActions = {
    /** Sets the tooltip text. */
    setTooltipText: (text: string) => void;
    /** Closes the tooltip. */
    closeTooltip: () => void;
    /** Opens the tooltip. */
    openTooltip: () => void;

    /** Toggles the visibility of a section. */
    toggleSection: (section: CheckSection) => void;

    /** Toggles whether the checks should be validated. */
    toggleShouldValidateChecks: () => void;

    /** Sets the checklist has errors. */
    setChecklistHasErrors: (hasErrors: boolean) => void;

    /** Toggles whether to use official Grub names. */
    toggleUseOfficialTMGrubNames: () => void;
};

const INITIAL: UiState = {
    isTooltipOpen: false,
    tooltipText:
        '[Bro](Pure Vessel) was tarnished by an idea instilled 😭😭😭😭💀',
    hiddenSections: [],
    shouldValidateChecks: true,
    checklistHasErrors: false,
    useOfficialTMGrubNames: false,
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

            setChecklistHasErrors: (hasErrors: boolean) =>
                set(state => {
                    state.checklistHasErrors = hasErrors;
                }),

            toggleUseOfficialTMGrubNames: () =>
                set(state => {
                    state.useOfficialTMGrubNames =
                        !state.useOfficialTMGrubNames;
                }),
        })),
        {
            name: 'ui-storage',
            partialize: (state: UiState) => ({
                hiddenSections: state.hiddenSections,
                shouldValidateChecks: state.shouldValidateChecks,
                checklistHasErrors: state.checklistHasErrors,
                useOfficialTMGrubNames: state.useOfficialTMGrubNames,
            }),
        }
    )
);

export default useUiStore;
