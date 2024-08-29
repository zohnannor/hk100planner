import styled from 'styled-components';

import useChecklistStore from '../../stores/checklistStore';
import { FlexBox } from '../../styles';
import { FText } from '../FText/FText';
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
        simpleKeyRoyalWaterwaysReq,
        simpleKeyGodseekerCocoonReq,
        elegantKeyReq,
        loveKeyReq,
        shopkeepersKeyReq,
        reset,
        checkAll,
    } = useChecklistStore();
    useChecklistStore();

    return (
        <Container $visible={visible}>
            <FlexBox direction='column' align='flex-end'>
                <SidePercentLabel>
                    <FText>{percent.toFixed(2).replace('-0', '0')}%</FText>
                </SidePercentLabel>

                <Button size='small' label='uncheck all' onClick={reset} />
                <Button size='small' label='check all' onClick={checkAll} />

                <SideLabel>
                    <FlexBox direction='column'>
                        <FText>
                            [GEO] {geo} / {geoReq}
                        </FText>
                        <FText>
                            [ESSENCE] {essence} / {Math.max(...essenceReq)}
                        </FText>
                        <FText>
                            [PALE_ORE] {paleOre} / {paleOreReq}
                        </FText>

                        <FText>
                            [SIMPLE_KEY]
                            {+simpleKeyRoyalWaterwaysReq +
                                +simpleKeyGodseekerCocoonReq}
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
