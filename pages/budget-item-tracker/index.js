import {useRouter} from 'next/router';
import React, {useContext, useState, useEffect} from 'react';
import BudgetItemTrackerList from '../../containers/BudgetItemTrackerList/BudgetItemTrackerList';
import DistrictDataContext from '../../store/dataContext/dataContext';
import Spinner from '../../components/Spinner/Spinner';
import SearchField from '../../components/SearchField/SearchField'
import Controls from '../../containers/Controls/Controls';

const BudgetItemTrackerPage = () => {

    const router = useRouter();    

    const districtsDataContext = useContext(DistrictDataContext);            

    const [trackerList, setTrackerList] = useState([]);
    
    useEffect(() => {
        if(districtsDataContext.participatoryBudgetTracker){
            setTrackerList(districtsDataContext.participatoryBudgetTracker.features);
        }
    }, [districtsDataContext.dataLoaded])
    
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

