import { SilksongChecklistState } from '../types/checklist';

export const INITIAL_SILKSONG_CHECKLIST_STATE: SilksongChecklistState = {
    game: 'silksong',
    percent: 0,
    rosaries: 0,
    rosariesReq: 0,

    checks: {
        bosses: {
            '[Lace]': {
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
