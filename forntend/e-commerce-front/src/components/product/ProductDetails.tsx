// src/components/product/ProductDetails.tsx
import React, { useState } from 'react';
import { Product } from '../../types/product.types';
import Button from '../common/Button';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  return (
    <div>
      <div className="mb-4">
        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
          {product.categoryID}
        </span>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
      
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-5 h-5 ${
                star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-gray-600 ml-2">({product.reviews.length} reviews)</span>
      </div>
      
      <p className="text-3xl font-bold text-gray-900 mb-6">${product.price.toFixed(2)}</p>
      
      {/*<div className="mb-6">
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </div>*/}
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Availability:</span>
          {product.stock > 0 ? (
            <span className="text-sm text-green-600">In Stock ({product.stock} available)</span>
          ) : (
            <span className="text-sm text-red-600">Out of Stock</span>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
          Quantity
        </label>
        <div className="flex items-center border border-gray-300 rounded-md w-32">
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <input
            id="quantity"
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            className="w-full text-center border-0 focus:ring-0"
          />
          <button
            onClick={increaseQuantity}
            disabled={quantity >= product.stock}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
        <Button
          variant="primary"
          className="flex-1 py-3"
          disabled={product.stock <= 0}
        >
          Add to Cart
        </Button>
        <Button
          variant="outline"
          className="flex-1 py-3"
        >
          Add to Wishlist
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;