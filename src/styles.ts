import styled from 'styled-components';

import type { Property } from 'csstype';

export const MainWrapper = styled.div`
    margin-bottom: 100px;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`;

export const MainContent = styled.div`
    margin-top: 100px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: start;
    gap: 50px;
`;

export const MainLabel = styled.span`
    transition: 0.2s;
    font-size: 32px;
    line-height: 34px;
`;

export const PercentLabel = styled.span`
    transition: 0.2s;
    font-size: 100px;
    line-height: 114px;
`;

export const SectionsColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 48px;
`;

type FlexBoxProps = {
    align?: Property.AlignItems;
    justify?: Property.JustifyContent;
    direction?: Property.FlexDirection;
    gap?: Property.Gap;
    wrap?: Property.FlexWrap;
    fullWidth?: boolean;
    position?: Property.Position;
};

export const FlexBox = styled.div<FlexBoxProps>`
    display: flex;
    position: ${({ position }) => position};
    width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
    align-items: ${({ align }) => align};
    justify-content: ${({ justify }) => justify};
    flex-direction: ${({ direction }) => direction};
    gap: ${({ gap }) => gap};
    flex-wrap: ${({ wrap }) => wrap};
`;
