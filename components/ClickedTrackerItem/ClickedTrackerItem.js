import React from 'react';
import {numberFormatter} from '../../util/numberFormatting';

const clickedTrackerItem = (props) => {
    return (
        <div>
                <h2 style={{textAlign: 'center'}}>{props.project}</h2>
                <h3 style={{textAlign: 'center'}}>{props.status_summary}</h3>
                {props.description !== '' ? <div><b>Description:</b> {props.description}<br/></div> : null}
                <b>Category:</b> {props.pinCategory}<br/>
                <b>Agency:</b> {props.agency}<br/>
                <b>Vote Year:</b> {props.vote_year}<br/>                
                <b>Cost:</b> ${numberFormatter(props.ballot_price)}<br/>
        </div>
    );
}

export default clickedTrackerItem;