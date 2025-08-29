import styled, { css } from 'styled-components';

import { POINTER } from '../assets';
import { COLORS } from '../constants';

type ButtonSize = 'big' | 'small';

interface ButtonProps {
    size?: ButtonSize;
    label: string;
    onClick: () => void;
}

type ButtonWrapperProps = {
    $size: ButtonSize;
};

const ButtonWrapper = styled.div<ButtonWrapperProps>`
    transition: 0.2s;
    display: flex;
    align-items: center;
    height: min(60px, 10vw);

    & button {
        font-size: min(32px, 5vw);
        line-height: min(32px, 5vw);
        font-family: 'Cinzel', sans-serif;
        background: transparent;
        color: ${COLORS.white};
        border: none;
        cursor: pointer;
    }

    & div {
        position: relative;
        width: min(30px, 5vw);
        height: min(32px, 5vw);

        img {
            transition: 0.4s;
            opacity: 0;
            height: 100%;
            position: absolute;
        }
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
            height: min(20px, 3.5vw);

            & button {
                font-size: min(16px, 3.5vw);
                line-height: min(16px, 3.5vw);
            }

            & div {
                height: min(16px, 3.5vw);
                width: min(10px, 3vw);
            }
        `}
`;

const Button: React.FC<ButtonProps> = ({ label, onClick, size }) => {
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

export default Button;
