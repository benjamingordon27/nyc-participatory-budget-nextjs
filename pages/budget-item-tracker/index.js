import {useRouter} from 'next/router';
import React, {useContext, useState, useEffect} from 'react';
import BudgetItemTrackerList from '../../containers/BudgetItemTrackerList/BudgetItemTrackerList';
import DistrictDataContext from '../../store/dataContext/dataContext';
import ControlsContext from '../../store/dataContext/controlsContext';
import Spinner from '../../components/Spinner/Spinner';
import SearchField from '../../components/SearchField/SearchField'
import Controls from '../../containers/Controls/Controls';

const BudgetItemTrackerPage = () => {

    const router = useRouter();    

    const districtsDataContext = useContext(DistrictDataContext);            
    const controlsContext = useContext(ControlsContext);      

    const [trackerList, setTrackerList] = useState([]);
    
    useEffect(() => {
        if(districtsDataContext.participatoryBudgetTracker){
            setTrackerList(districtsDataContext.participatoryBudgetTracker.features);
        }
    }, [districtsDataContext.dataLoaded]);

    useEffect(() => {
        if(districtsDataContext.dataLoaded){
            console.log("controlsContext has changed", controlsContext);            
            var outputList = districtsDataContext.participatoryBudgetTracker.features;
            if(controlsContext.year !== ''){
                outputList = outputList.filter(item => item.properties.vote_year === controlsContext.year);
            }
            if(controlsContext.category !== ''){
                outputList = outputList.filter(item => item.properties.pinCategory === controlsContext.category);
            }
            if(controlsContext.status !== ''){
                outputList = outputList.filter(item => item.properties.status_summary === controlsContext.status);
            }
            if(controlsContext.agency !== ''){
                outputList = outputList.filter(item => item.properties.agency === controlsContext.agency);
            }
            if(controlsContext.districtsDataContext !== ''){
                outputList = outputList.filter(item => item.properties.district === controlsContext.district.split(':')[0]);
            }
            setTrackerList(outputList);
        }
    }, [districtsDataContext.dataLoaded, controlsContext])
    
    const onChange = (event) => {
        if(districtsDataContext.participatoryBudgetTracker){
            // console.log('event', event)
            setTrackerList(districtsDataContext.participatoryBudgetTracker.features.filter(item => {
                return (
                    JSON.stringify(item.properties).toLowerCase().includes(event.toLowerCase())
                );
            }));
            console.log(trackerList);
            router.push(router.route + '?query='+event.toLowerCase())
        }
    };

    return (
        <div>            
            <h2 style={{padding: '12px'}}>Search for individual items below</h2>
            <div>
                <Controls />
            </div>
            {districtsDataContext.dataLoaded ? 
                <React.Fragment>
                    <SearchField placeholder='Search item' onChange={(event) => onChange(event.target.value)}/>
                    {/* <Controls style={{position: 'absolute'}} /> <br/><br/> */}
                    <BudgetItemTrackerList list={trackerList}/> 
                </React.Fragment>
            : <Spinner />}
        </div>
    );
};

export default BudgetItemTrackerPage;

