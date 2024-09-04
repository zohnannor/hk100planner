import React from 'react';
import styled from 'styled-components';

import { ExclamationMark, QuestionMark } from '../../assets';
import { COLORS, OFFICIAL_TM_GRUB_NAMES } from '../../constants';
import useChecklistStore from '../../stores/checklistStore';
import useUiStore from '../../stores/uiStore';
import {
    Check,
    CheckSection,
    ChecksKeys,
    ChecksSection,
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
    width: 300px;
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

type SectionCheckBoxProps = {
    sectionName: keyof ChecksKeys;
    name: string;
    check: Check;
};

const InfoWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const SectionCheckBox: React.FC<SectionCheckBoxProps> = ({
    sectionName,
    name,
    check,
}) => {
    const toggle = useChecklistStore(state => state.toggle);
    const validateChecks = useChecklistStore(
        state => () => state.validateChecks(state)
    );
    const validateCheck = useChecklistStore(
        state => (check: Check) => state.validateCheck(state, check)
    );

    const setTooltipText = useUiStore(state => state.setTooltipText);
    const openTooltip = useUiStore(state => state.openTooltip);
    const useOfficialTMGrubNames = useUiStore(
        state => state.useOfficialTMGrubNames
    );
    const checksValidation = useUiStore(state => state.checksValidation);
    const setChecklistHasErrors = useUiStore(
        state => state.setChecklistHasErrors
    );

    const errors = checksValidation ? validateChecks() : {};
    setChecklistHasErrors(Object.keys(errors).length > 0);

    const typedName = name as keyof ChecksSection<CheckSection>;
    const { description } = check;
    const error = formatCheckListError(
        typedName,
        errors[`${sectionName} ${typedName}`]
    );

    let label =
        useOfficialTMGrubNames && sectionName === 'grubs'
            ? OFFICIAL_TM_GRUB_NAMES[typedName as keyof ChecksSection<'grubs'>]
            : name;

    {
        const req = check.requires;
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

    const handleClick = () => toggle(sectionName, typedName);

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
                        ? error
                            ? COLORS.red
                            : check.checked
                            ? COLORS.white
                            : canBeChecked
                            ? COLORS.green
                            : COLORS.gray
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
};
