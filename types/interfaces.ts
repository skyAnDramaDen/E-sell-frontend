import React from "react";
import {Socket} from "socket.io-client";
import {lightTheme} from "../src/theme/theme";

export interface UserDTO {
    id: string;
    username: string;
    email: string;
    phoneNumber?: string
    profileImageUri?: string | null;
}

export interface RegisterRequestBody {
    username: string;
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
    sellerId?: string;
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
    username: string;
    email: string;
    password: string;
    role: "user" | "admin" | "moderator";
    createdAt: Date;
    updatedAt: Date;
    products?: Product[];
    phoneNumber?: string
    profileImageUri?: string | null;
}

export interface AuthContextType {
    user: UserDTO | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    login: (body: LoginRequestBody) => Promise<AuthResponse>;
    register: (body: RegisterRequestBody) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    loadStorage: () => Promise<boolean>;
    reload_user: (id: string) => Promise<void>;
    setUser: (user: any) => void;
    socket: Socket | null;
}

export interface GetUserResponseBody {
    user?: User;
    success: boolean;
}

export interface ChangePasswordPayload {
    id: string;
    password1: string;
    password2: string;
}

export interface Message {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    conversationId: string;
    receiverName: string;
    receiverId: string;
    read: boolean;
    createdAt?: string;
    sender?: User;
    receiver?: User;
    conversation?: Conversation;
}

export interface SaveMessageResponseBody {
    content: string;
    senderId: string;
    conversationId: string;
    read: boolean;
}

export interface Conversation {
    id: string;
    type: ConversationType;
    shopId?: string | undefined;
    sellerId?: string;
    createdAt: Date;
    messages: Message[]
    participant: ConversationParticipant[];
}

export interface ConversationParticipant {
    id: string;
    conversationId: string;
    userId: string;
    conversation?: Conversation;
    user?: User;
    name: string;
    createdAt: Date;
}
export type ConversationParticipants = ConversationParticipant[];

export enum ConversationType {
    SELLER_BUYER = "SELLER_BUYER",
    SHOP_USER = "SHOP_USER",
    SUPPORT = "SUPPORT",
}

export interface CreateConversationParticipantPayload {
    conversationId: string;
    userId: string;
    name: string;
}

export type CreateConversationParticipantPayloads = CreateConversationParticipantPayload[];

export interface CreateConversationPayload {
    type: ConversationType;
    sellerName?: string;
    sellerId?: string;
    buyerId?: string;
    buyerName?: string;
    shopId?: string;
}

export interface ThemeContextType {
    theme: typeof lightTheme;
    isDark: boolean;
    toggleTheme: () => void;
}

export interface ChatContextValue {
    conversations: Conversation[];
    unread: Record<string, number>;
    activeChatId: string | null;
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
}