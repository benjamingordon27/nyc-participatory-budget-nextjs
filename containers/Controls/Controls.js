import {useRouter} from 'next/router';
import React, {useContext, useCallback} from 'react';
import Dropdown from '../../components/Dropdown/Dropdown';
import ControlsContext from '../../store/dataContext/controlsContext';
import DistrictsDataContext from '../../store/dataContext/dataContext';
import {uniqueValueBudget, uniqueValueCouncilMember} from '../../util/utility';
import * as actions from '../../store/actions/actionTypes';
import HoverDropdown from '../../components/HoverDropdown/HoverDropdown';

let Controls = (props) => {

    const router = useRouter();     

    const controlsContext = useContext(ControlsContext);
    const districtsDataContext = useContext(DistrictsDataContext);

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

    return (
        <div className="controls" style={{...props.propsStyle, left: '0'}}>
          <div style = {{float: 'left', margin: '6px'}}>
                {districtsDataContext.participatoryBudgetTracker ? 
                    <HoverDropdown 
                        id = {'agencyHoverDropdown'}
                        title = 'Agency' 
                        list={uniqueValueBudget(districtsDataContext.participatoryBudgetTracker.features, 'agency')}
                        clicked={(event) => {console.log(event.target.innerHTML); changeAgencyControls(event.target.innerHTML)}}
                    />
                : null}    
            </div>
            <div style = {{float: 'left', margin: '6px'}}>
                {districtsDataContext.participatoryBudgetTracker ? 
                    <Dropdown 
                        id = {'agencyDropdown'}
                        title = 'Agency' 
                        list={uniqueValueBudget(districtsDataContext.participatoryBudgetTracker.features, 'agency')}
                        handleChange={(event) => changeAgencyControls(event.target.value)}
                    />
                : null}    
            </div>
            <div style = {{float: 'left', margin: '6px'}}>
                {districtsDataContext.participatoryBudgetTracker ? 
                    <Dropdown 
                        id = {'statusDropdown'}
                        title = 'Project Status' 
                        list={uniqueValueBudget(districtsDataContext.participatoryBudgetTracker.features, 'status_summary')}
                        handleChange={(event) => changeStatusControls(event.target.value)}
                    />
                : null}    
            </div>
            <div style = {{float: 'left', margin: '6px'}}>
                {districtsDataContext.participatoryBudgetTracker ? 
                    <Dropdown 
                        id = {'categoryDropdown'}
                        title = 'Category' 
                        list={uniqueValueBudget(districtsDataContext.participatoryBudgetTracker.features, 'pinCategory')}
                        handleChange={(event) => changeCategoryControls(event.target.value)}
                    />
                : null}    
            </div>
            <div style = {{float: 'left', margin: '6px'}}>
                {districtsDataContext.participatoryBudgetTracker ? 
                    <Dropdown 
                        id = {'yearDropdown'}
                        title = 'Year' 
                        list={uniqueValueBudget(districtsDataContext.participatoryBudgetTracker.features, 'vote_year')}
                        handleChange={(event) => changeYearControls(event.target.value)}
                    />
                : null}
            </div>
            <div style = {{float: 'left', margin: '6px'}}>
                {districtsDataContext.participatoryBudgetTracker ? 
                    <Dropdown                             
                        id = {'districtDropdown'}
                        title = 'Current Council Member' 
                        list={uniqueValueCouncilMember(districtsDataContext.councilMembers)}
                        handleChange={(event) => changeDistrictControls(event.target.value)}
                    /> 
                : null}
            </div>     
        </div>

    );
}

export default Controls;