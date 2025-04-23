// src/types/product.types.ts
export interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    categoryId: string;
  }
  
  export interface Review {
    id: string;
    userId: string;
    userName: string;
    productId: string;
    rating: number;
    reviewText: string;
    date: string;
  }
  
  export interface Category {
    id: string;
    name: string;
  }
  

  

  
 