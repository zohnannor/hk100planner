import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

import renderLink from '../../util/renderLink';

export const FTextWrapper = styled.span`
    & a {
        color: white;
        text-decoration: underline;
        text-decoration-style: dotted;
        text-decoration-thickness: 1px;
        text-decoration-skip-ink: auto;
        text-underline-offset: 3px;
    }
`;

export const FText: React.FC<PropsWithChildren> = ({ children }) => {
    const textParts = renderLink((children || '').toString());

    return (
        <FTextWrapper>
            {textParts.map(part => {
                if (part.type === 'link') {
                    return (
                        <a href={part.link} target='_blank'>
                            {part.val}
                        </a>
                    );
                }
                return part.val;
            })}
        </FTextWrapper>
    );
};
