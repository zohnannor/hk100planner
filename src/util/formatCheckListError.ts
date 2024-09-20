import { OFFICIAL_TM_GRUB_NAMES } from '../constants';
import useUiStore from '../stores/uiStore';
import {
    ChecklistState,
    Checks,
    CheckSection,
    ChecksSection,
    RequirementCheckErrors,
} from '../types/checklist';

const formatCheckListError = (
    checkName: keyof ChecksSection<CheckSection>,
    errors: RequirementCheckErrors[`${CheckSection} ${keyof ChecksSection<CheckSection>}`]
): string | undefined => {
    if (errors) {
        const useOfficialTMGrubNames =
            useUiStore.getState().useOfficialTMGrubNames;
        const name =
            useOfficialTMGrubNames &&
            Object.keys(OFFICIAL_TM_GRUB_NAMES).includes(checkName)
                ? OFFICIAL_TM_GRUB_NAMES[
                      checkName as keyof ChecksSection<'grubs'>
                  ]
                : checkName;

        return `${name} requires ${Object.entries(errors)
            .map(([requirement, error]) => {
                const typedRequirement = requirement as keyof ChecklistState;

                switch (typedRequirement) {
                    case 'geo':
                        return `[GEO] ${error}`;
                    case 'essence':
                        return `[ESSENCE] ${error}`;
                    case 'paleOre':
                        return `[PALE_ORE] ${error}`;
                    case 'grubs':
                        return `${error} grubs rescued`;
                    case 'simpleKeys':
                        return `${error} simple key(s) collected`;
                    case 'maskShards':
                        return `${error} mask shard(s) collected`;
                    case 'charms':
                        return `${error} charms collected`;
                    case 'checks': {
                        return Object.entries(error as Checks)
                            .map(([section, sectionErrors]) => {
                                const typedSection = section as CheckSection;

                                let joined =
                                    Object.keys(sectionErrors).join(', ') +
                                    ' to be ';

                                switch (typedSection) {
                                    case 'bosses':
                                    case 'optionalBosses':
                                    case 'dreamers':
                                    case 'dreamWarriors':
                                    case 'dreamBosses': {
                                        joined += 'defeated';
                                        break;
                                    }
                                    case 'equipment':
                                    case 'charms':
                                    case 'items':
                                    case 'vesselFragments':
                                    case 'maskShards': {
                                        joined += 'acquired';
                                        break;
                                    }
                                    case 'relics':
                                    case 'whisperingRoots':
                                        joined += 'collected';
                                        break;
                                    case 'spells': {
                                        joined += 'learned';
                                        break;
                                    }
                                    case 'nail':
                                    case 'nailArts':
                                    case 'dreamNail': {
                                        joined += 'obtained';
                                        break;
                                    }
                                    case 'grubs': {
                                        joined += 'rescued';
                                        break;
                                    }
                                    case 'colosseum':
                                    case 'godhome': {
                                        joined += 'completed';
                                        break;
                                    }
                                    default:
                                        throw new Error(
                                            `Unimplemented requirement for '${
                                                typedSection satisfies never
                                            }' section`
                                        );
                                }

                                return joined;
                            })
                            .join('; ');
                    }

                    case 'percent':
                    case 'geoReq':
                    case 'essenceReq':
                    case 'paleOreReq':
                    case 'simpleKeysReq':
                    case 'vesselFragments': {
                        throw new Error(
                            `Nothing should require ${typedRequirement}`
                        );
                    }

                    default:
                        throw new Error(
                            `Unimplemented requirement for '${
                                typedRequirement satisfies never
                            }' type`
                        );
                }
            })
            .join(', ')}.`;
    }

    return undefined;
};

export default formatCheckListError;
