import React from 'react';
import {PageLogo} from './styled/PageLogo';
import icon from "./icon.png";

export function Logo(props) {
    return (
        <PageLogo variant={props.variant}>
            <img src={icon} alt="logo" style={{height:200, width:200}}></img>
        </PageLogo>
    );
}