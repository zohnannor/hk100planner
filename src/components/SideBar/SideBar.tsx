import { PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';

import { HR } from '../../assets';
import { BREAKPOINTS, COLORS } from '../../constants';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import useChecklistStore from '../../stores/checklistStore';
import { FlexBox, HasErrors } from '../../styles';
import Button from '../Button';

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
        left: 0;
        right: 0;
        width: 100vw;
        backdrop-filter: blur(10px);
        padding: 24px 0;
        justify-content: center;
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
    background-image: url(${HR});
    transform: rotateZ(180deg);
    width: 80vw !important;
    height: 2.5rem;
    bottom: -1.2rem;

    position: absolute;
`;

const MobileContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 10vw;
`;

interface SideBarProps {
    visible: boolean;
    hasErrors: boolean;
}

export const SideBar: React.FC<PropsWithChildren<SideBarProps>> = ({
    visible,
    children,
    hasErrors,
}) => {
    const percent = useChecklistStore(state => state.percent);
    const reset = useChecklistStore(state => state.reset);
    const checkAll = useChecklistStore(state => state.checkAll);

    const isTablet = useBreakpoint(BREAKPOINTS.laptop);

    if (isTablet) {
        return (
            <Container $visible={visible}>
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
};
