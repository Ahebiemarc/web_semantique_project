  // src/types/user.types.ts
  
  export interface User {
    id: string;
    username: string;
    email: string;
  }
  
  export interface UserPreferences {
    favoriteCategories: string[];
    recentlyViewedProducts: string[];
  }