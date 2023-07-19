import styled from 'styled-components';

export const PageHeading = styled.h1`
    background-color: ${props => props.variant === 'secondary' ? '#EFDBCE' : '#282c34'};
    min-height: 10vh;
    display: flex;
    position: fixed;
    bottom: 50;
    left: 0;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    font-weight: bold;
    font-family: 'Century Gothic';
    color: #175C4C;
`;

export const LargePageHeading = styled(PageHeading)`
    font-size: 40px;
`;