import styled, { css } from 'styled-components';

import { CheckIcon } from '../../assets';
import { COLORS } from '../../constants';
import { FlexBox } from '../../styles';
import FText from '../FText';

import type { Property } from 'csstype';

type CheckboxSquareProps = {
    $checked?: boolean;
    $color?: Property.Color;
};

type CheckboxProps = {
    defaultChecked?: boolean;
    label: string;
    color?: Property.Color;
    onToggle?: () => void;
};

const CheckBoxLabel = styled.span<{ $color?: Property.Color }>`
    cursor: pointer;
    width: min(300px, 60vw);
    transition: 0.2s;
    font-size: min(22px, 5vw);
    line-height: min(24px, 5vw);
    color: ${({ $color }) => $color || COLORS.white};
    text-wrap: pretty;
    text-wrap: stable;
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
    border: 2px solid ${({ $color }) => $color || COLORS.white};
    border-radius: 4px;
    gap: 8px;
    padding: 4px;

    ${({ $checked }) =>
        $checked &&
        css`
            filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 1));
        `}
`;

const CheckBox: React.FC<CheckboxProps> = ({
    defaultChecked = false,
    label,
    color,
    onToggle,
}) => {
    return (
        <FlexBox>
            <CheckBoxControls onClick={() => onToggle?.()}>
                <CheckBoxSquare $checked={defaultChecked} $color={color}>
                    {defaultChecked && <CheckIcon color={color} />}
                </CheckBoxSquare>
            </CheckBoxControls>
            <CheckBoxLabel onClick={() => onToggle?.()} $color={color}>
                <FText>{label}</FText>
            </CheckBoxLabel>
        </FlexBox>
    );
};

export default CheckBox;
