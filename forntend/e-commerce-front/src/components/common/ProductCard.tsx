// src/components/common/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product.types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

  const id = product.id.split('_')[1]; // "170"

  return (
    <Link to={`/product/${id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative pb-[56.25%]">
          <img 
            src={"https://m.media-amazon.com/images/I/61aYXeVRjZL._AC_UF1000,1000_QL80_.jpg"} 
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 truncate">{product.name}</h3>
            <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
              {product.categoryId}
            </span>
          </div>
          {/*<p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>*/}
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">${product.price.toString()/*.toFixed(2)*/}</span>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              </span>
              {/*<span className="text-gray-700">{product.rating.toFixed(1)}</span>*/}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;