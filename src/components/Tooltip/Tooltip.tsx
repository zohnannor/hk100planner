import { PropsWithChildren, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import useUiStore from '../../stores/uiStore';
import DialogBox from '../DialogBox';
import { FText } from '../FText/FText';

const TooltipRoot = styled.div`
    position: fixed;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    z-index: 100;
`;

const TooltipOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: rgba(0, 0, 0, 0.6);
`;

const Shadow = styled.div`
    display: flex;
    height: 300px;
    width: 1000px;
    background: rgba(0, 0, 0, 0.7);
    box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.7);
    font-size: 24px;
    padding: 12px 60px;
    max-width: 1000px;
    justify-content: center;

    & > div > div {
        padding-top: 16px;
    }
`;

export const Tooltip: React.FC<PropsWithChildren> = ({ children }) => {
    const closeTooltip = useUiStore(state => state.closeTooltip);
    const isTooltipOpen = useUiStore(state => state.isTooltipOpen);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeTooltip();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    if (!isTooltipOpen) return null;

    return ReactDOM.createPortal(
        <>
            <TooltipOverlay onClick={closeTooltip} />
            <TooltipRoot>
                <Shadow>
                    <DialogBox>
                        <FText>{children}</FText>
                    </DialogBox>
                </Shadow>
            </TooltipRoot>
        </>,
        document.querySelector('#tooltip-root')!
    );
};
