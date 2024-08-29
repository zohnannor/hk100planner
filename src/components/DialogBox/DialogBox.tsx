import { PropsWithChildren } from 'react';
import styled from 'styled-components';

import { BOTTOM, TOP } from '../../assets';
import { FlexBox } from '../../styles';

const TopFleur = styled.div`
    background: transparent center/contain scroll no-repeat;
    background-image: url(${TOP});
    width: 36rem;
    height: 4.475rem;
    top: -3.6rem;

    position: absolute;
`;

const BottomFleur = styled.div`
    background: transparent center/contain scroll no-repeat;
    background-image: url(${BOTTOM});
    width: 18rem;
    height: 3.375rem;
    bottom: -2.8rem;

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
