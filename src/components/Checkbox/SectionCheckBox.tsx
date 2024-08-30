import React from 'react';
import styled from 'styled-components';

import { ExclamationMark, QuestionMark } from '../../assets';
import useUiStore from '../../stores/uiStore';
import { CheckBox, CheckboxProps } from './CheckBox';

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
    justify-self: center;
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

type SectionCheckBoxProps = CheckboxProps & {
    error?: string;
    description?: string;
};

const InfoWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const SectionCheckBox: React.FC<SectionCheckBoxProps> = ({
    error,
    description,
    ...rest
}) => {
    const { onToggle } = rest;
    const setTooltipText = useUiStore(state => state.setTooltipText);
    const openTooltip = useUiStore(state => state.openTooltip);

    return (
        <CheckBoxWrapper>
            <OuterShadow onClick={() => onToggle?.()} />
            <CheckBox {...rest} />
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
