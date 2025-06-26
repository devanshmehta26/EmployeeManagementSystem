import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api/employees',
  withCredentials: true,
});

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  designation: string;
  salary: number;
}

interface UpdateProfileData {
  name: string;
  designation: string;
  salary: number;
  password?: string;
}

 export const api = {

  register: (data: RegisterData) => API.post('/register', data),

  login: (data: LoginData) => API.post('/login', data),

  fetchProfile: () => API.get('/profile'),

  fetchEmployees: (page: number, limit: number, search: string) =>
    API.get(`?page=${page}&limit=${limit}&search=${search}`),

  updateUser: (data: UpdateProfileData) => API.put('/updateUser', data),

  deleteUser: () => API.delete('/deleteUser'),

  logout: () => API.post('/logout', {}),
};
