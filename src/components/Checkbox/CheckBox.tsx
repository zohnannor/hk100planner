import styled, { css } from 'styled-components';

import { CheckIcon } from '../../assets';

interface CheckboxSquareProps {
    $checked?: boolean;
}

interface CheckboxProps {
    defaultChecked?: boolean;
    label: string;
    error?: string;
    onToggle?: () => void;
}

const CheckBoxLabel = styled.span`
    max-width: 250px;
    transition: 0.2s;
    font-size: 22px;
    line-height: 24px;
`;

const CheckBoxWrapper = styled.div`
    min-width: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    &:hover span {
        filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 1));
    }
`;

const CheckBoxError = styled.span`
    font-size: 22px;
    color: red;
`;

const CheckBoxControls = styled.div`
    min-width: 300px;
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
    error,
    label,
    onToggle,
}) => {
    return (
        <CheckBoxWrapper>
            <CheckBoxControls onClick={() => onToggle?.()}>
                <CheckBoxSquare $checked={defaultChecked}>
                    {defaultChecked && <CheckIcon />}
                </CheckBoxSquare>
                <CheckBoxLabel>{label}</CheckBoxLabel>
            </CheckBoxControls>
            <CheckBoxError>{error}</CheckBoxError>
        </CheckBoxWrapper>
    );
};
