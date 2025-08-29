import { SilksongChecklistState } from '../types/checklist';

export const INITIAL_SILKSONG_CHECKLIST_STATE: SilksongChecklistState = {
    percent: 0,
    checks: {
        bosses: {
            'LACE TODO': {
                reward: {},
            },
        },
        things: {
            TODO: {
                reward: {},
            },
        },
    },
};
