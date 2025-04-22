// src/pages/Product.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getRecommendedProducts } from '../services/product.service';
import { Product as ProductType } from '../types/product.types';
import ProductDetails from '../components/product/ProductDetails';
import ProductGallery from '../components/product/ProductGallery';
import ProductReviews from '../components/product/ProductReviews';
import RecommendedProducts from '../components/product/RecommendedProducts';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const productData = await getProductById(id);
        setProduct(productData);
        
        // Fetch recommended products
        const recommendations = await getRecommendedProducts(id);
        setRecommendedProducts(recommendations);
        
        setError(null);
      } catch (error) {
        setError('Failed to load product information. Please try again later.');
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-3">
            {error || 'Product not found'}
          </h2>
          <p className="text-red-700 mb-6">
            The product you're looking for might have been removed or is temporarily unavailable.
          </p>
          <Button 
            variant="primary"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <ProductGallery product={product} />
          </div>
          <div className="md:w-1/2 p-8">
            <ProductDetails product={product} />
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <ProductReviews reviews={product.reviews} />
      </div>
      
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for you</h2>
        <RecommendedProducts products={recommendedProducts} />
      </div>
    </div>
  );
};

export default Product;