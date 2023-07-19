import styled from 'styled-components';

export const PageLogo = styled.image`
    align-items: center;
    background-color: ${props => props.variant === 'secondary' ? '#EFDBCE' : '#282c34'};
    position: fixed;
    left: 0;
    width: 100%;
`;