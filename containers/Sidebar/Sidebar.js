import {useContext} from 'react';
import SidebarContext from '../../store/dataContext/sidebarContext';
import ClickedTrackerItem from '../../components/ClickedTrackerItem/ClickedTrackerItem';
import ClickedDistrict from '../../components/ClickedDistrict/ClickedDistrict';
import About from '../../pages/About/index';

const Sidebar = (props) => {
    const sidebarContext = useContext(SidebarContext);
    let {clickedItem, clickedDistrict} = sidebarContext;        

    return (
        <div>
            {!clickedItem && !clickedDistrict ? <About />:null}        
            <div className='sidebar' id='sidebar'>            
                {clickedItem ? <div><ClickedTrackerItem {...clickedItem}/><br/></div> :null}
                {clickedDistrict ? <ClickedDistrict {...clickedDistrict} /> :null}
            </div>
        </div>
    );
};

export default Sidebar;
