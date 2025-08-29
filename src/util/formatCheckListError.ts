import { PartialDeep } from 'type-fest';

import { OFFICIAL_TM_GRUB_NAMES } from '../constants';
import useUiStore from '../stores/uiStore';
import {
    Check,
    ChecklistState,
    Checks,
    ChecksKeys,
    ChecksSection,
    GameKey,
    SectionErrors,
    SectionNames,
} from '../types/checklist';

const formatCheckListError = <
    Game extends GameKey,
    Section extends SectionNames<Game>
>(
    checkName: ChecksKeys<Game>[Section] & string,
    errors:
        | SectionErrors<Game, Section>[ChecksKeys<Game>[Section] & string]
        | undefined
): string | undefined => {
    if (errors && typeof errors === 'object') {
        const useOfficialTMGrubNames =
            useUiStore.getState().useOfficialTMGrubNames;
        const name =
            useOfficialTMGrubNames &&
            OFFICIAL_TM_GRUB_NAMES.hasOwnProperty(checkName)
                ? OFFICIAL_TM_GRUB_NAMES[
                      checkName as ChecksKeys<'hollow-knight'>['grubs']
                  ]
                : checkName;

        const requires = Object.entries(errors)
            .map(
                ([requirement, error]: [
                    string,
                    PartialDeep<ChecklistState<Game>>
                ]) => {
                    const typedRequirement =
                        requirement as keyof ChecklistState<Game>;

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
                            return Object.entries(error as Checks<Game>)
                                .map(([section, sectionErrors]) => {
                                    const typedSection =
                                        section as SectionNames<Game>;
                                    const typedSectionErrors =
                                        sectionErrors as ChecksSection<
                                            Game,
                                            SectionNames<Game>
                                        >;

                                    const positive = getEntriesText(
                                        typedSection,
                                        typedSectionErrors,
                                        true
                                    );
                                    const negative = getEntriesText(
                                        typedSection,
                                        typedSectionErrors,
                                        false
                                    );

                                    return positive + negative;
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
                                `Nothing should require ${requirement}`
                            );
                        }

                        default:
                            throw new Error(
                                `Unimplemented requirement for '${
                                    typedRequirement as string /* satisfies never */ // :(
                                }' type`
                            );
                    }
                }
            )
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
    const entries = Object.entries<Check<Game>>(sectionErrors)
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
                    section as string /* satisfies never */ // :(
                }' section`
            );
    }
    return joined;
};

export default formatCheckListError;
