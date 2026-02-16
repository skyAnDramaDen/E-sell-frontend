export interface UserDTO {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string
    profileImageUri?: string | null;
}

export interface RegisterRequestBody {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequestBody {
    email: string;
    password: string;
}

export interface AuthResponse {
    token?: string;
    message: string;
    user?: UserDTO;
}

export type CategoryNode = {
    id: number;
    name: string;
    children: CategoryNode[];
};


export interface Product {
    id: string;
    name: string;
    description: string;
    condition: string;
    price: number;
    availability: boolean;
    topCategoryId: string;
    topCategory: string;
    subCategoryId: string;
    subCategory: string;
    lowestCategoryId?: string | null;
    lowestCategory?: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    user?: User;
    location?: string | null;
}

export type Products = Product[];

export interface Listing {
    product: Product;
    images: string[];
    message?: string;
    success?: boolean;
}

export type AllListings = Listing[];

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "user" | "admin" | "moderator";
    createdAt: Date;
    updatedAt: Date;
    products?: Product[];
    phoneNumber?: string
    profileImageUri?: string | null;
}

export interface GetUserResponseBody {
    user?: User;
    success: boolean;
}