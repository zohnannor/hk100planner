import { PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';
import { useIntersectionObserver } from 'usehooks-ts';

interface ContainerProps {
    $visible: boolean;
}

const Container = styled.div<ContainerProps>`
    transition: 0.3s;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 20px;
    position: sticky;

    ${({ $visible }) =>
        !$visible &&
        css`
            top: 0px;
            transform: translate(calc(50vw - 50%));
        `}
`;

export const SideBar: React.FC<PropsWithChildren> = ({ children }) => {
    const { isIntersecting: visible, ref } = useIntersectionObserver();

    return (
        <>
            <div ref={ref} />
            <Container $visible={visible}>{children}</Container>
        </>
    );
};
