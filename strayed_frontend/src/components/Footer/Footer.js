import React from 'react';
import {PageFooter} from './styled/PageFooter';

export function Footer(props) {
    return (
        <PageFooter variant={props.variant}>
            {props.title}
        </PageFooter>
    );
}