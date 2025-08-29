import { PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';

import { HR2 } from '../assets';
import { BREAKPOINTS, COLORS } from '../constants';
import { useBreakpoint } from '../hooks/useBreakpoint';
import useChecklistStore, { ChecklistStore } from '../stores/checklistStore';
import { FlexBox, HasErrors } from '../styles';
import { GameKey } from '../types/checklist';
import Button from './Button';

interface ContainerProps {
    $visible: boolean;
}

const Container = styled.div<ContainerProps>`
    position: relative;
    transition: 0.3s;
    display: flex;
    align-items: center;
    flex-direction: column;
    position: fixed;
    right: 64px;
    top: 24px;
    z-index: 10;
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    ${({ $visible }) =>
        !$visible &&
        css`
            pointer-events: none;
        `}

    @media (max-width: ${BREAKPOINTS.laptop}px) {
        top: 0;
        right: 0;
    }
`;

const MobileContainerBackdropBlur = styled.div`
    padding: 24px 0;
    @media (max-width: ${BREAKPOINTS.laptop}px) {
        width: 100vw;
        backdrop-filter: blur(10px);
        mask: linear-gradient(black 85%, transparent);
    }
`;

export const SidePercentLabel = styled.div<HasErrors>`
    font-size: 52px;
    line-height: 52px;
    margin-bottom: 12px;

    ${({ $hasErrors }) =>
        $hasErrors &&
        css`
            color: ${COLORS.red};
        `}

    @media (max-width: ${BREAKPOINTS.laptop}px) {
        font-size: min(72px, 15vw);
        line-height: min(72px, 15vw);
        margin-bottom: 0;
    }
`;

export const SidebarButtons = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: ${BREAKPOINTS.laptop}px) {
        flex-direction: row;
        transform: translateX(max(-16px, -3vw));
    }
`;

export const SideLabel = styled.div`
    font-size: min(18px, 5vw);
    line-height: min(18px, 5vw);
    align-self: center;

    @media (max-width: ${BREAKPOINTS.laptop}px) {
        position: absolute;
        right: 10vw;
    }
`;

const BottomFleur = styled.div`
    background: transparent center/contain scroll no-repeat;
    background-image: url(${HR2});
    width: 80vw;
    height: 2.5rem;
    bottom: -1rem;

    position: absolute;
`;

const MobileContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 10vw;
`;

interface SideBarProps<Game extends GameKey> {
    game: Game;
    visible: boolean;
    hasErrors: boolean;
}

function SideBar<Game extends GameKey>({
    game,
    visible,
    children,
    hasErrors,
}: PropsWithChildren<SideBarProps<Game>>) {
    const useStore = useChecklistStore[game] as unknown as ChecklistStore<Game>; // :sob:
    const percent = useStore(state => state.percent);
    const reset = useStore(state => state.reset);
    const checkAll = useStore(state => state.checkAll);

    const isTablet = useBreakpoint(BREAKPOINTS.laptop);

    if (isTablet) {
        return (
            <Container $visible={visible}>
                <MobileContainerBackdropBlur>
                    <MobileContainer>
                        <FlexBox $direction='column' $gap='16px'>
                            <SidePercentLabel $hasErrors={hasErrors}>
                                {percent}%
                            </SidePercentLabel>
                            <SidebarButtons>
                                <Button
                                    size='small'
                                    label='uncheck all'
                                    onClick={reset}
                                />
                                <Button
                                    size='small'
                                    label='check all'
                                    onClick={checkAll}
                                />
                            </SidebarButtons>
                        </FlexBox>
                        <SideLabel>{children}</SideLabel>
                    </MobileContainer>
                </MobileContainerBackdropBlur>
                <BottomFleur />
            </Container>
        );
    }

    return (
        <Container $visible={visible}>
            <FlexBox $direction='column' $align='flex-end'>
                <SidePercentLabel $hasErrors={hasErrors}>
                    {percent}%
                </SidePercentLabel>
                <SidebarButtons>
                    <Button size='small' label='uncheck all' onClick={reset} />
                    <Button size='small' label='check all' onClick={checkAll} />
                </SidebarButtons>
                <SideLabel>{children}</SideLabel>
            </FlexBox>
        </Container>
    );
}

export default SideBar;
