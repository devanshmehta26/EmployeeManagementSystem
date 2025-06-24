import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Employee {
  id: number;
  name: string;
  email: string;
  designation: string;
  salary: number;
  createdAt: string;
  updatedAt: string;
}

interface EmployeesState {
  employees: Employee[];
  totalPages: number;
  error: string | null;
}

const initialState: EmployeesState = {
  employees: [],
  totalPages: 0,
  error: null,
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees(state, action: PayloadAction<Employee[]>) {
      state.employees = action.payload; 
    },
    setTotalPages(state, action: PayloadAction<number>) {
      state.totalPages = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setEmployees, setTotalPages, setError } = employeesSlice.actions;
export default employeesSlice.reducer;
