// reducers.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  filteredList: [],
  IsFilteredListEmpty: false,
  IsClickedClearAll: false,
  filterItems: 0,
  uniqueEmailId: '',
};

const mainSlice = createSlice({
  name: 'mainSlice',
  initialState,
  reducers: {
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    setIsFilteredListEmpty: (state, action) => {
      state.IsFilteredListEmpty = action.payload;
    },
    setIsClickedClearAll: (state, action) => {
      state.IsClickedClearAll = action.payload;
    },
    setFilterItems: (state, action) => {
      state.filterItems = action.payload;
    },
    setUniqueEmailId: (state, action) => {
      state.uniqueEmailId = action.payload;
    },
  },
});

export const {
  setFilteredList,
  setIsFilteredListEmpty,
  setIsClickedClearAll,
  setFilterItems,
  setUniqueEmailId,
} = mainSlice.actions;
export default mainSlice.reducer;
