import {
    ChecklistState,
    Checks,
    CheckSection,
    ChecksSection,
    RequirementCheckErrors,
} from '../types/checklist';

const formatCheckListError = (
    checkName: keyof ChecksSection<CheckSection>,
    errors: RequirementCheckErrors[keyof ChecksSection<CheckSection>]
): string | undefined => {
    if (errors) {
        return `${checkName} requires ${Object.entries(errors)
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
                    case 'checks': {
                        return Object.entries(error as Checks)
                            .map(([section, sectionErrors]) => {
                                const typedSection = section as CheckSection;

                                let joined =
                                    Object.keys(sectionErrors).join(', ') +
                                    ' to be ';

                                switch (typedSection) {
                                    case 'bosses':
                                    case 'dreamers':
                                    case 'dreamWarriors':
                                    case 'dreamBosses': {
                                        joined += 'defeated';
                                        break;
                                    }
                                    case 'equipment':
                                    case 'charms':
                                    case 'relicsAndItems': {
                                        joined += 'collected';
                                        break;
                                    }
                                    case 'spells': {
                                        joined += 'learned';
                                        break;
                                    }
                                    case 'colosseum': {
                                        joined += 'completed';
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
                                    case 'godhome': {
                                        joined += 'completed';
                                        break;
                                    }
                                    default: {
                                        throw new Error(
                                            `Unimplemented requirement for '${typedSection}' section`
                                        );
                                    }
                                }

                                return joined;
                            })
                            .join(' and ');
                    }

                    default:
                        throw new Error(
                            `Unimplemented requirement for '${typedRequirement}' type`
                        );
                }
            })
            .join(', ')}.`;
    }

    return undefined;
};

export default formatCheckListError;
