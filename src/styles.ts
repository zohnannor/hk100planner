import styled from 'styled-components';

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
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
