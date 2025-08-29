import { SilksongChecklistState } from '../types/checklist';

export const INITIAL_SILKSONG_CHECKLIST_STATE: SilksongChecklistState = {
    game: 'silksong',
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
