import React, {useReducer, useEffect} from 'react';
import * as actions from '../actions/actionTypes';
import {districtsDataReducer} from '../reducers/reducers';
import {nyOpenDataAxios,googleCivicAxios} from '../../axios-order';
import {translateCategoryText, translateAgencyToCategoryText} from '../../util/translateCategory';
import csv2geojson from 'csv2geojson';
import * as getRequests from '../../store/actions/getRequests';
import {inside, polygon,multiPolygon, point, distance, centroid} from '@turf/turf';

const DistrictDataContext = React.createContext();

export const DistrictsDataContextProvider = (props) => {

    const [districtsData, dispatchDistrictsData] = useReducer(districtsDataReducer, {
        loading: false,
        councilMembersReadyToLoad: false,
        participatoryBudgetReadyToLoad: false,
        councilMembers: null,
        districts: null,
        error: null,
        dataLoaded: false,
        memoDistrictsData: {}
    });

    //use effect for fetching the data
    useEffect( () => {
        //Fetch the districts
        dispatchDistrictsData({type: actions.START_DATA});
        nyOpenDataAxios.get(getRequests.cityCouncilDistricts)
        .then(response => dispatchDistrictsData({type: actions.SUCCESS_DISTRICTS , districts: response.data, loading: false }))
        .catch(error => dispatchDistrictsData({type: actions.FAIL_DATA , error: error }))           
    }, [])

    useEffect( () => {
        if(districtsData.councilMembersReadyToLoad){        
            //Fetch the council members
            dispatchDistrictsData({type: actions.START_DATA});
            nyOpenDataAxios.get(getRequests.cityCouncilMembers)
            .then(response => dispatchDistrictsData({type: actions.SUCCESS_COUNCIL_MEMBERS, councilMembers: response.data, loading: false}))
            .catch(error => dispatchDistrictsData({type: actions.FAIL_DATA , error: error }))  
        }
    },[districtsData.councilMembersReadyToLoad])

    useEffect( () => {
        if(districtsData.participatoryBudgetReadyToLoad){        
        //     //Fetch the participatory budget
        //     dispatchDistrictsData({type: actions.START_DATA});
        //     nyOpenDataAxios.get(getRequests.participatoryBudget)
        //     .then(response => {
        //         csv2geojson.csv2geojson(response.data, {
        //             latfield: 'Latitude',
        //             lonfield: 'Longitude',
        //             delimiter: ','
        //         }, (err, data) => {                
        //             if(data){
        //                 var updateData = data;
        //                 updateData.features.forEach(curr => {
        //                     curr.properties.pinCategory = translateCategoryText(curr.properties.Category);
        //                 })                                                                        

                        dispatchDistrictsData({type: actions.SUCCESS_PARTICIPATORY_BUDGET, participatoryBudget: {}, selectedBudgetItems: {...{}}, loading: false});
        //             }
        //             // if(err) dispatchDistrictsData({type: 'FAIL' , error: err })  

        //         }); 
        
        //     })
        //     .catch(error => dispatchDistrictsData({type: actions.FAIL_DATA , error: error }))  
        }
    },[districtsData.participatoryBudgetReadyToLoad])

    useEffect( () => {
        if(districtsData.participatoryBudgetTrackerReadyToLoad){        
            //Fetch the participatory budget
            dispatchDistrictsData({type: actions.START_DATA});
            nyOpenDataAxios.get(getRequests.participatoryBudgetTracker)
            .then(response => {
                var data = response.data;
                var outputBudgetTracker = {type: "FeatureCollection", features: null};
                var features = [];
                data.map(item => { 
                    var category = translateAgencyToCategoryText(item); 
                    features.push({                            

                        type: "Feature",
                        properties: {
                            ...item,
                            description: item.description ? item.description : '',
                            pinCategory: category,
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [Number(item.mapping_location.split(", ")[1]), Number(item.mapping_location.split(", ")[0])]
                        }
                    })
                })
                outputBudgetTracker.features = features;

                dispatchDistrictsData({type: actions.SUCCESS_PARTICIPATORY_BUDGET_TRACKER, participatoryBudgetTracker: outputBudgetTracker});                    
                    // if(err) dispatchDistrictsData({type: 'FAIL' , error: err })  

            }) 
            .catch(error => dispatchDistrictsData({type: actions.FAIL_DATA , error: error }))  

        }
    },[districtsData.participatoryBudgetTrackerReadyToLoad])


    //once data is loaded, check the items that are in both lists with the same name
    useEffect( () => {

        if(districtsData.dataLoaded){

            console.log(districtsData.participatoryBudgetTracker.features);
            const sameName = (list1, list2, isUnion = true) =>
                    list1.filter( a => isUnion === list2.some( b => a.properties.project === b.properties.Title ) );

            const closeDistance = (list1, list2, isUnion = true) =>
                    list1.filter( a => isUnion === list2.some( b => distance(point(a.geometry.coordinates), point(b.geometry.coordinates)) < 0.1 ));

            const sameLocation = (list1, list2, isUnion = true) =>
                    list1.filter( a => isUnion === list2.some( b => 
                        a.geometry.coordinates[0].toFixed(4) === b.geometry.coordinates[0].toFixed(4) &&
                        a.geometry.coordinates[1].toFixed(4) === b.geometry.coordinates[1].toFixed(4)) );

            // console.log(sameName(districtsData.participatoryBudgetTracker.features, districtsData.participatoryBudget.features));

            // console.log(sameLocation(districtsData.participatoryBudgetTracker.features, districtsData.participatoryBudget.features));

            // console.log(closeDistance(districtsData.participatoryBudgetTracker.features, districtsData.participatoryBudget.features));
            
        }
    }, [districtsData.dataLoaded])        

    return (
        <DistrictDataContext.Provider
            value={{
                ...districtsData,
                dispatchDistrictsData: dispatchDistrictsData,
            }}
        >
            {props.children}
        </DistrictDataContext.Provider>
    );
}

export default DistrictDataContext;