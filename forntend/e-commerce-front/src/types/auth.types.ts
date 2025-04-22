  // src/types/auth.types.ts

import { User } from "./user.types";


export interface LoginCredentials {
    username: string;
    password: string;
}


export interface LoginResponse {
    user: User;
    token: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

  

