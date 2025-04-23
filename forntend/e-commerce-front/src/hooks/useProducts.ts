// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { Product } from '../types/product.types';
import { getProducts, searchProducts } from '../services/product.service';

export const useProducts = (initialFilters?: Record<string, any>) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters || {});

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts(filters);
        
        setProducts(data);
        
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

  }, [filters]);

  const search = async (query: string) => {
    if (!query.trim()) {
      const data = await getProducts(filters);
      setProducts(data);
      return;
    }
    
    setLoading(true);
    try {
      const data = await searchProducts(query);
      setProducts(data);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Record<string, any>) => {
    setFilters({ ...filters, ...newFilters });
  };


  return { products, loading, error, search, updateFilters };
};