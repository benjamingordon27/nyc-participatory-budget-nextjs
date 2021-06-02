import React, {useContext} from 'react';
import classes from './NavigationBar.module.css';
import Link from 'next/link';
import SidebarContext from '../../store/dataContext/sidebarContext';
import DistrictsDataContext from '../../store/dataContext/dataContext';
import {uniqueValueBudget, uniqueValueCouncilMember} from '../../util/utility';
import * as actions from '../../store/actions/actionTypes';
import Controls from '../../containers/Controls/Controls';
import HoverDropdown from '../../components/HoverDropdown/HoverDropdown';

const navigationBar = (props) => {
    const sidebarContext = useContext(SidebarContext);
    const districtsDataContext = useContext(DistrictsDataContext);

    console.log('navigation',districtsDataContext);

    return(
        <header className={classes.NavigationBar}>
            <nav>
                <ul>             
                    <li onClick={() => {
                        sidebarContext.dispatchSidebarData({type: actions.CLEAR_CLICKED_DISTRICT_REDUCER});
                        sidebarContext.dispatchSidebarData({type: actions.CLEAR_CLICKED_ITEM_REDUCER});
                    }}><Link href='/'>About</Link> | </li>                    
                    <li><Link href='/budget-item-tracker'>Budget Item Tracker</Link></li>                                        
                        {/* {districtsDataContext.participatoryBudgetTracker ? 
                            <li>
                                <HoverDropdown 
                                    id = {'agencyHoverDropdown'}
                                    title = 'Agency' 
                                    list={uniqueValueBudget(districtsDataContext.participatoryBudgetTracker.features, 'agency')}
                                    clicked={(event) => {console.log(event.target.innerHTML); changeAgencyControls(event.target.innerHTML)}}
                                />
                            </li>
                        : <li>Agency |</li>}                         */}
                    <li>Project Status | </li>
                    <li>Category | </li>
                    <li>Year | </li>
                    <li>Current Council Member</li>
                </ul>
            </nav>
        </header>  
    );
}

export default navigationBar;