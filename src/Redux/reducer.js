const initialState = {
  weather: {},
};

const reducer = (state = initialState, action) => {
  switch (action) {
    case weather:
      return {
        weather: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
