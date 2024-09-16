import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

import renderLink from '../../util/renderLink';

import type { Property } from 'csstype';

type FTextWrapperProps = {
    $color?: Property.Color;
};

export const FTextWrapper = styled.span<FTextWrapperProps>`
    display: inline-flex;
    flex-wrap: wrap;
    column-gap: 4px;
    white-space: pre-line;
    text-wrap: pretty;
    text-wrap: stable;
    color: ${({ $color }) => $color || 'inherit'};

    & a {
        color: ${({ $color }) => $color || 'inherit'};
        text-decoration: underline;
        text-decoration-style: dotted;
        text-decoration-thickness: 1px;
        text-decoration-skip-ink: auto;
        text-underline-offset: 3px;
    }
`;

const IconWrapper = styled.img`
    width: 22px;
    aspect-ratio: 1;
    object-fit: contain;
`;

interface FTextProps {
    color?: string;
}

export const FText: React.FC<PropsWithChildren<FTextProps>> = ({
    children,
    color,
}) => {
    const textParts = renderLink(
        (Array.isArray(children)
            ? children.join(' ')
            : children || ''
        ).toString()
    );

    return (
        <FTextWrapper $color={color}>
            {textParts.map((part, n) =>
                part.type === 'link' ? (
                    <a
                        href={part.link}
                        title={part.link}
                        target='_blank'
                        key={n}
                        onClick={e => e.stopPropagation()}
                    >
                        {part.val}
                    </a>
                ) : part.type === 'icon' ? (
                    <a
                        href={part.link}
                        title={part.link}
                        target='_blank'
                        key={n}
                        onClick={e => e.stopPropagation()}
                    >
                        <IconWrapper src={part.val} alt={part.link} />
                    </a>
                ) : (
                    part.val
                )
            )}
        </FTextWrapper>
    );
};
