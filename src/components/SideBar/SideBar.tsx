import styled from 'styled-components';

import useChecklistStore from '../../checklist_store';
import { FlexBox } from '../../styles';

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

export const SideBar: React.FC<SideBarProps> = ({ visible }) => {
    const { percent, geo, essence, paleOre, geoReq, essenceReq, paleOreReq } =
        useChecklistStore();

    return (
        <Container $visible={visible}>
            <FlexBox direction='column' align='flex-end'>
                <SidePercentLabel>
                    {percent.toFixed(2).replace('-0', '0')}%
                </SidePercentLabel>
                <SideLabel>geo: {geo}</SideLabel>
                <SideLabel>essence: {essence}</SideLabel>
                <SideLabel>pale ore: {paleOre}</SideLabel>
                <SideLabel>geo requirement: {geoReq}</SideLabel>
                <SideLabel>essence requirement: {essenceReq}</SideLabel>
                <SideLabel>pale ore requirement: {paleOreReq}</SideLabel>
            </FlexBox>
        </Container>
    );
};
