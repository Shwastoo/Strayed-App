import React from 'react';
import {LargePageHeading} from './styled/PageHeading';

export function Heading(props) {
    return (
        <LargePageHeading variant={props.variant}>
            {props.title}
        </LargePageHeading>
    );
}