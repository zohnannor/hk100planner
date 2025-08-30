import { OFFICIAL_TM_GRUB_NAMES } from '../constants';
import useUiStore from '../stores/uiStore';
import {
    CheckNames,
    Checks,
    ChecksSection,
    GameKey,
    RequirementCheckErrors,
    SectionNames,
} from '../types/checklist';
import { typedEntries } from './typedObject';

const formatCheckListError = <Game extends GameKey>(
    checkName: CheckNames<Game, SectionNames<Game>>,
    errors:
        | NonNullable<
              NonNullable<RequirementCheckErrors[Game]>[SectionNames<Game>]
          >[CheckNames<Game, SectionNames<Game>>] // | string
        | undefined
): string | undefined => {
    if (errors && typeof errors === 'object') {
        const useOfficialTMGrubNames =
            useUiStore.getState().useOfficialTMGrubNames;
        const name =
            useOfficialTMGrubNames &&
            OFFICIAL_TM_GRUB_NAMES.hasOwnProperty(checkName)
                ? OFFICIAL_TM_GRUB_NAMES[
                      checkName as CheckNames<'hollow-knight', 'grubs'>
                  ]
                : checkName;

        const requires = typedEntries(errors)
            .map(([requirement, error]) => {
                // TODO: types?
                const typedRequirement = requirement as SectionNames<Game>;
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
                    case 'vesselFragments':
                    case 'geoReq':
                    case 'essenceReq':
                    case 'paleOreReq':
                    case 'simpleKeysReq':
                    case 'game':
                    case 'percent':
                        throw new Error(
                            `Nothing should require ${typedRequirement}`
                        );
                    case 'checks': {
                        return typedEntries(error as Checks<Game>)
                            .map(([section, sectionErrors]) => {
                                const positive = getEntriesText(
                                    section,
                                    sectionErrors,
                                    true
                                );
                                const negative = getEntriesText(
                                    section,
                                    sectionErrors,
                                    false
                                );

                                return positive + negative;
                            })
                            .join('; ');
                    }
                    default:
                        throw new Error(
                            `Unimplemented requirement for '${
                                typedRequirement /* satisfies never */ // :(
                            }' type`
                        );
                }
            })
            .filter(Boolean)
            .join(', ');

        return `${name} requires ${requires}.`;
    } else if (typeof errors === 'string') {
        return errors;
    }
    return undefined;
};

const getEntriesText = <Game extends GameKey>(
    section: SectionNames<Game>,
    sectionErrors: ChecksSection<Game, SectionNames<Game>>,
    checked: boolean
) => {
    const entries = typedEntries(sectionErrors)
        .filter(([, check]) => (check.checked ?? false) === checked)
        .map(([name]) => name);

    return entries.length !== 0
        ? requirementTextForSection(
              section,
              entries.join(', ') + (checked ? ' to be ' : ' to not be ')
          )
        : '';
};

const requirementTextForSection = <Game extends GameKey>(
    section: SectionNames<Game>,
    joined: string
) => {
    // TODO: isHollowKnightState (?)
    switch (section) {
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
                    section /* satisfies never */ // :(
                }' section`
            );
    }
    return joined;
};

export default formatCheckListError;
