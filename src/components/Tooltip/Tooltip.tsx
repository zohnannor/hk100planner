import { PropsWithChildren } from 'react';
import styled from 'styled-components';

import DialogBox from '../DialogBox';
import { FText } from '../FText/FText';

interface TooltipProps {}

const Shadow = styled.div`
    display: flex;
    height: 300px;
    width: 1000px;
    background: rgba(0, 0, 0, 0.6);
    box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.6);
    font-size: 24px;
    padding: 12px 60px;
    max-width: 1000px;
    justify-content: center;

    & > div > div {
        padding-top: 16px;
    }
`;

export const Tooltip: React.FC<PropsWithChildren<TooltipProps>> = ({
    children,
}) => {
    return (
        <Shadow>
            <DialogBox>
                <FText>{children}</FText>
            </DialogBox>
        </Shadow>
    );
};
