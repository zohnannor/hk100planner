import styled from 'styled-components';
import { PartialDeep } from 'type-fest';

import { ExclamationMark, QuestionMark } from '../../assets';
import { COLORS, OFFICIAL_TM_GRUB_NAMES } from '../../constants';
import { useCurrentChecklistStore } from '../../hooks/useCurrentChecklistStore';
import useUiStore from '../../stores/uiStore';
import {
    Check,
    ChecklistState,
    CheckNames,
    GameKey,
    RequirementCheckErrors,
    SectionNames,
} from '../../types/checklist';
import formatCheckListError from '../../util/formatCheckListError';
import { CheckBox } from './CheckBox';

const OuterShadow = styled.div`
    cursor: pointer;
    position: absolute;
    top: -20%;
    left: -20%;
    width: 140%;
    height: 140%;
    background: rgba(0, 0, 0, 0.35);
    border-radius: 4px;
    filter: blur(4px);
    opacity: 0;
    z-index: 1;
    transition: 0.2s;
    &:hover {
        opacity: 1;
    }
`;

const CheckBoxWrapper = styled.div`
    position: relative;
    width: min(300px, 80vw);
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
        ${OuterShadow} {
            opacity: 1;
        }
    }

    & > :not(div:first-child) {
        z-index: 2;
    }
`;

type SectionCheckBoxProps<
    Game extends GameKey,
    Section extends SectionNames<Game>
> = {
    sectionName: Section;
    checkName: CheckNames<Game, Section>;
    check: Check<Game>;
    errors: RequirementCheckErrors[Game];
};

const InfoWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export function SectionCheckBox<
    Game extends GameKey,
    Section extends SectionNames<Game>
>({
    sectionName,
    checkName,
    check,
    errors,
}: SectionCheckBoxProps<Game, Section>) {
    const useChecklist = useCurrentChecklistStore();
    const toggle = useChecklist(
        state =>
            state.toggle as <S extends SectionNames<Game>>(
                section: S,
                name: CheckNames<Game, S>
            ) => void
    );
    const validateCheck = useChecklist(
        state => (check: Check<Game>) => state.validateCheck(state, check)
    );

    const setTooltipText = useUiStore(state => state.setTooltipText);
    const openTooltip = useUiStore(state => state.openTooltip);
    const useOfficialTMGrubNames = useUiStore(
        state => state.useOfficialTMGrubNames
    );
    const checksValidation = useUiStore(state => state.checksValidation);

    const { description } = check;
    console.log({ errors });

    const error = formatCheckListError(
        checkName,
        errors
            ? errors![sectionName]
                ? errors![sectionName]![checkName] // wtf typescript
                : undefined
            : undefined
    );

    let label =
        useOfficialTMGrubNames && sectionName === 'grubs'
            ? OFFICIAL_TM_GRUB_NAMES[
                  checkName as CheckNames<'hollow-knight', 'grubs'>
              ]
            : checkName;

    {
        const req = check.requires as PartialDeep<
            ChecklistState<'hollow-knight'>
        >;
        if (typeof req === 'object') {
            const parts = [
                req?.geo ? `[GEO] ${req.geo}` : null,
                req?.essence ? `[ESSENCE] ${req.essence}` : null,
                req?.paleOre ? `[PALE_ORE] ${req.paleOre}` : null,
            ]
                .filter(Boolean)
                .join(', ');
            if (parts.length > 0) {
                label += ` (${parts})`;
            }
        }
    }

    const handleClick = () =>
        toggle(sectionName as SectionNames<Game>, checkName);

    const canBeChecked = !validateCheck(check);

    return (
        <CheckBoxWrapper>
            <OuterShadow onClick={handleClick} />
            <CheckBox
                label={label}
                onToggle={handleClick}
                defaultChecked={check.checked}
                color={
                    checksValidation
                        ? !error
                            ? canBeChecked
                                ? !check.checked
                                    ? COLORS.green
                                    : COLORS.white
                                : COLORS.gray
                            : COLORS.red
                        : COLORS.white
                }
            />
            {description && (
                <InfoWrapper
                    onClick={() => {
                        setTooltipText(description);
                        openTooltip();
                    }}
                >
                    <QuestionMark />
                </InfoWrapper>
            )}
            {error && (
                <InfoWrapper
                    onClick={() => {
                        setTooltipText(error);
                        openTooltip();
                    }}
                >
                    <ExclamationMark />
                </InfoWrapper>
            )}
        </CheckBoxWrapper>
    );
}
