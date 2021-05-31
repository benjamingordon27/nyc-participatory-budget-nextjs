import React, {useEffect,useContext} from 'react';
import TrackerMap from '../../containers/TrackerMap/TrackerMap';
import Sidebar from '../../containers/Sidebar/Sidebar';
import Legend from '../../containers/Legend/Legend'
import {mapMarkerImgs} from '../../components/MapMarker/mapMarkerImgs';
import SidebarContext from '../../store/dataContext/sidebarContext';
import ControlsContext from '../../store/dataContext/controlsContext';

const TrackerMapPage = () => {    
    const sidebarContext = useContext(SidebarContext);
    const controlsContext = useContext(ControlsContext);                    

    return(
        <div>
            {/* <Controls /> */}            
            <div style={{display:'flex', flexDirection:'row'}}>
                <div style={{width: '45%', flex: '1'}}>
                    <Sidebar />
                </div>            
                <div style={{flex: '2',position: 'relative',width: '100%', height:'100vh', right: '0',overflowY: 'scroll'}}>
                    <TrackerMap />                                          
                </div>            
                <div className = 'legend' style={{position: 'relative',width: 'auto', height: '100vh', right: '0', flex: '1'}}>
                    <Legend legendMarkers = {mapMarkerImgs} zoom = {sidebarContext.zoom} filter={controlsContext.changeCategoryControls}/>
                </div>            
            </div>
        </div>
    );
};

export default TrackerMapPage;