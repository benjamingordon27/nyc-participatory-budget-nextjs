import React, {useContext, useCallback} from 'react';
import {useRouter} from 'next/router';
import classes from './NavigationBar.module.css';
import Link from 'next/link';
import SidebarContext from '../../store/dataContext/sidebarContext';
import DistrictsDataContext from '../../store/dataContext/dataContext';
import {uniqueValueBudget, uniqueValueCouncilMember} from '../../util/utility';
import * as actions from '../../store/actions/actionTypes';
import Controls from '../../containers/Controls/Controls';
import ControlsContext from '../../store/dataContext/controlsContext';
import HoverDropdown from '../../components/HoverDropdown/HoverDropdown';

const navigationBar = (props) => {    
    const router = useRouter();     

    const districtsDataContext = useContext(DistrictsDataContext);
    const controlsContext = useContext(ControlsContext);

    const changeAgencyControls = useCallback( (agency) => {        
        document.getElementById('agencyDropdown').value = agency;
        controlsContext.dispatchControls({type: actions.UPDATE_AGENCY, agency: agency});
        router.replace(
            {
              pathname: router.pathname,
              query:  {
                ...router.query, // list all the queries here
                agency: agency // override the color property
              },
            },
            undefined,
            {
              shallow: true,
            },
          );
    },[controlsContext.agency, router]);

    const changeStatusControls = useCallback( (status) => {
        document.getElementById('statusDropdown').value = status;
        controlsContext.dispatchControls({type: actions.UPDATE_STATUS, status: status});        
        router.replace(
            {
              pathname: router.pathname,
              query:  {
                ...router.query, // list all the queries here
                status: status // override the color property
              },
            },
            undefined,
            {
              shallow: true,
            },
          );
    },[controlsContext.agency, router]);    

    const changeCategoryControls = useCallback( (category) => {
        document.getElementById('categoryDropdown').value = category;
        controlsContext.dispatchControls({type: actions.UPDATE_CATEGORY, category: category});
        router.replace(
            {
              pathname: router.pathname,
              query:  {
                ...router.query, // list all the queries here
                category: category // override the color property
              },
            },
            undefined,
            {
              shallow: true,
            },
          );
    },[controlsContext.agency, router]);    

    const changeYearControls = useCallback( (year) => {
        document.getElementById('yearDropdown').value = year;
        controlsContext.dispatchControls({type: actions.UPDATE_YEAR, year: year});
        router.replace(
            {
              pathname: router.pathname,
              query:  {
                ...router.query, // list all the queries here
                year: year // override the color property
              },
            },
            undefined,
            {
              shallow: true,
            },
          );
    },[controlsContext.agency, router]);

    const changeDistrictControls = useCallback( (district) => {
        document.getElementById('districtDropdown').value = district;
        controlsContext.dispatchControls({type: actions.UPDATE_DISTRICT, district: district});
        router.replace(
            {
              pathname: router.pathname,
              query:  {
                ...router.query, // list all the queries here
                district: district // override the color property
              },
            },
            undefined,
            {
              shallow: true,
            },
          );
    },[controlsContext.agency, router]);

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
                    {districtsDataContext.participatoryBudgetTracker ? 
                        <li>
                            <HoverDropdown 
                                id = {'agencyHoverDropdown'}
                                title = 'Agency |' 
                                list={uniqueValueBudget(districtsDataContext.participatoryBudgetTracker.features, 'agency')}
                                clicked={(event) => {console.log(event.target.innerHTML); changeAgencyControls(event.target.innerHTML)}}
                            />
                         </li>
                    : <li>Agency |</li>}  
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