import React from 'react';
import {numberFormatter} from '../../util/numberFormatting';

const BudgetItemTracker = (props) => {
    return (
        <div>
            <ul>
                <li>Project: {props.properties.project}</li>
                <li>Description: {props.properties.description}</li>
                <li>Vote Year: {props.properties.vote_year}</li>
                <li>Status Summary: {props.properties.status_summary}</li>
                <li>Ballot Price: ${numberFormatter(props.properties.ballot_price)}</li>                
                {props.properties.subproject_cost ? <li>Subproject Cost: ${numberFormatter(props.properties.subproject_cost)}</li> : null}
                <li>Total Appropriated: ${numberFormatter(props.properties.total_appropriated)}</li>
                <li>Agency: {props.properties.agency}</li>
            </ul>
        </div>
    );
}

export default BudgetItemTracker;