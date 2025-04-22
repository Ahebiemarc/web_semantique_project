// src/components/home/ProductFilters.tsx
import React, { useState } from 'react';

interface ProductFiltersProps {
  onFilterChange: (filters: Record<string, any>) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  
  // Mock categories (would come from API in real app)
  const categories = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing & Fashion' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'books', name: 'Books & Media' },
    { id: 'sports', name: 'Sports & Outdoors' },
  ];
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = parseInt(e.target.value, 10);
    const newRange = [...priceRange] as [number, number];
    newRange[index] = newValue;
    setPriceRange(newRange);
  };
  
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };
  
  const handleRatingChange = (value: number) => {
    setRating(rating === value ? null : value);
  };
  
  const applyFilters = () => {
    const filters: Record<string, any> = {};
    
    if (priceRange[0] > 0) {
      filters.minPrice = priceRange[0];
    }
    
    if (priceRange[1] < 1000) {
      filters.maxPrice = priceRange[1];
    }
    
    if (selectedCategories.length > 0) {
      filters.categories = selectedCategories;
    }
    
    if (rating) {
      filters.minRating = rating;
    }
    
    onFilterChange(filters);
  };
  
  const resetFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setRating(null);
    onFilterChange({});
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">${priceRange[0]}</span>
          <span className="text-sm text-gray-600">${priceRange[1]}</span>
        </div>
        <div className="flex space-x-4">
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={priceRange[0]}
            onChange={(e) => handlePriceChange(e, 0)}
            className="w-full"
          />
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange(e, 1)}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <input
                id={`category-${category.id}`}
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Rating</h3>
        <div className="flex items-center space-x-1">
          {[4, 3, 2, 1].map((value) => (
            <button
              key={value}
              onClick={() => handleRatingChange(value)}
              className={`flex items-center px-2 py-1 rounded ${
                rating === value ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {value}+ <span className="text-yellow-400 ml-1">★</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={applyFilters}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Apply Filters
        </button>
        <button
          onClick={resetFilters}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;