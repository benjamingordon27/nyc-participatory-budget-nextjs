import React from 'react';
import {numberFormatter} from '../../util/numberFormatting';

const clickedItem = (props) => {
    return (
        <div>
                <b>Title:</b> {props.Title}<br/>
                <b>Description:</b> {props.Description}<br/>
                <b>Category:</b> {props.Category}<br/>
                <b>Vote Year:</b> {props['Vote Year']}<br/>
                <b>Votes:</b> {props.Votes}<br/>
                <b>Cost:</b> ${numberFormatter(props.Cost)}<br/>            
        </div>
    );
}

export default clickedItem;