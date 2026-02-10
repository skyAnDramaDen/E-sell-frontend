import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    UserDTO,
    AuthResponse,
    LoginRequestBody,
    RegisterRequestBody
} from "../types/interfaces";
import { login_request, register_request } from "../services/authService";

interface AuthContextType {
    user: UserDTO | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    login: (body: LoginRequestBody) => Promise<AuthResponse>;
    register: (body: RegisterRequestBody) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    loadStorage: () => Promise<boolean>;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {

        loadStorage();
    }, []);

    const loadStorage = async (): Promise<boolean> => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            const storedToken = await AsyncStorage.getItem('token');
            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);

                return true;
            }

            return false;
        } catch (err) {
            console.error('Failed to load user from storage', err);
            return false;
        }
    };


    const login = async (body: LoginRequestBody): Promise<AuthResponse> => {
        try {
            setLoading(true);
            setError(null);

            const response: AuthResponse = await login_request(body);
            if (response.token && response.user) {
                setUser(response.user);
                setToken(response.token);
                await AsyncStorage.setItem('user', JSON.stringify(response.user));
                await AsyncStorage.setItem('token', response.token);
            } else {
                setError(response.message || 'Login failed');
            }

            return response;
        } catch (error: any) {
            console.error(error);
            const fallback: AuthResponse = {
                message: error.message || 'Login failed',
            }
            setError(error.message || 'An error occurred');
            return fallback;
        } finally {
            setLoading(false);
        }
    };


    const register = async (body: RegisterRequestBody): Promise<AuthResponse> => {
        try {
            setLoading(true);
            setError(null);
            const response: AuthResponse = await register_request(body);
            if (response.token && response.user) {
                setUser(response.user);
                setToken(response.token);
                await AsyncStorage.setItem('user', JSON.stringify(response.user));
                await AsyncStorage.setItem('token', response.token);
            } else {
                setError(response.message || 'Registration failed');
            }

            return response;
        } catch (err: any) {
            setError(err.message || 'An error occurred');
            const fallback: AuthResponse = {
                message: err.message || 'An error occurred',
            };
            setError(fallback.message);
            return fallback;
        } finally {
            setLoading(false);
        }
    };


    const logout = async () => {
        setUser(null);
        setToken(null);
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('token');
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                error,
                login,
                register,
                logout,
                loadStorage,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
