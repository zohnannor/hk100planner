import { PropsWithChildren, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import useUiStore from '../stores/uiStore';
import sleep from '../util/sleep';
import DialogBox from './DialogBox';
import FText from './FText';

type TooltipProps = {
    $opacity: number;
};

const TooltipRoot = styled.div<TooltipProps>`
    position: fixed;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    z-index: 100;
    transition: opacity 0.2s;
    opacity: ${({ $opacity }) => $opacity};
`;

const TooltipOverlay = styled.div<TooltipProps>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: rgba(0, 0, 0, 0.6);
    transition: opacity 0.2s;
    opacity: ${({ $opacity }) => $opacity};
`;

const Shadow = styled.div`
    display: flex;
    min-height: fit-content;
    height: clamp(300px, calc(100vh - 50vw), 500px);
    width: min(1000px, 90vw);
    background: rgba(0, 0, 0, 0.7);
    box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.7);
    font-size: min(24px, 5vw);
    padding: 12px min(60px, 8vw);
    max-width: 1000px;
    justify-content: center;

    & > div > div {
        padding-top: 16px;
    }
`;

const Tooltip: React.FC<PropsWithChildren> = ({ children }) => {
    const closeTooltip = useUiStore(state => state.closeTooltip);
    const isTooltipOpen = useUiStore(state => state.isTooltipOpen);
    const [opacity, setOpacity] = useState(0);

    // set opacity to 1 after tooltip has opened and rendered
    useEffect(() => {
        if (isTooltipOpen) {
            setOpacity(1);
        }
    }, [isTooltipOpen]);

    const handleClose = async () => {
        // set opacity to 0 immediately
        setOpacity(0);
        // and close with a delay
        await sleep(200);
        closeTooltip();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    if (!isTooltipOpen) return null;

    return ReactDOM.createPortal(
        <>
            <TooltipOverlay $opacity={opacity} onClick={handleClose} />
            <TooltipRoot $opacity={opacity}>
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

export default Tooltip;
