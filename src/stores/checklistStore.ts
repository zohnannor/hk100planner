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
    CheckNames,
    CheckRewards,
    Checks,
    ChecksSection,
    GameKey,
    HollowKnightChecklistState,
    RequirementCheckErrors,
    SaveFile,
    SaveFileData,
    SectionNames,
} from '../types/checklist';
import partialDeepEqual, { Comparable } from '../util/partialDeepEqual';
import { typedEntries, typedKeys, typedValues } from '../util/typedObject';
import INITIAL_HOLLOW_KNIGHT_CHECKLIST_STATE from './INITIAL_HOLLOW_KNIGHT_CHECKLIST_STATE';
import INITIAL_SILKSONG_CHECKLIST_STATE from './INITIAL_SILKSONG_CHECKLIST_STATE';
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
    typedEntries(updates).forEach(([key, value]) => {
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
            updateState(state[key] as AnyObject, value, operation);
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

    for (const key of typedKeys(reqs)) {
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
): RequirementCheckErrors => {
    const game = state.game as Game;
    const errors: RequirementCheckErrors = {};

    typedEntries(state.checks as Checks<Game>).forEach(
        ([sectionName, section]) => {
            typedEntries(section).forEach(([checkName, check]) => {
                const error = check.checked && validateCheck(state, check);

                if (error) {
                    if (!errors[game]) {
                        errors[game] = {};
                    }
                    if (!errors[game][sectionName]) {
                        errors[game][sectionName] = {};
                    }
                    errors[game][sectionName][
                        checkName as CheckNames<Game, SectionNames<Game>>
                    ] = error;
                }
            });
        }
    );

    return errors;
};

const applyReward = <Game extends GameKey>(
    state: State<Game>,
    reward: CheckRewards<Game>,
    willCheck: boolean
) => {
    if (willCheck) {
        updateState(state, reward, 'add');
    } else {
        updateState(state, reward, 'sub');
    }
};

const grubRewards = (state: State<'hollow-knight'>, willCheck: boolean) => {
    const grubs = state.grubs;

    const grubReward = willCheck
        ? GRUB_REWARDS[grubs - 1]
        : GRUB_REWARDS[grubs];

    applyReward(state, { geo: grubReward }, willCheck);
};

const maskShardRewards = (
    state: State<'hollow-knight'>,
    willCheck: boolean
) => {
    const maskShards = state.maskShards;

    const percent = willCheck
        ? [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1][maskShards - 1]
        : [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1][maskShards];

    applyReward(state, { percent }, willCheck);
};

const vesselFragmentRewards = (
    state: State<'hollow-knight'>,
    willCheck: boolean
) => {
    const vesselFragments = state.vesselFragments;

    const percent = willCheck
        ? [0, 0, 1, 0, 0, 1, 0, 0, 1][vesselFragments - 1]
        : [0, 0, 1, 0, 0, 1, 0, 0, 1][vesselFragments];

    applyReward(state, { percent }, willCheck);
};

const handleCheck = <Game extends GameKey>(
    state: State<Game>,
    sectionName: SectionNames<Game>,
    check: Check<Game>,
    willCheck: boolean
) => {
    if ((check.checked ?? false) === willCheck) {
        return;
    }
    applyReward(state, check.reward, willCheck);
    check.checked = willCheck;

    if (state.game === 'hollow-knight') {
        const hkState = state as State<'hollow-knight'>;
        if (sectionName === 'grubs') {
            grubRewards(hkState, willCheck);
        }
        if (sectionName === 'maskShards') {
            maskShardRewards(hkState, willCheck);
        }
        if (sectionName === 'vesselFragments') {
            vesselFragmentRewards(hkState, willCheck);
        }
    }
};

/** The type of the store's state. */
type State<Game extends GameKey> = ChecklistState<Game> & Action<Game>;

/** Factory function to create a store for a specific game. */
const createChecklistStore = <Game extends GameKey>(
    initialState: ChecklistState<Game>
) => {
    type Section = SectionNames<Game>;
    type CheckName<S extends Section> = CheckNames<Game, S>;

    return create<State<Game>>()(
        persist(
            temporal(
                immer(set => ({
                    ...initialState,

                    setFromSaveFile: (savefile: SaveFile) => {
                        const tab = typedKeys(savefile)[0] as Game;
                        const save = savefile[tab] as SaveFileData<Game>;

                        set(state => {
                            typedEntries(save).forEach(
                                ([sectionName, section]) => {
                                    Array.from(section.entries()).forEach(
                                        ([checkName, checked]) => {
                                            const section = (
                                                state.checks as Checks<Game>
                                            )[sectionName];
                                            const check = section[checkName];

                                            handleCheck(
                                                state as State<Game>,
                                                sectionName,
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

                    reset: (sectionName?: Section) => {
                        if (sectionName) {
                            set(state => {
                                const section = (state.checks as Checks<Game>)[
                                    sectionName
                                ] as ChecksSection<Game, Section>;
                                typedValues(section).forEach(check =>
                                    handleCheck(
                                        state as State<Game>,
                                        sectionName,
                                        check,
                                        false
                                    )
                                );
                            });
                        } else {
                            // This doesn't need to give (or rather, take) rewards,
                            // because the state mutation doesn't depend on the
                            // checks being checked (we just set state to the
                            // initial, all-zero state).
                            set(initialState as State<Game>);
                        }
                    },

                    checkAll: (sectionName?: Section) => {
                        if (sectionName) {
                            set(state => {
                                const section = (state.checks as Checks<Game>)[
                                    sectionName
                                ] as ChecksSection<Game, Section>;
                                typedValues(section).forEach(check =>
                                    handleCheck(
                                        state as State<Game>,
                                        sectionName,
                                        check,
                                        true
                                    )
                                );
                            });
                        } else {
                            set(state => {
                                typedEntries(
                                    state.checks as Checks<Game>
                                ).forEach(([sectionName, section]) => {
                                    typedValues(section).forEach(check =>
                                        handleCheck(
                                            state as State<Game>,
                                            sectionName,
                                            check,
                                            true
                                        )
                                    );
                                });
                            });
                        }
                    },

                    toggle: <S extends Section>(
                        section: S,
                        name: CheckName<S>
                    ) => {
                        set(state => {
                            // Update state after a check/uncheck
                            const check = (state.checks as Checks<Game>)[
                                section
                            ][name];

                            const willCheck = !check.checked;
                            handleCheck(
                                state as State<Game>,
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
                    deepMerge(current, persisted as State<Game>),
            }
        )
    );
};

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
