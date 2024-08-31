import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { SECTION_TITLES } from '../constants';
import { CheckSection } from '../types/checklist';

type UiState = {
    /** Whether the tooltip is open. */
    isTooltipOpen: boolean;
    /** The text of the tooltip. */
    tooltipText: string;

    /** The sections that are collapsed. */
    collapsedSections: CheckSection[];

    /** Whether the checks should be validated. */
    checksValidation: boolean;

    /** Whether the checklist has errors. */
    checklistHasErrors: boolean;

    /** Whether to use official:tm: grub names. */
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
    toggleSection: (section?: CheckSection) => void;

    /** Toggles whether the checks should be validated. */
    toggleChecksValidation: () => void;

    /** Sets the checklist has errors. */
    setChecklistHasErrors: (hasErrors: boolean) => void;

    /** Toggles whether to use official:tm: grub names. */
    toggleUseOfficialTMGrubNames: () => void;
};

const INITIAL: UiState = {
    isTooltipOpen: false,
    tooltipText:
        '[Bro](Pure Vessel) was tarnished by an idea instilled 😭😭😭😭💀',
    collapsedSections: [],
    checksValidation: true,
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

            toggleSection: (section?: CheckSection) =>
                set(state => {
                    if (section) {
                        const index = state.collapsedSections.indexOf(section);
                        if (index === -1) {
                            state.collapsedSections.push(section);
                        } else {
                            state.collapsedSections.splice(index, 1);
                        }
                    } else {
                        if (state.collapsedSections.length > 0) {
                            state.collapsedSections = [];
                        } else {
                            state.collapsedSections.push(
                                ...(Object.keys(
                                    SECTION_TITLES
                                ) as CheckSection[])
                            );
                        }
                    }
                }),

            toggleChecksValidation: () =>
                set(state => {
                    state.checksValidation = !state.checksValidation;
                }),

            setChecklistHasErrors: (hasErrors: boolean) =>
                set({ checklistHasErrors: hasErrors }),

            toggleUseOfficialTMGrubNames: () =>
                set(state => {
                    state.useOfficialTMGrubNames =
                        !state.useOfficialTMGrubNames;
                }),
        })),
        {
            name: 'ui-storage',
            partialize: (state: UiState) => ({
                collapsedSections: state.collapsedSections,
                checksValidation: state.checksValidation,
                checklistHasErrors: state.checklistHasErrors,
                useOfficialTMGrubNames: state.useOfficialTMGrubNames,
            }),
        }
    )
);

export default useUiStore;
