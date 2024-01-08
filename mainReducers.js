// reducers.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  filteredList: [],
  IsFilteredListEmpty: false,
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
  },
});

export const {setFilteredList, setIsFilteredListEmpty} = mainSlice.actions;
export default mainSlice.reducer;
