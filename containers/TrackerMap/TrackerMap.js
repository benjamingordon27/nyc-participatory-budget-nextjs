import React, { useRef, useEffect, useState, useReducer, useCallback, useContext } from 'react';
import {mapStateReducer} from '../../store/reducers/reducers';
import {googleCivicAxios} from '../../axios-order';
import * as actions from '../../store/actions/actionTypes';
import DistrictDataContext from '../../store/dataContext/dataContext';
import SidebarContext from '../../store/dataContext/sidebarContext';
import ControlsContext from '../../store/dataContext/controlsContext';
import {mapMarkerImgs} from '../../components/MapMarker/mapMarkerImgs';
import {uniqueValueBudget} from '../../util/utility';
import Controls from '../Controls/Controls';

import {inside, polygon,multiPolygon, point, distance, centroid} from '@turf/turf';

import mapboxgl from '!mapbox-gl';
// import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';


// mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const TrackerMap = React.memo( () => {

    const districtsDataContext = useContext(DistrictDataContext);
    const sidebarContext = useContext(SidebarContext);  
    const controlsContext = useContext(ControlsContext);

    const mapContainer = useRef(); 
        
    const [useStateMap, setMap] = useState(null);   
    const [mapState, dispatchMap] = useReducer(mapStateReducer, {        
        lng: -73.893097,
        lat: 40.727013,
        zoom: 9.5,
        clickedItem: null,
        clickedItemId: null,
        clickedDistrict: null,
        clickedDistrictId: null,
        stateMap: null,
    });
    
    var priorClickedDistrictId = null;
    var priorClickedItem = null;
    var currentlyClickedItem = false;

    const flyToFunction = (lat,lng,zoom, map) => {    
        console.log('we are flying?')    
        map.flyTo({
            center: [lat, lng],
            zoom: zoom,
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
    };

    const centerMap = useCallback( () => {
        useStateMap.flyTo({
            center: [-73.893097, 40.727013],
            zoom: 9.5,
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });        
        
        controlsContext.clearControls();

        if(mapState.clickedDistrictId){
            useStateMap.setPaintProperty(mapState.clickedDistrictId,'fill-opacity',0.9);
        }
        dispatchMap({type: actions.CLEAR_MAP_STATE});
        sidebarContext.dispatchSidebarData({type: actions.CLEAR_CLICKED_DISTRICT_REDUCER});
        sidebarContext.dispatchSidebarData({type: actions.CLEAR_CLICKED_ITEM_REDUCER});

        priorClickedDistrictId = null;
        priorClickedItem = null;
        
    }, [useStateMap, mapState]);

    const {lat,lng,zoom, clickedItem, clickedDistrict} = mapState;

    useEffect( () => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/benjamingordon27/ckoj0001e1d2518oy9cbvws9e',
            center: [lng, lat],
            zoom: zoom
        });

        setMap(map);
        dispatchMap({type: 'SET_MAP', stateMap: map});

        map.on('move', () => {                        
            dispatchMap({type: actions.MOVE, lng: map.getCenter().lng.toFixed(4), lat: map.getCenter().lat.toFixed(4), zoom: map.getZoom().toFixed(2)})            
            sidebarContext.dispatchSidebarData({type: actions.ZOOM_REDUCER, zoom: map.getZoom().toFixed(2)});
        });

        if(districtsDataContext.dataLoaded){
            districtsDataContext.districts.features.forEach(district => {
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
                                '#a89',
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
                    sidebarContext.dispatchSidebarData({type: actions.ZOOM_REDUCER, zoom: map.getZoom().toFixed(2)});

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

                    }else if(priorClickedItem){
                        console.log('clearing the item');

                        //Check if the item is currently in the district based on the district location                        
                        
                        console.log('district',district);
                        console.log('priorClickedItem',priorClickedItem )

                        var itemInDistrict = inside(
                            point(priorClickedItem.geometry.coordinates), 
                            polygon(...district.geometry.coordinates)) || 
                            district.properties.coun_dist === priorClickedItem.properties.district.replace( /\D+/g, '');

                        console.log('itemInDistrict',itemInDistrict);   
                        console.log('currentlyClickedItem',currentlyClickedItem);
                                                    
                        // if(!itemInDistrict){
                        if(!currentlyClickedItem){
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
                            sidebarContext.dispatchSidebarData({type: actions.CLEAR_CLICKED_ITEM_REDUCER});
                            getCouncilMemberContactInfo(district.properties.coun_dist, map);
                        }else{
                            getCouncilMemberContactInfo(district.properties.coun_dist, map);
                        }

                        // getCouncilMemberContactInfo(district.properties.coun_dist, map);
                    }
                    currentlyClickedItem = false;
                });
            })            

            districtsDataContext.participatoryBudgetTracker.features.forEach(function (marker,idx) {                

                // create a DOM element for the marker
                var el = document.createElement('div');
                el.className = 'budgetItem';
                el.setAttribute("id", idx+'_'+marker.properties.pinCategory);
                el.setAttribute("category", marker.properties.pinCategory);
                el.setAttribute("agency", marker.properties.agency);
                el.setAttribute("status", marker.properties.status_summary);
                el.setAttribute("year", marker.properties.vote_year);
                el.setAttribute("district", marker.properties.district.replace( /\D+/g, ''));
                
                // el.className = 'marker';       
                el.style.backgroundImage = `url(${mapMarkerImgs[marker.properties.pinCategory].dot})`;

                // el.style.backgroundImage = `url(${mapMarkerImgs['Sanitation'].dot})`;
                el.style.width = 11 + 'px';
                el.style.height = 11 + 'px';
                el.style.backgroundSize = '100%';

                el.addEventListener('click', function () {
                    console.log('Clicked the MARKER', marker);
                    dispatchMap({
                        type: actions.CLICKED_ITEM, 
                        lat: marker.geometry.coordinates[0], 
                        lng: marker.geometry.coordinates[1], 
                        clickedItem: {
                            ...marker.properties, 
                            coordinates: marker.geometry.coordinates
                        }, 
                        clickedItemId: idx+'_'+marker.properties.pinCategory
                    })
                    sidebarContext.dispatchSidebarData({type: actions.CLICKED_ITEM_REDUCER, clickedItem: {...marker.properties, coordinates: marker.geometry.coordinates}});
                

                    priorClickedItem = marker;
                    currentlyClickedItem = true;

                    flyToFunction(marker.geometry.coordinates[0], marker.geometry.coordinates[1], 13, map);
                });
                // add marker to map
                new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)            
                .addTo(map);
            });

            console.log(uniqueValueBudget(districtsDataContext.participatoryBudgetTracker.features, 'agency'));
        
            //clean up
            return () => map.remove();
        }
    }, [districtsDataContext.dataLoaded]);

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

    //When the filtered data changes, re render and only display budget items that are highlighted
    useEffect( () => {
        if(districtsDataContext.dataLoaded){
            var budgetItems = document.getElementsByClassName('budgetItem');            
            for(var i=0;i<budgetItems.length;i++) budgetItems[i].style.display = 'block';

            for(var i=0;i<budgetItems.length;i++){
                var item = budgetItems[i];
                if(controlsContext.year !== ''){
                    if(item.getAttribute('year') !== controlsContext.year){
                        item.style.display = 'none';
                        continue;
                    }
                }
                if(controlsContext.district !== ''){
                    if(item.getAttribute('district') !== controlsContext.district.split(':')[0]){
                        item.style.display = 'none';
                        continue;
                    }
                }
                if(controlsContext.category !== ''){
                    if(item.getAttribute('category') !== controlsContext.category){
                        item.style.display = 'none';
                        continue;
                    }
                }
                if(controlsContext.agency !== ''){
                    if(item.getAttribute('agency') !== controlsContext.agency){
                        item.style.display = 'none';
                        continue;
                    }
                }
                if(controlsContext.status !== ''){
                    if(item.getAttribute('status') !== controlsContext.status){
                        item.style.display = 'none';
                        continue;
                    }
                }
                
            }
        }
        
    }, [controlsContext]);

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
                        sidebarContext.dispatchSidebarData({type: actions.CLICKED_DISTRICT_REDUCER, clickedDistrict: clickedDistrict});
                    }) //.catch( err => dispatchMap({type: 'CLICKED_DISTRICT_FAIL', error: err}));
            }                        
            
            var centerOfDistrict = centroid(multiPolygon(districtsDataContext.districts.features.filter(d => d.properties.coun_dist === district)[0].geometry.coordinates));
            
            dispatchMap({type: actions.CLICKED_DISTRICT_ID, clickedDistrictId: 'councilDistrict'+district,
                            lat: centerOfDistrict.geometry.coordinates[0], lng: centerOfDistrict.geometry.coordinates[1]
            })
            sidebarContext.dispatchSidebarData({type: actions.ZOOM_REDUCER, zoom: currMap.getZoom().toFixed(2)});
        }
    },[controlsContext.district, districtsDataContext, mapState, useStateMap]);

    return (
        <div ref={mapContainer} className="map-container">               
            <Controls propsStyle = {{top: '0', position: 'absolute'}}/>
            <div className="clickButton" style={{alignContent: 'center', top: '0px', right: '0px', width: 'auto'}}>
                    <button onClick={()=>{centerMap()}}>Center</button>
            </div>                     
        </div>
    );
});

export default TrackerMap;