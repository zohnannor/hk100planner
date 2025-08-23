import { PropsWithChildren } from 'react';
import styled from 'styled-components';

import { BOTTOM, TOP } from '../../assets';
import { FlexBox } from '../../styles';

const TopFleur = styled.div`
    background: transparent center/contain scroll no-repeat;
    background-image: url(${TOP});
    width: min(36rem, 90vw);
    height: min(4.475rem, 13vw);
    top: max(-3.6rem, -12vw);

    position: absolute;
`;

const BottomFleur = styled.div`
    background: transparent center/contain scroll no-repeat;
    background-image: url(${BOTTOM});
    width: min(18rem, 45vw);
    height: min(3.375rem, 10.125vw);
    bottom: max(-2.8rem, -9vw);

    position: absolute;
`;

export const DialogBox: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <FlexBox
            $direction='column'
            $align='center'
            $justify='space-between'
            $position='relative'
        >
            <TopFleur />
            <FlexBox $direction='row'>{children}</FlexBox>
            <BottomFleur />
        </FlexBox>
    );
};
