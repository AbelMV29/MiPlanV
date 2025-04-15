export interface UserRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
}

export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
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