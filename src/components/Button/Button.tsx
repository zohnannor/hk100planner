import styled, { css } from 'styled-components';

import { POINTER } from '../../assets';
import { COLORS } from '../../constants';

type ButtonSize = 'big' | 'small';

interface ButtonProps {
    size?: ButtonSize;
    label: string;
    onClick: () => void;
}

const ButtonWrapper = styled.div<{
    $size: ButtonSize;
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
        color: ${COLORS.white};
        border: none;
        cursor: pointer;
    }

    & div {
        position: relative;
        width: 30px;
        height: 32px;
    }

    & div img {
        transition: 0.4s;
        opacity: 0;
        height: 32px;
        position: absolute;
    }

    & div:nth-of-type(1) img {
        right: 0;
    }

    & div:nth-of-type(2) img {
        left: 0;
        transform: rotate(180deg);
    }

    &:hover {
        filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 1));

        img {
            opacity: 100%;
        }
    }

    ${({ $size }) =>
        $size === 'small' &&
        css`
            height: 20px;

            & button {
                font-size: 16px;
                line-height: 16px;
            }

            & div {
                height: 16px;
                width: 10px;
            }

            & div img {
                height: 16px;
            }
        `}
`;

export const Button: React.FC<ButtonProps> = ({ label, onClick, size }) => {
    return (
        <ButtonWrapper $size={size || 'big'}>
            <div>
                <img src={POINTER} alt='reset-button-left' />
            </div>
            <button onClick={() => onClick()}>{label}</button>
            <div>
                <img src={POINTER} alt='reset-button-right' />
            </div>
        </ButtonWrapper>
    );
};
