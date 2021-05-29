import React, {useReducer, useCallback} from 'react';
import {controlsReducer} from '../reducers/reducers';
import * as actions from '../actions/actionTypes';

const ControlsContext = React.createContext();

export const ControlsContextProvider = (props) => {

    const [controls, dispatchControls] = useReducer(controlsReducer, {
        category: '', 
        district: '', 
        year: '',
        agency: '',
        status: '',
    });

    const changeCategoryControls = useCallback( (category) => {
        document.getElementById('categoryDropdown').value = category;
        dispatchControls({type: actions.UPDATE_CATEGORY, category: category});
    },[controls.agency]);  
    
    const clearControls = () => {
        document.getElementById('districtDropdown').value = '';
        document.getElementById('yearDropdown').value = '';
        document.getElementById('statusDropdown').value = '';
        document.getElementById('agencyDropdown').value = '';
        document.getElementById('categoryDropdown').value = '';
        dispatchControls({type: actions.CLEAR_CONTROLS});
    }

    return (
        <ControlsContext.Provider
            value={{
                ...controls,
                dispatchControls: dispatchControls,
                changeCategoryControls: changeCategoryControls,
                clearControls: clearControls,
            }}
        >
            {props.children}
        </ControlsContext.Provider>
    );
}

export default ControlsContext;