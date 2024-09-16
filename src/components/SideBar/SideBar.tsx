import { PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';

import { COLORS } from '../../constants';
import useChecklistStore from '../../stores/checklistStore';
import { FlexBox, HasErrors } from '../../styles';
import Button from '../Button';

interface ContainerProps {
    $visible: boolean;
}

const Container = styled.div<ContainerProps>`
    transition: 0.3s;
    display: flex;
    align-items: center;
    flex-direction: column;
    position: fixed;
    right: 64px;
    top: 24px;
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    ${({ $visible }) =>
        !$visible &&
        css`
            pointer-events: none;
        `}
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
`;

export const SideLabel = styled.div`
    font-size: 18px;
    line-height: 18px;
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

    return (
        <Container $visible={visible}>
            <FlexBox $direction='column' $align='flex-end'>
                <SidePercentLabel $hasErrors={hasErrors}>
                    {percent}%
                </SidePercentLabel>

                <Button size='small' label='uncheck all' onClick={reset} />
                <Button size='small' label='check all' onClick={checkAll} />

                <SideLabel>{children}</SideLabel>
            </FlexBox>
        </Container>
    );
};
