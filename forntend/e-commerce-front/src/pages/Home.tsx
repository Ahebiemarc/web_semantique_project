// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import SearchBar from '../components/common/SearchBar';
import ProductGrid from '../components/home/ProductGrid';
import ProductFilters from '../components/home/ProductFilters';
import Loader from '../components/common/Loader';

const Home: React.FC = () => {

    console.log('hom');
    
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchQuery = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const { products, loading, error, search, updateFilters } = useProducts();
  
  useEffect(() => {
    if (initialSearchQuery) {
      search(initialSearchQuery);
    }
  }, [initialSearchQuery]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    search(query);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to SemanticShop</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Discover products tailored to your preferences with our semantic recommendation system.
        </p>
      </div>
      
      <div className="md:hidden mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <ProductFilters onFilterChange={updateFilters} />
        </div>
        
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-yellow-50 p-6 rounded-md text-center">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">No products found</h3>
              <p className="text-yellow-700">
                {searchQuery ? `No results for "${searchQuery}". Try a different search term or browse categories.` : 'Try applying different filters or check back later for new products.'}
              </p>
            </div>
          ) : (
            <>
              {searchQuery && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Search results for "{searchQuery}"
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {products.length} products found
                  </p>
                </div>
              )}
              <ProductGrid products={products} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;