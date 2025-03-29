import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currency: typeof window !== "undefined" && localStorage.getItem("currency")
    ? JSON.parse(localStorage.getItem("currency")) 
    : { name: "USD", nb: 1 }, // Default values
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;  // action.payload should be { name, nb }
      if (typeof window !== "undefined") {
        localStorage.setItem("currency", JSON.stringify(state.currency));  
      }
    },
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
