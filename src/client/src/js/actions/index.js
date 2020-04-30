import  {
    SELECT_POINT,
    SELECT_AREA,
    GET_POINTS,
    GET_USER_HISTORY,
    GET_SUBURB_DATA,
    GET_MELBOURNE_DATA,
    STATS_DRAWER,
} from '../constants/action-types';


export const selectPoint = e => ({
    type: SELECT_POINT,
    selected: e,
});

export const selectArea = e => ({
    type: SELECT_AREA,
    selected: e,
});

export const getPoints = () => ({
    type: GET_POINTS,

});

export const getUserHistory = user => ({
    type: GET_USER_HISTORY,
    selected: user,
});

export const getSuburbData = () => ({
    type: GET_SUBURB_DATA,
});

export const getMelbourneData = () => ({
    type: GET_MELBOURNE_DATA,
});

export const openStatsDrawer = (open) => ({
    type: STATS_DRAWER,
    open: open,
});