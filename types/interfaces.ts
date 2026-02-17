import React from "react";

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

export interface EditUserPayload {
    user: UserDTO;
    formData: FormData;
}

export interface LoginRequestBody {
    email: string;
    password: string;
}

export interface AuthResponse {
    token?: string;
    message: string;
    user?: UserDTO;
    success: boolean;
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

export interface SettingItemProps {
    icon: string;
    label: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightElement?: React.ReactNode;
}


export interface ProductAndSellerResponseBody {
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
    location: string | null;
    sellerName: string;
    sellerPhoneNumber: string;
    message?: string;
    images: string[]
    success: boolean;
}

export interface MessageAndSuccessResponseBody {
    message: string;
    success: boolean;
}

export interface SettingToggleProps {
    icon: string;
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
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