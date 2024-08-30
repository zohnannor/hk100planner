import styled, { css } from 'styled-components';

import { CheckIcon } from '../../assets';
import { FlexBox } from '../../styles';
import { FText } from '../FText/FText';

interface CheckboxSquareProps {
    $checked?: boolean;
}

export interface CheckboxProps {
    defaultChecked?: boolean;
    label: string;
    error?: string;
    onToggle?: () => void;
}

const CheckBoxLabel = styled.span`
    width: 250px;
    transition: 0.2s;
    font-size: 22px;
    line-height: 24px;
    text-wrap: pretty;
`;

const CheckBoxControls = styled.div`
    min-width: 32px;
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 16px;
`;

const CheckBoxSquare = styled.div<CheckboxSquareProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    background-color: transparent;
    border: 2px solid white;
    border-radius: 4px;
    gap: 8px;
    padding: 4px;

    ${({ $checked }) =>
        $checked &&
        css`
            filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 1));
        `}
`;

export const CheckBox: React.FC<CheckboxProps> = ({
    defaultChecked = false,
    label,
    onToggle,
}) => {
    return (
        <FlexBox>
            <CheckBoxControls onClick={() => onToggle?.()}>
                <CheckBoxSquare $checked={defaultChecked}>
                    {defaultChecked && <CheckIcon />}
                </CheckBoxSquare>
            </CheckBoxControls>
            <CheckBoxLabel>
                <FText>{label}</FText>
            </CheckBoxLabel>
        </FlexBox>
    );
};
