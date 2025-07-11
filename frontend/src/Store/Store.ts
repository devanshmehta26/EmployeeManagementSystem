import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../Slice/AuthSlice';
import employeesReducer from '../Slice/EmployeeSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  employees: employeesReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'employees'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;