/*
COMP90024
Team 11
Marco Marasco - 834882
Austen McClernon - 834063
Sam Mei - 1105817
Cameron Wong - 1117840
*/

import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "../reducers/index";
import { composeWithDevTools } from "redux-devtools-extension";

const persistConfig = {
  key: "root",
  storage,
};
const middleware = [logger, thunk];
const persistedReducer = persistReducer(persistConfig, rootReducer);
const composerEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  persistedReducer,
  composerEnhancer(applyMiddleware(...middleware))
);

export const persistor = persistStore(store);
