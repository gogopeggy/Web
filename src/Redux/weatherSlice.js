import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  weather: [],
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    getWeather: (state, action) => {
      state.weather = action.payload;
    },
  },
});

export const { getWeather } = weatherSlice.actions;

export default weatherSlice.reducer;
