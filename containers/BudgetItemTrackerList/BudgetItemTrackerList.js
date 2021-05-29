import React from 'react';
import BudgetItemTracker from '../../components/BudgetItemTracker/BudgetItemTracker';

const BudgetItemTrackerList = (props) => {    
    
    let outputList = props.list.map((item,idx )=> {        
        return (
            <BudgetItemTracker key={idx} {...item}/>
        );
    })
    
    return (
        <div>
            {outputList}
        </div>
    );
}

export default BudgetItemTrackerList;