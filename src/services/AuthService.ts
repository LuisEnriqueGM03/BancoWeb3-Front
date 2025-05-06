import axios from 'axios';
import { LoginRequest } from '../models/dto/LoginRequest';
import { LoginResponse } from '../models/dto/LoginResponse';
import { RegisterRequest } from '../models/dto/RegisterRequest'; 

const BASE_URL = 'http://localhost:8000/banco/auth';

export const AuthService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`${BASE_URL}/login/`, data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<void> => {
    await axios.post(`${BASE_URL}/register/`, data);
  }
};
