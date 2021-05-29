import React, {useContext} from 'react';
import classes from './NavigationBar.module.css';
import Link from 'next/link';
import SidebarContext from '../../store/dataContext/sidebarContext';
import * as actions from '../../store/actions/actionTypes';

const navigationBar = (props) => {
    const sidebarContext = useContext(SidebarContext);

    return(
        <header className={classes.NavigationBar}>
            <nav>
                <ul>             
                    <li onClick={() => {
                        sidebarContext.dispatchSidebarData({type: actions.CLEAR_CLICKED_DISTRICT_REDUCER});
                        sidebarContext.dispatchSidebarData({type: actions.CLEAR_CLICKED_ITEM_REDUCER});
                    }}><Link href='/'>About</Link></li>                    
                    <li><Link href='/budget-item-tracker'>Budget Item Tracker</Link></li>
                </ul>
            </nav>
        </header>  
    );
}

export default navigationBar;