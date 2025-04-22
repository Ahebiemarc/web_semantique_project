// src/types/product.types.ts
export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    categoryID: string;
    rating: number;
    stock: number;
    reviews: Review[];
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
  

  

  
 