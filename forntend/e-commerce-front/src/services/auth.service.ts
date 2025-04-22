// src/services/auth.service.ts
import api from './api';
import { LoginCredentials, LoginResponse } from '../types/auth.types';
import { User } from '../types/user.types';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const register = async (userData: Omit<User, 'id' | 'preferences'> & { password: string }): Promise<User> => {
  const response = await api.post<User>('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me');
  return response.data;
};