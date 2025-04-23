// src/services/auth.service.ts
import api from './api';
import { LoginCredentials, LoginResponse } from '../types/auth.types';
import { User } from '../types/user.types';

export const login = async (credentials: LoginCredentials): Promise<any> => {
  
  try {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  } catch (error) {
    return null
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');

  } catch (error) {
    return;
  }
};

export const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<User | null> => {
  try {
    const response = await api.post<User>('/auth/register', userData);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  
  try {
    const response = await api.get<User>(`users/me`);
    return response.data;
  } catch (error) {
    return null;
  }
};