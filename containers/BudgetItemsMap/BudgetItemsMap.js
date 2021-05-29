import React, { useRef, useEffect, useState, useReducer, useCallback, useContext } from 'react';
import {googleCivicAxios} from '../../axios-order';
import * as getRequests from '../../store/actions/getRequests';
import {mapMarkerImgs} from '../../components/MapMarker/mapMarkerImgs';
import {translateCategoryText} from '../../util/translateCategory';
import Dropdown from '../../components/Dropdown/Dropdown';
import Legend from '../../containers/Legend/Legend';
import ClickedItem from '../../components/ClickedItem/ClickedItem';
import ClickedDistrict from '../../components/ClickedDistrict/ClickedDistrict';
import Modal from '../../components/Modal/Modal';

import {mapStateReducer, controlsReducer} from '../../store/reducers/reducers';
import * as actions from '../../store/actions/actionTypes';

import {uniqueValueBudget, uniqueValueCouncilMember} from '../../util/utility';

import {inside, polygon,multiPolygon, point, distance, centroid} from '@turf/turf';

import DistrictDataContext from '../../store/dataContext/dataContext';
// import MapStateContext from '../../store/dataContext/mapContext';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

// const Map = ( () => {
const BudgetItemsMap = React.memo( () => {    

    const districtsDataContext = useContext(DistrictDataContext); 
    // const mapStateContext = useContext(MapStateContext);

    const [useStateMap, setMap] = useState(null);    

    const [mapState, dispatchMap] = useReducer(mapStateReducer, {
        lng: -74.0060,
        lat: 40.7128,
        zoom: 10,
        clickedItem: null,
        clickedItemId: null,
        clickedDistrict: null,
        clickedDistrictId: null,
        stateMap: null,
    })

    const [controls, dispatchControls] = useReducer(controlsReducer, {
        category: '', 
        district: '', 
        year: ''
    })

    const [showModal, setShowModal] = useState(false);
    const [showLegend, setShowLegend] = useState(true);

    var priorClickedDistrictId = null;
    var priorClickedItem = null;

    const centerMap = useCallback( () => {
        useStateMap.flyTo({
            center: [-74.0060, 40.7128],
            zoom: 10,
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });        
        changeCategoryControls('');
        changeYearControls('');
        changeDistrictControls('');        
        if(mapState.clickedDistrictId){
            useStateMap.setPaintProperty(mapState.clickedDistrictId,'fill-opacity',0.9);
        }
        dispatchMap({type: actions.CLEAR_MAP_STATE});

        priorClickedDistrictId = null;
        priorClickedItem = null;
        
    }, [useStateMap, mapState]);

    const mapContainer = useRef();

    // const [clickedItem, setClickedItem] = useState('');    
    const {lat,lng,zoom, clickedItem, clickedDistrict} = mapState;
    // var [clickedItemState, setClickedItemState] = useState(null);
    
    const flyToFunction = useCallback( (lat,lng,zoom, map) => {        
        map.flyTo({
            center: [lat, lng],
            zoom: zoom,
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
    }, [] );

    //useEffect for making the map
    useEffect(() => {
        console.log('map changed!')

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/benjamingordon27/cknkdq9du0g0617prwqp97hug',
            center: [lng, lat],
            zoom: zoom
        });

        setMap(map);
        dispatchMap({type: 'SET_MAP', stateMap: map});

        map.on('move', () => {                        
            dispatchMap({type: actions.MOVE, lng: map.getCenter().lng.toFixed(4), lat: map.getCenter().lat.toFixed(4), zoom: map.getZoom().toFixed(2)})            
        });
        
            if(districtsDataContext.dataLoaded){
                districtsDataContext.districts.features.forEach(district => {

                // districtsData.districts.features.forEach(district => {
                // console.log('district', district.properties.coun_dist)

                    map.on('load', () => {
                        map.addSource('councilDistrict'+district.properties.coun_dist, {
                            type: 'geojson',
                            data: district
                        });
            
                        map.addLayer({
                            'id': 'councilDistrict'+district.properties.coun_dist,
                            'type': 'fill',
                            'source': 'councilDistrict'+district.properties.coun_dist,
                            'layout': {
                                // Make the layer visible by default.
                                'visibility': 'visible'
                            },
                            'paint': {
                                'fill-color': [
                                    'case',
                                    ['boolean', ['feature-state', 'hover'], false],
                                    '#f82',
                                    '#e89',
                                ],
                                'fill-opacity': 0.9                           
                            },
                            // 'filter': ['==', 'district', district.properties.coun_dist],
                        });

                        // Add a black outline around the polygon.
                        map.addLayer({
                            'id': 'councilDistrictOutline'+district.properties.coun_dist,
                            'type': 'line',
                            'source': 'councilDistrict'+district.properties.coun_dist,
                            'layout': {},
                            'paint': {
                                'line-color': '#000',
                                'line-width': 1.5
                            }
                        });
                    });                    

                    

                    map.on('click', 'councilDistrict'+district.properties.coun_dist, (e) => {         
                        
                        console.log('district clicked',district)

                        if(priorClickedDistrictId){                        
                            map.setPaintProperty(
                                priorClickedDistrictId,
                                // STATE_priorClickedDistrictId.clickedDistrictId,
                                'fill-opacity',
                                    0.9
                            );
                        }
                        map.setPaintProperty(
                            'councilDistrict'+district.properties.coun_dist,
                            'fill-opacity',
                                0.3
                        );
                        
                        var centerOfDistrict = centroid(multiPolygon(district.geometry.coordinates));

                        dispatchMap({type: actions.CLICKED_DISTRICT_ID, clickedDistrictId: 'councilDistrict'+district.properties.coun_dist,
                                lat: centerOfDistrict.geometry.coordinates[0], lng: centerOfDistrict.geometry.coordinates[1]
                            })                        

                        priorClickedDistrictId = 'councilDistrict'+district.properties.coun_dist;

                        if(!priorClickedItem){
                            // getCouncilMemberContactInfo(district.properties.coun_dist);
                            getCouncilMemberContactInfo(district.properties.coun_dist, map);


                            // map.flyTo({
                            //     center: [centerOfDistrict.geometry.coordinates[0], centerOfDistrict.geometry.coordinates[1]],
                            //     zoom: 11.5,
                            //     essential: true // this animation is considered essential with respect to prefers-reduced-motion
                            // });
                            console.log('we are flying because there is no prior clicked item')
                            flyToFunction(centerOfDistrict.geometry.coordinates[0], centerOfDistrict.geometry.coordinates[1], 11.5, map);

                        }
                        
                        else if(priorClickedItem){
                            console.log('clearing the item');

                            //Check if the item is currently in the district based on the district location
                            
                            console.log('district',district);
                            console.log('priorClickedItem',priorClickedItem )

                            var itemInDistrict = inside(
                                point(priorClickedItem.geometry.coordinates), 
                                polygon(...district.geometry.coordinates)) || 
                                district.properties.coun_dist === priorClickedItem.properties['Council District'].replace( /\D+/g, '');

                            console.log('itemInDistrict',itemInDistrict);                            
                                                        
                            if(!itemInDistrict){
                                console.log('are we clearing the clicked item because the item is not in the district in the on click part of the map?')
                                
                                priorClickedItem = null;
                                
                                // map.flyTo({
                                //     center: [centerOfDistrict.geometry.coordinates[0], centerOfDistrict.geometry.coordinates[1]],
                                //     zoom: 11.5,
                                //     essential: true // this animation is considered essential with respect to prefers-reduced-motion
                                // });
                                console.log('we are flying because the item is not in the district')
                                flyToFunction(centerOfDistrict.geometry.coordinates[0], centerOfDistrict.geometry.coordinates[1], 11.5, map);

                                dispatchMap({type: actions.CLEAR_CLICKED_ITEM});
                                getCouncilMemberContactInfo(district.properties.coun_dist, map);
                            }else{
                                getCouncilMemberContactInfo(district.properties.coun_dist, map);
                            }
                        }
                    })                       
                })

                // console.log(districtsDataContext.selectedBudgetItems.features);
                // districtsData.selectedBudgetItems.features.forEach(function (marker,idx) {
                districtsDataContext.participatoryBudget.features.forEach(function (marker,idx) {
                // districtsDataContext.selectedBudgetItems.features.forEach(function (marker,idx) {
                    // create a DOM element for the marker
                    var el = document.createElement('div');
                    el.className = 'budgetItem';
                    el.setAttribute("id", idx+'_'+marker.properties.pinCategory);
                    el.setAttribute("category", marker.properties.pinCategory);
                    el.setAttribute("year", marker.properties['Vote Year']);
                    el.setAttribute("district", marker.properties['Council District'].replace( /\D+/g, ''));
                    
                    // el.className = 'marker';                    
                    el.style.backgroundImage = `url(${mapMarkerImgs[marker.properties.pinCategory].dot})`;
                    el.style.width = 11 + 'px';
                    el.style.height = 11 + 'px';
                    el.style.backgroundSize = '100%';
                    
                    el.addEventListener('click', function () {
                        console.log('Clicked the MARKER', marker);

                        // setClickedItem(idx+'_'+marker.properties.pinCategory);
                        dispatchMap({type: actions.CLICKED_ITEM, lat: marker.geometry.coordinates[0], lng: marker.geometry.coordinates[1], clickedItem: {...marker.properties, coordinates: marker.geometry.coordinates}, clickedItemId: idx+'_'+marker.properties.pinCategory})
                        
                        console.log(marker.properties.Title,marker.geometry.coordinates);
                        console.log( 'Filtered array by distance',
                            // districtsData.participatoryBudgetTracker.features.filter(trackerItem => {
                            districtsDataContext.participatoryBudgetTracker.features.filter(trackerItem => {
                                return distance(point(marker.geometry.coordinates), point(trackerItem.geometry.coordinates)) < 0.1;
                            })
                        )

                        console.log( 'Filtered array',
                                // districtsData.participatoryBudgetTracker.features.filter(trackerItem => {
                                districtsDataContext.participatoryBudgetTracker.features.filter(trackerItem => {
                                return (
                                        marker.properties['Vote Year'] === trackerItem.properties.vote_year &&
                                        marker.properties['Council District'].replace( /\D+/g, '') === trackerItem.properties.district &&
                                        (
                                            distance(point(marker.geometry.coordinates), point(trackerItem.geometry.coordinates)) < 0.1 ||                                                                                
                                            Number(marker.properties.Cost) === Number(trackerItem.properties.ballot_price) ||
                                            (marker.properties.Title === trackerItem.properties.project) ||
                                            (marker.properties.Description === trackerItem.properties.description)
                                        )
                                );
                            })
                        )                        

                        priorClickedItem = marker;

                        console.log('fly to')
                        // map.flyTo({
                        //     center: [marker.geometry.coordinates[0], marker.geometry.coordinates[1]],
                        //     zoom: 13,
                        //     essential: true // this animation is considered essential with respect to prefers-reduced-motion
                        // });
                        flyToFunction(marker.geometry.coordinates[0], marker.geometry.coordinates[1], 13, map);


                        el.style.backgroundImage = `url(${mapMarkerImgs[marker.properties.pinCategory].img})`;
                        el.style.width = 35 + 'px';
                        el.style.height = '41px';                        
                    });
                     
                    // add marker to map
                    new mapboxgl.Marker(el)
                    .setLngLat(marker.geometry.coordinates)
                    // .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                    // .setHTML('<h3>' + marker.properties.Title + '</h3><p>' + marker.properties.Description + '</p>'))
                    .addTo(map);
                });                
        }

        // centerMap();

        //clean up
        return () => map.remove();
    }, [districtsDataContext.dataLoaded]);
    
    // }, [districtsData.dataLoaded]);
        
    //When Zoom changes and is less than a certain height, change the markers images
    useEffect( () => {
        // if(districtsData.dataLoaded){        
        if(districtsDataContext.dataLoaded){
            // console.log('document', document.getElementsByClassName('budgetItem'))
            var budgetItems = document.getElementsByClassName('budgetItem');                        
            if(mapState.zoom > 12){    
                for(var i=0;i<budgetItems.length;i++){
                    budgetItems[i].style.backgroundImage = `url(${mapMarkerImgs[budgetItems[i].id.split('_')[1]].img})`;
                    if(budgetItems[i].id === mapState.clickedItemId){
                        budgetItems[i].style.width = 70 + 'px';
                        budgetItems[i].style.height = '82px';
                        flyToFunction(mapState.clickedItem.coordinates[0], mapState.clickedItem.coordinates[1], 13, useStateMap);
                        // budgetItems[i].style.backgroundSize = '150%';
                    }else{
                        budgetItems[i].style.width = 35 + 'px';
                        budgetItems[i].style.height = '41px';
                    }                    
                }                
            }else{
                var budgetItems = document.getElementsByClassName('budgetItem');
                for(var i=0;i<budgetItems.length;i++){
                    budgetItems[i].style.backgroundImage = `url(${mapMarkerImgs[budgetItems[i].id.split('_')[1]].dot})`;
                    budgetItems[i].style.width = 11 + 'px';
                    budgetItems[i].style.height = 11 + 'px';
                }                
            }
            
        }
    },[mapState.zoom])

    //When the clicked item updates, take the old one and disable it, and set the new one.
    useEffect ( () => {
        // if(districtsData.dataLoaded){
        if(districtsDataContext.dataLoaded){

            var budgetItems = document.getElementsByClassName('budgetItem');
            for(var i=0;i<budgetItems.length;i++){                
                if(budgetItems[i].id === mapState.clickedItemId){
                    budgetItems[i].style.backgroundImage = `url(${mapMarkerImgs[budgetItems[i].id.split('_')[1]].img})`;
                    budgetItems[i].style.width = 70 + 'px';
                    budgetItems[i].style.height = '82px';                    
                    flyToFunction(mapState.clickedItem.coordinates[0], mapState.clickedItem.coordinates[1], 13, useStateMap);
                    // budgetItems[i].style.backgroundSize = '150%';
                }else{
                    if(mapState.zoom > 12){
                        budgetItems[i].style.backgroundImage = `url(${mapMarkerImgs[budgetItems[i].id.split('_')[1]].img})`;
                        budgetItems[i].style.width = 35 + 'px';
                        budgetItems[i].style.height = '41px';
                    }else{
                        budgetItems[i].style.backgroundImage = `url(${mapMarkerImgs[budgetItems[i].id.split('_')[1]].dot})`;
                        budgetItems[i].style.width = 11 + 'px';
                        budgetItems[i].style.height = 11 + 'px';
                    }
                }
            }
        }
    }, [mapState.clickedItem])

    //When the controls change, dispatch and update the selected budget items
    useEffect( () => {
        if(districtsDataContext.dataLoaded){

        // if(districtsData.dataLoaded){                
            
            var selectedBudgetItemsFeatures = districtsDataContext.participatoryBudget.features;            
            // var selectedBudgetItemsFeatures = districtsData.participatoryBudget.features;            

            var newItems = selectedBudgetItemsFeatures;
            if(controls.year !== ''){
                newItems = newItems.filter(item => item.properties['Vote Year'] === controls.year);
            }
            if(controls.district !== ''){                                
                getCouncilMemberContactInfo(controls.district.split(':')[0]);
                newItems = newItems.filter(item => {
                    var currDistrict = item.properties['Council District'].replace( /\D+/g, '');                    
                    return currDistrict === controls.district.split(':')[0];
            });
            }
            else{
                getCouncilMemberContactInfo('');
            }
            if(controls.category !== ''){                  
                newItems = newItems.filter(item => item.properties['pinCategory'] === controls.category);
            }

            var selectedBudgetItemsNew = districtsDataContext.selectedBudgetItems;
            // var selectedBudgetItemsNew = districtsData.selectedBudgetItems;
            selectedBudgetItemsNew.features = newItems;
            districtsDataContext.dispatchDistrictsData({type: actions.FILTER_DATA, selectedBudgetItems: selectedBudgetItemsNew});
            // dispatchDistrictsData({type: actions.FILTER_DATA, selectedBudgetItems: selectedBudgetItemsNew})
        }
    }, [controls]);

    //use effect for clickedDistrict changes
    useEffect ( () => {
        if(clickedDistrict && !clickedItem){
            if( (clickedDistrict.district+": "+clickedDistrict.name) !== controls.district){
                changeDistrictControls(clickedDistrict.district+": "+clickedDistrict.name);
            }
        }
    },[clickedDistrict])

    //When the filtered data changes, re render and only display budget items that are highlighted
    useEffect( () => {
        if(districtsDataContext.dataLoaded){
            var budgetItems = document.getElementsByClassName('budgetItem');            
            for(var i=0;i<budgetItems.length;i++) budgetItems[i].style.display = 'block';

            for(var i=0;i<budgetItems.length;i++){
                var item = budgetItems[i];
                if(controls.year !== ''){
                    if(item.getAttribute('year') !== controls.year){
                        item.style.display = 'none';
                        continue;
                    }
                }
                if(controls.district !== ''){
                    if(item.getAttribute('district') !== controls.district.split(':')[0]){
                        item.style.display = 'none';
                        continue;
                    }
                }
                if(controls.category !== ''){
                    if(item.getAttribute('category') !== controls.category){
                        item.style.display = 'none';
                        continue;
                    }
                }
            }
        }
        
    }, [districtsDataContext.filtered])

    const getCouncilMemberContactInfo = useCallback( (district, currMap = null) => {
        if(district === ''){
            dispatchMap({type: actions.CLEAR_MAP_STATE});
        }else{                            
            //If we've already visited this district there is no reason to run another get request, so go to the file
            if(district in districtsDataContext.memoDistrictsData){                
                dispatchMap({type: actions.CLICKED_DISTRICT_SUCCESS, clickedDistrict: districtsDataContext.memoDistrictsData[district]});                
            }else{                
                var url = 'https://civicinfo.googleapis.com/civicinfo/v2/representatives/ocd-division%2Fcountry%3Aus%2Fstate%3Any%2Fplace%3Anew_york%2Fcouncil_district%3A';
                var key = '?key='+process.env.REACT_APP_GOOGLE_CIVIC_TOKEN;
                dispatchMap({type: actions.CLICKED_DISTRICT_START});
                googleCivicAxios.get(url+district+key)
                    //<p>${findCouncilMember(district.properties.coun_dist).name}<br/>
                    .then(res => {
                        console.log('did we get a response here?',res.data);                    
                        var clickedDistrict = {
                            email: res.data.officials[0].emails[0],
                            url: res.data.officials[0].urls[0],
                            phone: res.data.officials[0].phones[0],
                            name: res.data.officials[0].name,
                            district: district,
                            address: res.data.officials[0].address[0],
                            party: res.data.officials[0].party,
                            channels: res.data.officials[0].channels,
                            photoURL: res.data.officials[0].photoUrl,
                            geojson: districtsDataContext.districts.features.filter(d => d.properties.coun_dist === district)[0]
                        }                    
                                                
                        // var currDistrictJSON = districtsData.districts.features.filter(currDistrict => currDistrict.properties.coun_dist === district);                                        
                        dispatchMap({type: actions.CLICKED_DISTRICT_SUCCESS, clickedDistrict: clickedDistrict});                        
                        districtsDataContext.dispatchDistrictsData({type: actions.MEMO_DISTRICTS_DATA, district: district, clickedDistrict: clickedDistrict});
                    }) //.catch( err => dispatchMap({type: 'CLICKED_DISTRICT_FAIL', error: err}));
            }            

            console.log('councilMemberGetDistrictInfo', mapState.zoom, mapState.clickedDistrict ? mapState.clickedDistrict.district : null, district);
            
            var centerOfDistrict = centroid(multiPolygon(districtsDataContext.districts.features.filter(d => d.properties.coun_dist === district)[0].geometry.coordinates));
            
            dispatchMap({type: actions.CLICKED_DISTRICT_ID, clickedDistrictId: 'councilDistrict'+district,
                            lat: centerOfDistrict.geometry.coordinates[0], lng: centerOfDistrict.geometry.coordinates[1]
            })                            
        }
    },[controls.district, districtsDataContext, mapState, useStateMap]);
    
    // console.log('state + context', districtsDataContext, mapState)
    // console.log('mapState', mapState);
    // console.log('useStateMap', useStateMap);
    // console.log('map context', mapStateContext)        

    const changeDistrictControls = useCallback( (district) => {
        document.getElementById('districtDropdown').value = district;
        dispatchControls({type: actions.UPDATE_DISTRICT, district: district});
    },[]);

    const changeCategoryControls = useCallback( (category) => {
        document.getElementById('categoryDropdown').value = category;
        dispatchControls({type: actions.UPDATE_CATEGORY, category: category});
    },[]);

    const changeYearControls = useCallback( (year) => {
        document.getElementById('yearDropdown').value = year;
        dispatchControls({type: actions.UPDATE_YEAR, year: year});
    },[]);

    return(
        <div ref={mapContainer} className="map-container">            
            <div className="clickButton">
                <button onClick={()=>{centerMap()}}>Center</button>
            </div>
            <div className="controls" style={{left: '10%'}}>                
                <div style = {{float: 'left', margin: '6px'}}>
                    {districtsDataContext.participatoryBudget ? 
                        <Dropdown                             
                            id = {'categoryDropdown'}                        
                            title = 'Category' 
                            list={uniqueValueBudget(districtsDataContext.participatoryBudget.features, 'Category', translateCategoryText)}
                            handleChange={(event) => changeCategoryControls(event.target.value)}
                        />
                    : null}
                </div>
                <div style = {{float: 'left', margin: '6px'}}>
                    {districtsDataContext.participatoryBudget ? 
                        <Dropdown 
                            id = {'yearDropdown'}
                            title = 'Year' 
                            list={uniqueValueBudget(districtsDataContext.participatoryBudget.features, 'Vote Year')}
                            handleChange={(event) => changeYearControls(event.target.value)}
                        />
                    : null}          
                </div>
                <div style = {{float: 'left', margin: '6px'}}>
                    {districtsDataContext.participatoryBudget ? 
                        <Dropdown                             
                            id = {'districtDropdown'}
                            title = 'Current Council Member' 
                            list={uniqueValueCouncilMember(districtsDataContext.councilMembers)}
                            handleChange={(event) => changeDistrictControls(event.target.value)}
                        /> 
                    : null}
                </div>
            </div>
            <div className="clickButton" style={{top: '0', left: '0', float: 'left', width: '60px'}}>
                <button onClick={ () => setShowModal(!showModal)}>About</button>
            </div>
            {showModal ? <Modal title="About" onClose={() => setShowModal(!showModal)}/>: null}            
            <div className="clickButton" style={{top: '60px', left: '0', width: '60px'}}>
                <button onClick={ () => setShowLegend(!showLegend)}>Legend</button>
            </div>
            {showLegend ? 
                <div className="legend" style={{right: '0', top: '0', float: 'right'}}>
                    <Legend legendMarkers = {mapMarkerImgs} zoom = {zoom} filter={changeCategoryControls}/>
                </div>
            : null}
            <div className="sidebar">                
                {!clickedItem && !clickedDistrict ? 'Clicked information shows up here':null}
                {clickedItem ? <div><ClickedItem {...clickedItem}/><br/></div> :null}
                {clickedDistrict ? <ClickedDistrict {...clickedDistrict} /> :null}
            </div>            
        </div>
    );    
});

export default BudgetItemsMap;