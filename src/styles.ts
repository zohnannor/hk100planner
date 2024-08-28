import styled from 'styled-components';

import type { Property } from 'csstype';

export const MainWrapper = styled.div`
    margin: 100px;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`;

export const MainTitle = styled.h1`
    font-size: 40px;
    line-height: 56px;
    margin: 0;
    margin-top: 100px;
    font-weight: bold;
    color: white;
    font-family: 'Cinzel', sans-serif;
    text-shadow: 0px 0px 20px rgba(0, 0, 0, 0.6);
    text-align: center;
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
    font-size: 22px;
    line-height: 24px;
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

export const FlexBox = styled.div<{
    align?: Property.AlignItems;
    justify?: Property.JustifyContent;
    direction?: Property.FlexDirection;
    gap?: Property.Gap;
    wrap?: Property.FlexWrap;
    fullWidth?: boolean;
}>`
    display: flex;
    width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
    align-items: ${({ align }) => align};
    justify-content: ${({ justify }) => justify};
    flex-direction: ${({ direction }) => direction};
    gap: ${({ gap }) => gap};
    flex-wrap: ${({ wrap }) => wrap};
`;
