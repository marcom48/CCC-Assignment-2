/*

COMP90024
Team 11
Marco Marasco - 834882
Austen McClernon - 834063
Sam Mei - 1105817
Cameron Wong - 1117840
*/

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
} from "../constants/action-types";

export const selectPoint = (e) => ({
  type: SELECT_POINT,
  selected: e,
});

export const selectArea = (e) => ({
  type: SELECT_AREA,
  selected: e,
});

export const getPoints = () => ({
  type: GET_POINTS,
});

export const getUserHistory = (user) => ({
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

export const getAreaData = () => ({
  type: GET_AREA_DATA,
});

export const setAreaData = (data) => ({
  type: SET_AREA_DATA,
  data: data,
});
