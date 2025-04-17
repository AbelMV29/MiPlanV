export interface UserRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
}

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    isActive?: boolean;
    createdAt?: string;
    role?: string;
}

export interface AuthUser {
    userId: number;
    name: string;
    email: string;
    token: string;
    phoneNumber?: string;
    role?: string;
}

export interface GoogleLoginRequest {
    email: string;
    name: string;
    googleId: string;
    imageUrl: string;
    phoneNumber?: string;
} 