import {useRouter} from 'next/router'
import React, {useReducer, useCallback} from 'react';
import {controlsReducer} from '../reducers/reducers';
import * as actions from '../actions/actionTypes';

const ControlsContext = React.createContext();

export const ControlsContextProvider = (props) => {

    const router = useRouter();

    const [controls, dispatchControls] = useReducer(controlsReducer, {
        category: '', 
        district: '', 
        year: '',
        agency: '',
        status: '',
    });

    const changeCategoryControls = useCallback( (category) => {
        document.getElementById('categoryDropdown').innerHTML = "Category: " + category;
        dispatchControls({type: actions.UPDATE_CATEGORY, category: category});
        router.replace(
            {
              pathname: router.pathname,
              query:  {
                ...router.query, // list all the queries here
                category: category // override the color property
              },
            },
            undefined,
            {
              shallow: true,
            },
          );
    },[controls.agency]);  
    
    const clearControls = () => {
        document.getElementById('districtDropdown').innerHTML = '';
        document.getElementById('yearDropdown').innerHTML = '';
        document.getElementById('statusDropdown').innerHTML = '';
        document.getElementById('agencyDropdown').innerHTML = '';
        document.getElementById('categoryDropdown').innerHTML = '';
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