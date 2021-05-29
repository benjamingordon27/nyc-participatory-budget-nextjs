import * as actions from '../actions/actionTypes';

export const districtsDataReducer = (currentDistrictData, action) => {
    switch(action.type){
        case actions.START_DATA: return {...currentDistrictData,loading: true};
        case actions.SUCCESS_DISTRICTS: return {...currentDistrictData,districts: action.districts ,loading: action.loading, councilMembersReadyToLoad: true, selectedDistricts: action.districts};
        case actions.SUCCESS_COUNCIL_MEMBERS: return {...currentDistrictData, councilMembers: action.councilMembers ,loading: false, councilMemberOfficeInfoReadyToLoad: true, participatoryBudgetTrackerReadyToLoad: true};
        case actions.SUCCESS_PARTICIPATORY_BUDGET_TRACKER: return {...currentDistrictData, participatoryBudgetTracker: action.participatoryBudgetTracker, loading: false, participatoryBudgetReadyToLoad: true};        
        case actions.SUCCESS_PARTICIPATORY_BUDGET: return {...currentDistrictData, participatoryBudget: action.participatoryBudget, selectedBudgetItems: action.selectedBudgetItems,loading: false, dataLoaded: true, filtered: false};
        case actions.FILTER_DATA: return {...currentDistrictData, selectedBudgetItems: action.selectedBudgetItems, filtered: !currentDistrictData.filtered}
        case actions.FAIL_DATA: return {...currentDistrictData,error: action.error,loading: false};
        case actions.MEMO_DISTRICTS_DATA: return {...currentDistrictData, memoDistrictsData: {...currentDistrictData.memoDistrictsData, [action.district]: action.clickedDistrict}};
    }
}

export const mapStateReducer = (currentMap, action) => {
    switch(action.type){        
        case actions.MOVE: return {...currentMap, zoom: Number(action.zoom), lat: Number(action.lat), lng: Number(action.lng)};
        case actions.CLICKED_ITEM: return {...currentMap, zoom: 13, lat: Number(action.lat), lng: Number(action.lng), clickedItem: action.clickedItem, clickedItemId: action.clickedItemId};
        case actions.CLEAR_MAP_STATE: return {...currentMap, clickedItem: null, clickedItemId: null, clickedDistrict: null, clickedDistrictId: null};
        case actions.CLICKED_DISTRICT_ID: return {...currentMap, clickedDistrictId: action.clickedDistrictId, zoom: 11.5, lat: Number(action.lat), lng: Number(action.lng)};
        case actions.CLEAR_CLICKED_ITEM: return {...currentMap, clickedItem: null, clickedItemId: null};
        case actions.CLICKED_DISTRICT_START: return {...currentMap, clickedDistrictLoading: true, clickedDistrict: null};
        case actions.CLICKED_DISTRICT_SUCCESS: return {...currentMap, clickedDistrict: action.clickedDistrict, clickedDistrictLoading: false};
        case actions.CLICKED_DISTRICT_FAIL: return {...currentMap, error: error, clickedDistrictLoading: false};
        case actions.SET_MAP: return {...currentMap, stateMap: action.stateMap};
    }
}

export const controlsReducer = (currentControls, action) => {
    switch(action.type){                
        case actions.UPDATE_CATEGORY: return {...currentControls, category: action.category};
        case actions.UPDATE_DISTRICT: return {...currentControls, district: action.district};
        case actions.UPDATE_YEAR: return {...currentControls, year: action.year};
        case actions.UPDATE_AGENCY: return {...currentControls, agency: action.agency};
        case actions.UPDATE_STATUS: return {...currentControls, status: action.status};
        case actions.CLEAR_CONTROLS: return {...currentControls, agency: '', status: '',year: '', category: '', district: ''};
    }
}

export const sidebarReducer = (currentItem, action) => {
    switch(action.type){
        case actions.CLICKED_ITEM_REDUCER: return {...currentItem, clickedItem: action.clickedItem};
        case actions.CLICKED_DISTRICT_REDUCER: return {...currentItem, clickedDistrict: action.clickedDistrict};
        case actions.CLEAR_CLICKED_DISTRICT_REDUCER: return {...currentItem, clickedDistrict: null};
        case actions.CLEAR_CLICKED_ITEM_REDUCER: return {...currentItem, clickedItem: null};
        case actions.ZOOM_REDUCER: return {...currentItem, zoom: action.zoom};
    }
}
