import {
    ChecklistState,
    GameKey,
    HollowKnightChecklistState,
} from '../types/checklist';

export function isHollowKnight(
    state: ChecklistState<GameKey> // wtf typescript?
): state is HollowKnightChecklistState {
    return 'geo' in state;
}
