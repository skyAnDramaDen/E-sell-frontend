import axios from "axios";

import {
    LoginRequestBody,
    RegisterRequestBody,
    AuthResponse
} from "../types/interfaces";

// const base_url = process.env.REACT_APP_SERVER_URL || "https://localhost:3000";
//TODO: hardcoded my ip address and should make sure to change that in the current git commit and going forward


if (!base_url) {
    throw new Error("Base url not in environment variables");
}

export const api = axios.create({
    baseURL: base_url,
    withCredentials: true,
})

export async function login_request (body: LoginRequestBody): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", body);
    return response.data;
}

export async function register_request (body: RegisterRequestBody): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", body);
    return response.data;
}

