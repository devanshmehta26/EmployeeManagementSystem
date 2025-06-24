import { configureStore } from '@reduxjs/toolkit';
import employeesReducer from '../Slice/EmployeeSlice';
import authReducer from '../Slice/AuthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees:employeesReducer
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;