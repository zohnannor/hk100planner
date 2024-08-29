import { PropsWithChildren } from 'react';
import styled from 'styled-components';

import useChecklistStore from '../../stores/checklistStore';
import { FlexBox } from '../../styles';
import Button from '../Button';
import { FText } from '../FText/FText';

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
`;

export const SidePercentLabel = styled.div`
    font-size: 52px;
    line-height: 52px;
    margin-bottom: 12px;
`;

export const SideLabel = styled.div`
    font-size: 18px;
    line-height: 18px;
`;

interface SideBarProps {
    visible: boolean;
}

export const SideBar: React.FC<PropsWithChildren<SideBarProps>> = ({
    visible,
    children,
}) => {
    const percent = useChecklistStore(state => state.percent);
    const reset = useChecklistStore(state => state.reset);
    const checkAll = useChecklistStore(state => state.checkAll);

    return (
        <Container $visible={visible}>
            <FlexBox $direction='column' $align='flex-end'>
                <SidePercentLabel>
                    <FText>{percent.toFixed(2).replace('-0', '0')}%</FText>
                </SidePercentLabel>

                <Button size='small' label='uncheck all' onClick={reset} />
                <Button size='small' label='check all' onClick={checkAll} />

                <SideLabel>{children}</SideLabel>
            </FlexBox>
        </Container>
    );
};
