import { configureStore } from "@reduxjs/toolkit";
import membershipReducer from "./membershipSlice";

export const store = configureStore({
  reducer: {
    membership: membershipReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
