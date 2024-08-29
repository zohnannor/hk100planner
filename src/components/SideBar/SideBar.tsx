import styled from 'styled-components';

import useChecklistStore from '../../checklist_store';
import { FlexBox } from '../../styles';
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

export const SideBar: React.FC<SideBarProps> = ({ visible }) => {
    const {
        percent,
        geo,
        essence,
        paleOre,
        geoReq,
        essenceReq,
        paleOreReq,
        simpleKeys,
        simpleKeysReq,
        elegantKeyReq,
        loveKeyReq,
        shopkeepersKeyReq,
    } = useChecklistStore();
    useChecklistStore();

    return (
        <Container $visible={visible}>
            <FlexBox direction='column' align='flex-end'>
                <SidePercentLabel>
                    <FText>{percent.toFixed(2).replace('-0', '0')}%</FText>
                </SidePercentLabel>
                <SideLabel>
                    <FlexBox direction='column'>
                        <FText>
                            [GEO] {geo} / {geoReq}
                        </FText>
                        <FText>
                            [ESSENCE] {essence} / {essenceReq}
                        </FText>
                        <FText>
                            [PALE_ORE] {paleOre} / {paleOreReq}
                        </FText>
                        <FText>
                            [PALE_ORE] {paleOre} / {paleOreReq}
                        </FText>

                        <FText>
                            [SIMPLE_KEY] {simpleKeys} / {simpleKeysReq}
                        </FText>
                        <FText>[ELEGANT_KEY] {elegantKeyReq}</FText>
                        <FText>[LOVE_KEY] {loveKeyReq}</FText>
                        <FText>[SHOPKEEPER'S_KEY] {shopkeepersKeyReq}</FText>
                    </FlexBox>
                </SideLabel>
            </FlexBox>
        </Container>
    );
};
