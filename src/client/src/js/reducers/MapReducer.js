import  {
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
                selected: action.selected,
                drawerOpen: true,
                points: state.points,
                suburbs: state.points,
                suburbData: state.suburbData,
                userData: state.userData,
                melbData: state.melbData,
            }
        case SELECT_AREA:
            console.log(action.selected)
            return {
                selected: action.selected,
                drawerOpen: true,
                points: state.points,
                suburbs: state.points,
                suburbData: state.suburbData,
                userData: state.userData,
                melbData: state.melbData,
            }
        case STATS_DRAWER:
            return {
                selected: state.selected,
                drawerOpen: false,
                points: state.points,
                suburbs: state.points,
                suburbData: state.suburbData,
                userData: state.userData,
                melbData: state.melbData,
            }
        case GET_POINTS:
            return state;
        case GET_MELBOURNE_DATA:
            return state;
        case GET_SUBURB_DATA:
            return state;
        case GET_USER_HISTORY:
            return state;
        default:
            return state;
    }
}

export default MapReducer;