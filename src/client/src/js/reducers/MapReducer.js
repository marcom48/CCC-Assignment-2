
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
} from '../constants/action-types';


const initialState = {
    selected: null,
    drawerOpen: false,
    points: null,
    suburbs: null,
    suburbData: null,
    userData: null,
    melbData: null,
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
        default:
            return state;
    }
}

export default MapReducer;