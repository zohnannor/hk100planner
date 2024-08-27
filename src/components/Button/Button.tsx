import styled from 'styled-components';

import POINTER from '../../assets/button-pointer.png';

interface ButtonProps {
    label: string;
    onClick: () => void;
}

const ButtonElement = styled.div`
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
`;

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
    return (
        <ButtonElement>
            <img src={POINTER} alt='reset-button-left' />
            <button onClick={onClick}>{label}</button>
            <img src={POINTER} alt='reset-button-right' />
        </ButtonElement>
    );
};
