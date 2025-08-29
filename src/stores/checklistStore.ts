import { merge as deepMerge } from 'object-deep-merge';
import { PartialDeep } from 'type-fest';
import { temporal } from 'zundo';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { GRUB_REWARDS } from '../constants';
import {
    Action,
    AnyObject,
    Check,
    ChecklistState,
    CheckRewards,
    Checks,
    ChecksKeys,
    ChecksSection,
    GameKey,
    HollowKnightChecklistState,
    RequirementCheckErrors,
    SaveFile,
    SaveFileData,
    SectionNames,
} from '../types/checklist';
import partialDeepEqual, { Comparable } from '../util/partialDeepEqual';
import { INITIAL_HOLLOW_KNIGHT_CHECKLIST_STATE } from './INITIAL_HOLLOW_KNIGHT_CHECKLIST_STATE';
import { INITIAL_SILKSONG_CHECKLIST_STATE } from './INITIAL_SILKSONG_CHECKLIST_STATE';
import useUiStore from './uiStore';

/**
 * Recursively updates the state object based on the provided updates and operation.
 *
 * This function allows for updating numeric and boolean values within a state object.
 * It can either add or subtract values from the state based on the specified operation.
 * For nested objects, it recursively updates the state.
 *
 * @param {AnyObject} state - The state object to be updated. This object is
 * modified in place.
 * @param {PartialDeep<AnyObject>} updates - An object containing the updates to
 * apply to the state.
 * @param {'add' | 'sub'} operation - The operation to perform on the numeric
 * and boolean values. Use 'add' to increment values and 'sub' to decrement
 * them.
 *
 * @example
 * const state = { count: 10, active: false, nested: { value: 5 } };
 * const updates = { active: true, nested: { value: 3 } };
 *
 * updateState(state, updates, 'add');
 * console.log(state); // { count: 10, active: true, nested: { value: 8 } }
 *
 * updateState(state, updates, 'sub');
 * console.log(state); // { count: 10, active: false, nested: { value: 5 } }
 */
const updateState = (
    state: AnyObject,
    updates: PartialDeep<AnyObject>,
    operation: 'add' | 'sub'
) => {
    Object.entries(updates).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            const stateValue = state[key] as typeof value;
            if (operation === 'add') {
                stateValue.push(...value);
            } else if (operation === 'sub') {
                const [n] = value;
                const index = stateValue.indexOf(n);
                if (index !== -1) {
                    stateValue.splice(index, 1);
                }
            }
        } else if (typeof value === 'number') {
            if (operation === 'add') {
                (state[key] as typeof value) += value;
            } else {
                (state[key] as typeof value) -= value;
            }
        } else if (typeof value === 'boolean') {
            if (operation === 'add') {
                state[key] ||= value;
            } else {
                state[key] = (state[key] ? 1 : 0) - (value ? 1 : 0) === 1;
            }
        } else if (typeof value === 'object' && value !== null) {
            const stateValue = state[key] as typeof value as AnyObject;
            updateState(stateValue, value, operation);
        }
    });
};

const comparator = (
    left: Comparable[string],
    right: Comparable[string]
): boolean => {
    if (typeof left === 'boolean') {
        return left === right;
    } else if (typeof left === 'number' && typeof right === 'number') {
        return left >= right;
    }
    throw new Error(`Unsupported type ${typeof left}`);
};

const validateCheck = <Game extends GameKey>(
    state: ChecklistState<Game>,
    check: Check<Game>
): PartialDeep<ChecklistState<Game>> | undefined => {
    const requires = check.requires;

    if (requires && !partialDeepEqual(state, requires, comparator)) {
        return requires;
    }

    if (state.game !== 'hollow-knight') {
        return undefined;
    }

    const hkState = state as HollowKnightChecklistState;
    const hkRequires =
        check.requires as PartialDeep<HollowKnightChecklistState>;
    const reqs: Record<
        'paleOre' | 'geo' | 'simpleKeys',
        [number, number, number]
    > = {
        paleOre: [
            hkState.paleOre,
            hkState.paleOreReq,
            check.checked ? 0 : hkRequires?.paleOre ?? 0,
        ],
        geo: [
            hkState.geo,
            hkState.geoReq,
            check.checked ? 0 : hkRequires?.geo ?? 0,
        ],
        simpleKeys: [
            hkState.simpleKeys,
            hkState.simpleKeysReq,
            check.checked ? 0 : hkRequires?.simpleKeys ?? 0,
        ],
    };

    for (const key of Object.keys(reqs)) {
        const typedKey = key as keyof typeof reqs;
        if (hkRequires?.[typedKey]) {
            const [collected, requirements, checkReq] = reqs[typedKey];
            if (collected - requirements < checkReq) {
                return requires;
            }
        }
    }

    return undefined;
};

/**
 * Validates the checks in the given checklist state.
 *
 * This function iterates through the state of a checklist, checking each
 * requirement against its corresponding conditions. If a requirement is not
 * met, it records an error for that check.
 *
 * @param state - The current state of the checklist, containing various
 * sections and checks.
 * @returns An object containing errors for any checks that failed validation.
 */
const validateChecks = <Game extends GameKey>(
    state: ChecklistState<Game>
): RequirementCheckErrors<Game> => {
    const errors: RequirementCheckErrors<Game> = {};

    Object.entries(state.checks).forEach(([sectionName, section]) => {
        const typedSectionName = sectionName as SectionNames<Game>;
        Object.entries<Check<Game>>(section).forEach(([checkName, check]) => {
            const error = check.checked && validateCheck(state, check);

            if (error) {
                if (!errors[typedSectionName]) {
                    errors[typedSectionName] = {};
                }
                errors[typedSectionName][
                    checkName as keyof ChecksSection<Game, SectionNames<Game>>
                ] = error;
            }
        });
    });

    return errors;
};

const applyReward = <Game extends GameKey>(
    state: ChecklistState<Game>,
    reward: CheckRewards<Game>,
    willCheck: boolean
) => {
    if (willCheck) {
        updateState(state, reward, 'add');
    } else {
        updateState(state, reward, 'sub');
    }
};

const grubRewards = (
    state: ChecklistState<'hollow-knight'>,
    willCheck: boolean
) => {
    const grubs = state.grubs;

    const grubReward = willCheck
        ? GRUB_REWARDS[grubs - 1]
        : GRUB_REWARDS[grubs];

    applyReward<'hollow-knight'>(state, { geo: grubReward }, willCheck);
};

const maskShardRewards = (
    state: ChecklistState<'hollow-knight'>,
    willCheck: boolean
) => {
    const maskShards = state.maskShards;

    const percent = willCheck
        ? [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1][maskShards - 1]
        : [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1][maskShards];

    applyReward(state, { percent }, willCheck);
};

const vesselFragmentRewards = (
    state: ChecklistState<'hollow-knight'>,
    willCheck: boolean
) => {
    const vesselFragments = state.vesselFragments;

    const percent = willCheck
        ? [0, 0, 1, 0, 0, 1, 0, 0, 1][vesselFragments - 1]
        : [0, 0, 1, 0, 0, 1, 0, 0, 1][vesselFragments];

    applyReward(state, { percent }, willCheck);
};

const handleCheck = <Game extends GameKey>(
    state: ChecklistState<Game>,
    sectionName: SectionNames<Game>,
    check: Check<Game>,
    willCheck: boolean
) => {
    if ((check.checked ?? false) === willCheck) {
        return;
    }
    applyReward(state, check.reward, willCheck);
    check.checked = willCheck;

    if (state.game == 'hollow-knight' && sectionName === 'grubs') {
        grubRewards(state, willCheck);
    }
    if (state.game == 'hollow-knight' && sectionName === 'maskShards') {
        maskShardRewards(state, willCheck);
    }
    if (state.game == 'hollow-knight' && sectionName === 'vesselFragments') {
        vesselFragmentRewards(state, willCheck);
    }
};

/** Factory function to create a store for a specific game. */
const createChecklistStore = <Game extends GameKey>(
    initialState: ChecklistState<Game>
) =>
    create<ChecklistState<Game> & Action<Game>>()(
        persist(
            temporal(
                immer(set => ({
                    ...initialState,

                    setFromSaveFile: (savefile: SaveFile) => {
                        console.log({ savefile });
                        const [save, tab]: [SaveFileData, GameKey] =
                            'hollow-knight' in savefile
                                ? [savefile['hollow-knight'], 'hollow-knight']
                                : [savefile['silksong'], 'silksong'];

                        set(state => {
                            Object.entries(save).forEach(
                                ([sectionName, section]) => {
                                    const typedSectionName =
                                        sectionName as SectionNames<Game>;
                                    console.log({ typedSectionName, section });

                                    Array.from(section.entries()).forEach(
                                        ([checkName, checked]) => {
                                            const section = (
                                                state.checks as Checks<Game>
                                            )[
                                                typedSectionName
                                            ] as ChecksSection<
                                                Game,
                                                SectionNames<Game>
                                            >;
                                            const check = section[
                                                checkName as keyof typeof section
                                            ] as Check<Game>;

                                            handleCheck<Game>(
                                                state as ChecklistState<Game>,
                                                typedSectionName,
                                                check,
                                                checked
                                            );
                                        }
                                    );
                                }
                            );
                        });

                        useUiStore.getState().setCurrentTab(tab);
                    },

                    reset: (sectionName?: SectionNames<Game>) => {
                        if (sectionName) {
                            set(state => {
                                const section = (state.checks as Checks<Game>)[
                                    sectionName
                                ] as ChecksSection<Game, SectionNames<Game>>;
                                Object.values(section).forEach(check =>
                                    handleCheck<Game>(
                                        state as ChecklistState<Game>,
                                        sectionName,
                                        check as Check<Game>,
                                        false
                                    )
                                );
                            });
                        } else {
                            // This doesn't need to give (or rather, take) rewards,
                            // because the state mutation doesn't depend on the
                            // checks being checked (we just set state to the
                            // initial, all-zero state).
                            set(
                                initialState as ChecklistState<Game> &
                                    Action<Game>
                            );
                        }
                    },

                    checkAll: (sectionName?: SectionNames<Game>) => {
                        if (sectionName) {
                            set(state => {
                                const section = (state.checks as Checks<Game>)[
                                    sectionName
                                ] as ChecksSection<Game, SectionNames<Game>>;
                                Object.values(section).forEach(check =>
                                    handleCheck<Game>(
                                        state as ChecklistState<Game>,
                                        sectionName,
                                        check as Check<Game>,
                                        true
                                    )
                                );
                            });
                        } else {
                            set(state => {
                                Object.entries(state.checks).forEach(
                                    ([sectionName, section]) => {
                                        Object.values(
                                            section as ChecksSection<
                                                Game,
                                                SectionNames<Game>
                                            >
                                        ).forEach(check =>
                                            handleCheck<Game>(
                                                state as ChecklistState<Game>,
                                                sectionName as SectionNames<Game>,
                                                check as Check<Game>,
                                                true
                                            )
                                        );
                                    }
                                );
                            });
                        }
                    },

                    toggle: <S extends SectionNames<Game>>(
                        section: S,
                        name: ChecksKeys<Game>[S] & string
                    ) => {
                        set(state => {
                            // Update state after a check/uncheck
                            const check = (
                                (state.checks as Checks<Game>)[
                                    section
                                ] as ChecksSection<Game, S>
                            )[name] as Check<Game>;

                            const willCheck = !check.checked;
                            handleCheck<Game>(
                                state as ChecklistState<Game>,
                                section,
                                check,
                                willCheck
                            );
                        });
                    },

                    validateCheck,

                    validateChecks,
                }))
            ),
            {
                name: `checklist-storage-${initialState.game}`,
                merge: (persisted, current) =>
                    deepMerge(
                        current,
                        persisted as ChecklistState<Game> & Action<Game>
                    ),
            }
        )
    );

type ChecklistStore<Game extends GameKey> = ReturnType<
    typeof createChecklistStore<Game>
>;

const STATES = {
    'hollow-knight': createChecklistStore<'hollow-knight'>(
        INITIAL_HOLLOW_KNIGHT_CHECKLIST_STATE
    ),
    silksong: createChecklistStore<'silksong'>(
        INITIAL_SILKSONG_CHECKLIST_STATE
    ),
};

const useChecklistStore = <Game extends GameKey>(game: Game) =>
    STATES[game] as unknown as ChecklistStore<Game>;

export default useChecklistStore;
