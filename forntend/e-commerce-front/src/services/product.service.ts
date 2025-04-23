
// src/services/product.service.ts
import api from './api';
import { Product } from '../types/product.types';

export const getProducts = async (filters?: Record<string, any>): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products/show-alls', { params: filters });
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const getRecommendedProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>(`/products/recommendations-par-score-pondere`);
  return response.data;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products/search', { params: { q: query } });
  return response.data;
};