import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { HOLLOW_KNIGHT_SECTION_TITLES } from '../constants';
import { ChecksSection, GameKey, SectionNames } from '../types/checklist';
import useChecklistStore from './checklistStore';

{
    downloads: [];
    notifications: [];
}

type UiState = {
    /** Whether the tooltip is open. */
    isTooltipOpen: boolean;
    /** The text of the tooltip. */
    tooltipText: string;

    /** The sections that are collapsed. */
    collapsedSections: {
        'hollow-knight': SectionNames<'hollow-knight'>[];
        silksong: SectionNames<'silksong'>[];
    };
    currentTab: GameKey;

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
    toggleSection: <Game extends GameKey>(section?: SectionNames<Game>) => void;

    /** Hides all completed sections. */
    hideCompletedSections: () => void;

    /** Sets the current tab. */
    setCurrentTab: (tab: GameKey) => void;

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
    collapsedSections: {
        'hollow-knight': [],
        silksong: [],
    },
    currentTab: 'hollow-knight',
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

            toggleSection: <Game extends GameKey>(
                section?: SectionNames<Game>
            ) =>
                set(state => {
                    const collapsed = state.collapsedSections[
                        state.currentTab
                    ] as SectionNames<Game>[];
                    if (section) {
                        const index = collapsed.indexOf(section);
                        if (index === -1) {
                            collapsed.push(section);
                        } else {
                            collapsed.splice(index, 1);
                        }
                    } else {
                        if (collapsed.length > 0) {
                            state.collapsedSections[state.currentTab] = [];
                        } else {
                            collapsed.push(
                                ...(Object.keys(
                                    HOLLOW_KNIGHT_SECTION_TITLES
                                ) as SectionNames<Game>[])
                            );
                        }
                    }
                }),

            hideCompletedSections: <Game extends GameKey>() =>
                set(state => {
                    const checklist = useChecklistStore(state.currentTab)();
                    Object.entries(checklist.checks).forEach(
                        ([section, checks]: [
                            string,
                            ChecksSection<GameKey, SectionNames<GameKey>>
                        ]) => {
                            const typedSection = section as SectionNames<Game>;
                            if (Object.values(checks).every(x => x.checked)) {
                                (
                                    state.collapsedSections[
                                        state.currentTab
                                    ] as SectionNames<Game>[]
                                ).push(typedSection);
                            }
                        }
                    );
                }),

            setCurrentTab: (tab: GameKey) => set({ currentTab: tab }),

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
                currentTab: state.currentTab,
            }),
        }
    )
);

export default useUiStore;
