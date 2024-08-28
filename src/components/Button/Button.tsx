import styled, { css } from 'styled-components';

import { POINTER } from '../../assets';

type ButtonSize = 'big' | 'small';

interface ButtonProps {
    size?: ButtonSize;
    label: string;
    onClick: () => void;
}

const ButtonElement = styled.div<{
    size: ButtonSize;
}>`
    transition: 0.2s;
    display: flex;
    align-items: center;
    height: 60px;

    & button {
        font-size: 32px;
        line-height: 32px;
        font-family: 'Cinzel', sans-serif;
        background: transparent;
        color: white;
        border: none;
    }

    & img {
        transition: 0.4s;
        opacity: 0;
        height: 32px;

        &:nth-of-type(2) {
            transform: rotate(180deg);
        }
    }

    &:hover {
        filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 1));

        img {
            opacity: 100%;
        }
    }

    ${({ size }) =>
        size === 'small' &&
        css`
            height: 20px;

            & button {
                font-size: 16px;
                line-height: 16px;
            }

            & img {
                height: 16px;
            }
        `}
`;

export const Button: React.FC<ButtonProps> = ({ label, onClick, size }) => {
    return (
        <ButtonElement size={size || 'big'}>
            <img src={POINTER} alt='reset-button-left' />
            <button onClick={onClick}>{label}</button>
            <img src={POINTER} alt='reset-button-right' />
        </ButtonElement>
    );
};
