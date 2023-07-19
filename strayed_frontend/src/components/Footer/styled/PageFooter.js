import styled from 'styled-components';

export const PageFooter = styled.p`
    background-color: ${props => props.variant === 'secondary' ? '#EFDBCE' : '#282c34'};
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    font-weight: lighter;
    font-family: 'Century Gothic';
    color: #175C4C;
    padding: 10px;
`;
