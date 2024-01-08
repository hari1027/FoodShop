// store.js
import {configureStore, combineReducers} from '@reduxjs/toolkit';
import mainReducers from './mainReducers';

const Reducers = combineReducers({
  main: mainReducers,
});

export const rootReducer = (state, action) => {
  return Reducers(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export default store;
