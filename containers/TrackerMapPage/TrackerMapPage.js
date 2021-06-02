import React, {useEffect,useContext} from 'react';
import TrackerMap from '../../containers/TrackerMap/TrackerMap';
import Sidebar from '../../containers/Sidebar/Sidebar';
import Legend from '../../containers/Legend/Legend'
import {mapMarkerImgs} from '../../components/MapMarker/mapMarkerImgs';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import SidebarContext from '../../store/dataContext/sidebarContext';
import ControlsContext from '../../store/dataContext/controlsContext';

const TrackerMapPage = () => {    
    const sidebarContext = useContext(SidebarContext);
    const controlsContext = useContext(ControlsContext);                    

    return(                     
        <div style={{display:'flex', flexDirection:'row', flex: '1'}}>
            <div style={{flex: '2', order: '1', overflow: 'scroll'}}>                    
                <Sidebar />                    
            </div>            
            <div style={{flex: '3', order: '2', overflow: 'scroll'}}>
                <TrackerMap />                                          
            </div>            
            <div className = 'legend' style={{position: 'relative',marginRight: 'auto', flex: '0.75', order: '3', overflow: 'scroll'}}>
                <Legend legendMarkers = {mapMarkerImgs} zoom = {sidebarContext.zoom} filter={controlsContext.changeCategoryControls}/>
            </div>            
        </div>        
    );
};

export default TrackerMapPage;