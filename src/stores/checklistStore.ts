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
    CheckSection,
    ChecksSection,
    RequirementCheckErrors,
} from '../types/checklist';
import partialDeepEqual, { Comparable } from '../util/partialDeepEqual';
import { INITIAL_CHECKLIST_STATE } from './INITIAL_CHECKLIST_STATE';

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

const validateCheck = (
    state: ChecklistState,
    check: Check
): PartialDeep<ChecklistState> | undefined => {
    const requires = check.requires;

    if (requires && !partialDeepEqual(state, requires, comparator)) {
        return requires;
    }

    /// special case for "consumable items", we don't want to just check if the
    /// value is greater, we wanna know that we have enough of it
    const reqs: Record<
        'paleOre' | 'geo' | 'simpleKeys',
        [number, number, number]
    > = {
        paleOre: [
            state.paleOre,
            state.paleOreReq,
            check.checked ? 0 : requires?.paleOre ?? 0,
        ],
        geo: [state.geo, state.geoReq, check.checked ? 0 : requires?.geo ?? 0],
        simpleKeys: [
            state.simpleKeys,
            state.simpleKeysReq,
            check.checked ? 0 : requires?.simpleKeys ?? 0,
        ],
    };

    for (const key in Object.keys(reqs)) {
        const typedKey = key as keyof typeof reqs;
        if (requires?.[typedKey]) {
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
const validateChecks = (state: ChecklistState): RequirementCheckErrors => {
    const errors: RequirementCheckErrors = {};

    Object.values(state).forEach(
        stateValue =>
            typeof stateValue === 'object' &&
            !Array.isArray(stateValue) &&
            stateValue !== null &&
            Object.entries(stateValue as Checks).forEach(
                ([sectionName, section]) => {
                    const typedSectionName = sectionName as CheckSection;
                    Object.entries(section).forEach(([checkName, check]) => {
                        const typedCheckName =
                            checkName as keyof ChecksSection<CheckSection>;

                        const error =
                            check.checked && validateCheck(state, check);

                        if (error) {
                            errors[`${typedSectionName} ${typedCheckName}`] =
                                error;
                        }
                    });
                }
            )
    );

    return errors;
};

const applyReward = (
    state: ChecklistState,
    reward: CheckRewards,
    willCheck: boolean
) => {
    if (willCheck) {
        updateState(state, reward, 'add');
    } else {
        updateState(state, reward, 'sub');
    }
};

const grubRewards = (state: ChecklistState, willCheck: boolean) => {
    const grubs = state.grubs;

    const grubReward = willCheck
        ? GRUB_REWARDS[grubs - 1]
        : GRUB_REWARDS[grubs];

    applyReward(state, { geo: grubReward }, willCheck);
};

const maskShardRewards = (state: ChecklistState, willCheck: boolean) => {
    const maskShards = state.maskShards;

    const percent = willCheck
        ? [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1][maskShards - 1]
        : [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1][maskShards];

    applyReward(state, { percent }, willCheck);
};

const vesselFragmentRewards = (state: ChecklistState, willCheck: boolean) => {
    const vesselFragments = state.vesselFragments;

    const percent = willCheck
        ? [0, 0, 1, 0, 0, 1, 0, 0, 1][vesselFragments - 1]
        : [0, 0, 1, 0, 0, 1, 0, 0, 1][vesselFragments];

    applyReward(state, { percent }, willCheck);
};

const handleCheck = (
    state: ChecklistState,
    sectionName: CheckSection,
    check: Check,
    willCheck: boolean
) => {
    if (check.checked === willCheck) {
        return;
    }
    applyReward(state, check.reward, willCheck);
    check.checked = willCheck;
    if (sectionName === 'grubs') {
        grubRewards(state, willCheck);
    }
    if (sectionName === 'maskShards') {
        maskShardRewards(state, willCheck);
    }
    if (sectionName === 'vesselFragments') {
        vesselFragmentRewards(state, willCheck);
    }
};

const useChecklistStore = create<ChecklistState & Action>()(
    persist(
        temporal(
            immer(set => ({
                ...INITIAL_CHECKLIST_STATE,

                reset: (sectionName?: CheckSection) => {
                    if (sectionName) {
                        set(state => {
                            Object.values(state.checks[sectionName]).forEach(
                                check =>
                                    handleCheck(
                                        state,
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
                        set(INITIAL_CHECKLIST_STATE);
                    }
                },

                checkAll: (sectionName?: CheckSection) => {
                    if (sectionName) {
                        set(state => {
                            Object.values(state.checks[sectionName]).forEach(
                                check =>
                                    handleCheck(state, sectionName, check, true)
                            );
                        });
                    } else {
                        set(state => {
                            Object.entries(state.checks).forEach(
                                ([sectionName, section]) => {
                                    Object.values(section).forEach(check =>
                                        handleCheck(
                                            state,
                                            sectionName as CheckSection,
                                            check,
                                            true
                                        )
                                    );
                                }
                            );
                        });
                    }
                },

                toggle: <S extends CheckSection>(
                    section: S,
                    name: keyof ChecksSection<S>
                ) => {
                    set(state => {
                        // Update state after a check/uncheck

                        const check = (
                            state.checks[section] as ChecksSection<S>
                        )[name] as Check;

                        const willCheck = !check.checked;
                        handleCheck(state, section, check, willCheck);
                    });
                },

                validateCheck,

                validateChecks,
            }))
        ),
        {
            name: 'checklist-storage',
            merge: (persisted, current) =>
                deepMerge(current, persisted as ChecklistState & Action),
        }
    )
);

export default useChecklistStore;
