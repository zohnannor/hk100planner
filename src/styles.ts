import styled, { css } from 'styled-components';

import { BREAKPOINTS, COLORS } from './constants';

import type { Property } from 'csstype';

export const MainWrapper = styled.div`
    margin-bottom: 100px;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    @media (max-width: ${BREAKPOINTS.laptop}px) {
        > img {
            max-width: 90vw;
        }
    }
`;

export const MainContent = styled.div`
    margin-top: min(100px, 10vw);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: start;
    column-gap: 50px;

    @media (max-width: ${BREAKPOINTS.columns}px) {
        grid-template-columns: 1fr;
    }
`;

export const MainLabel = styled.span`
    transition: 0.2s;
    font-size: min(32px, 4.7vw);
    line-height: min(34px, 4.7vw);
`;

export type HasErrors = {
    $hasErrors: boolean;
};

export const PercentLabel = styled.span<HasErrors>`
    transition: 0.2s;
    font-size: min(100px, 20vw);
    line-height: min(114px, 22vw);
    margin-bottom: 20px;

    ${({ $hasErrors }) =>
        $hasErrors &&
        css`
            color: ${COLORS.red};
        `}
`;

type InfoContainerProps = {
    $tabletAlign?: Property.AlignItems;
};

export const InfoContainter = styled.div<InfoContainerProps>`
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: ${BREAKPOINTS.laptop}px) {
        align-items: ${({ $tabletAlign }) => $tabletAlign};
    }
`;

export const SectionsColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: min(48px, 8vw);
`;

type FlexBoxProps = {
    $align?: Property.AlignItems;
    $justify?: Property.JustifyContent;
    $direction?: Property.FlexDirection;
    $gap?: Property.Gap;
    $wrap?: Property.FlexWrap;
    $fullWidth?: boolean;
    $position?: Property.Position;
    $margin?: Property.Margin;
};

export const FlexBox = styled.div<FlexBoxProps>`
    display: flex;
    position: ${({ $position }) => $position};
    width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
    align-items: ${({ $align }) => $align};
    justify-content: ${({ $justify }) => $justify};
    flex-direction: ${({ $direction }) => $direction};
    gap: ${({ $gap }) => $gap};
    flex-wrap: ${({ $wrap }) => $wrap};
    margin: ${({ $margin }) => $margin};
`;
