import styled from 'styled-components';
import { PartialDeep } from 'type-fest';

import { ExclamationMark, QuestionMark } from '../../assets';
import { COLORS, OFFICIAL_TM_GRUB_NAMES } from '../../constants';
import useChecklistStore, { ChecklistStore } from '../../stores/checklistStore';
import useUiStore from '../../stores/uiStore';
import {
    Check,
    ChecklistState,
    ChecksKeys,
    ChecksSection,
    GameKey,
    RequirementCheckErrors,
    SectionNames,
} from '../../types/checklist';
import formatCheckListError from '../../util/formatCheckListError';
import { isHollowKnight } from '../../util/isHollowKnight';
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
    checkName: ChecksKeys<Game>[Section] & string;
    check: Check<Game>;
    errors: RequirementCheckErrors<Game>;
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
    // TODO: tab?
    const currentTab = useUiStore(state => state.currentTab);
    const useStore = useChecklistStore[
        currentTab
    ] as unknown as ChecklistStore<Game>; // :sob:
    const toggle = useStore(state => state.toggle);
    const validateCheck = useStore(
        state => (check: Check<Game>) => state.validateCheck(state, check)
    );

    const setTooltipText = useUiStore(state => state.setTooltipText);
    const openTooltip = useUiStore(state => state.openTooltip);
    const useOfficialTMGrubNames = useUiStore(
        state => state.useOfficialTMGrubNames
    );
    const checksValidation = useUiStore(state => state.checksValidation);

    const { description } = check;
    const sectionErrors = errors[sectionName];
    const checkErrors = sectionErrors?.[checkName];
    const error = formatCheckListError(checkName, checkErrors);

    let label =
        useOfficialTMGrubNames && sectionName === 'grubs'
            ? OFFICIAL_TM_GRUB_NAMES[
                  checkName as keyof ChecksSection<'hollow-knight', 'grubs'>
              ]
            : checkName;

    if (isHollowKnight(useChecklistStore['hollow-knight']())) {
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

    const handleClick = () => toggle(sectionName, checkName);

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
