import React, {useReducer} from 'react';
import {sidebarReducer} from '../reducers/reducers';

const SidebarContext = React.createContext();

export const SidebarContextProvider = (props) => {

    const [sidebarData, dispatchSidebarData] = useReducer(sidebarReducer, {
        clickedItem: null,
        clickedDistrict: null,
        zoom: 9.5,
    });


    return (
        <SidebarContext.Provider
            value={{
                ...sidebarData,
                dispatchSidebarData: dispatchSidebarData,                
            }}
        >
            {props.children}
        </SidebarContext.Provider>
    );
}

export default SidebarContext;