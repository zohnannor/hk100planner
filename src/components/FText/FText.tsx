import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

import renderLink from '../../util/renderLink';

export const FTextWrapper = styled.span`
    white-space: pre-line;

    & a {
        color: white;
        text-decoration: underline;
        text-decoration-style: dotted;
        text-decoration-thickness: 1px;
        text-decoration-skip-ink: auto;
        text-underline-offset: 3px;
    }
`;

const IconWrapper = styled.img`
    width: 22px;
    height: 22px;
    object-fit: contain;
`;

export const FText: React.FC<PropsWithChildren> = ({ children }) => {
    const textParts = renderLink(
        (Array.isArray(children)
            ? children.join(' ')
            : children || ''
        ).toString()
    );

    return (
        <FTextWrapper>
            {textParts.map((part, n) =>
                part.type === 'link' ? (
                    <a
                        href={part.link}
                        title={part.link}
                        target='_blank'
                        key={n}
                    >
                        {part.val}
                    </a>
                ) : part.type === 'icon' ? (
                    <a
                        href={part.link}
                        title={part.link}
                        target='_blank'
                        key={n}
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
