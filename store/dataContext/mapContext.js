import React, {useReducer, useEffect, useState, useRef, useContext} from 'react';
import * as actions from '../actions/actionTypes';
import {mapStateReducer} from '../reducers/reducers';
import DistrictDataContext from '../dataContext/dataContext';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapStateContext = React.createContext();

export const MapStateContextProvider = (props) => {

    const [mapState, dispatchMap] = useReducer(mapStateReducer, {
        lng: -74.0060,
        lat: 40.7128,
        zoom: 10,
        clickedItem: null,
        clickedItemId: null,
        clickedDistrict: null,
        clickedDistrictId: null,        
    })

    const mapContainer = useRef();

    const {lat,lng,zoom, clickedItem, clickedDistrict} = mapState;

    const [useStateMap, setMap] = useState(null);   

    const districtsDataContext = useContext(DistrictDataContext); 

    useEffect( () => {

        //clean up
        return () => map.remove();
    }, [districtsDataContext.dataLoaded]);


    return (
        <MapStateContext.Provider
            value={{
                ...mapState,
                useStateMap: useStateMap,
                dispatchMap: dispatchMap,
            }}
        >
            {props.children}
        </MapStateContext.Provider>
    );
}

export default MapStateContext;