// src/components/product/ProductGallery.tsx
import React, { useState } from 'react';
import { Product } from '../../types/product.types';

interface ProductGalleryProps {
  product: Product;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
  // In real app, product would have multiple images
  const images = [
    product.image,
    'https://via.placeholder.com/600x400?text=Product+Image+2',
    'https://via.placeholder.com/600x400?text=Product+Image+3',
    'https://via.placeholder.com/600x400?text=Product+Image+4'
  ];
  
  const [mainImage, setMainImage] = useState(images[0]);
  
  return (
    <div className="p-4">
      <div className="relative pb-[75%] mb-4 overflow-hidden rounded-lg bg-gray-100">
        <img
          src={mainImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setMainImage(image)}
            className={`relative pb-[75%] overflow-hidden rounded border-2 ${
              mainImage === image ? 'border-indigo-500' : 'border-transparent'
            }`}
          >
            <img
              src={image}
              alt={`${product.name} - View ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;