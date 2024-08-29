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
                        return `${error} [GEO]`;
                    case 'essence':
                        return `${error} [ESSENCE]`;
                    case 'paleOre':
                        return `PALE ORE: ${error} [PALE_ORE]`;
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
                                        joined += ' defeated';
                                        break;
                                    }
                                    case 'equipment':
                                    case 'charms': {
                                        joined += ' collected';
                                        break;
                                    }
                                    case 'spells': {
                                        joined += ' learned';
                                        break;
                                    }
                                    case 'colosseum': {
                                        joined += ' completed';
                                        break;
                                    }
                                    default: {
                                        throw new Error(
                                            `Unimplemented requirement type error for '${typedSection}' section`
                                        );
                                    }
                                }

                                return joined;
                            })
                            .join('; ');
                    }

                    default:
                        throw new Error(
                            `Unimplemented requirement type error for '${typedRequirement}' type`
                        );
                }
            })
            .join(', ')}`;
    }

    return undefined;
};

export default formatCheckListError;
