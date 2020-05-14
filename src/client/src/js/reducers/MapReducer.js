
import * as melb_geo from '../constants/melbourne.geojson'
import * as melb_points from '../constants/sampleTwitter.json'
import { jsonGeoJson } from '../helpers';

import {

    SELECT_POINT,
    SELECT_AREA,
    GET_POINTS,
    GET_USER_HISTORY,
    GET_SUBURB_DATA,
    GET_MELBOURNE_DATA,
    STATS_DRAWER,
    GET_AREA_DATA,
    SET_AREA_DATA,
} from '../constants/action-types';


const initialState = {
    selected: null,
    drawerOpen: false,
    points: null,
    suburbs: null,
    suburbData: null,
    userData: null,
    melbData: null,
    areaData: null,
}

const MapReducer = (state = initialState, action) => {
    switch (action.type) {
        case SELECT_POINT:
            return {
                ...state,
                selected: action.selected,
                drawerOpen: true,
            }
        case SELECT_AREA:
            return {
                ...state,
                selected: action.selected,
                drawerOpen: true,
            }
        case STATS_DRAWER:
            return {
                ...state,
                drawerOpen: false,
            }
        case GET_POINTS:
            return state;
        case GET_MELBOURNE_DATA:
            return state;
        case GET_SUBURB_DATA:
            return state;
        case GET_USER_HISTORY:
            return {
                ...state,
                userData: action.selected
            };
        case SET_AREA_DATA:
            return {
                ...state,
                areaData: action.data,
            };
        default:
            return state;
    }
}

export default MapReducer;