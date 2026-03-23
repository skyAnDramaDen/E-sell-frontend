import React, {createContext, useState, useEffect, ReactNode, useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRouter} from "expo-router";
import { io, Socket } from "socket.io-client";

import { base_url } from "../src/config/local";

import {
    UserDTO,
    AuthResponse,
    LoginRequestBody,
    RegisterRequestBody,
    AuthContextType,
} from "../types/interfaces";
import { login_request, register_request } from "../services/authService";
import { get_user } from "../services/userService";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const initSocket = async () => {
            await loadStorage();
            if (!user) {
                return;
            } else if (user && token && !socket) {
                try {
                    const newSocket = io(base_url, {
                        autoConnect: false,
                        auth: { token },
                    });

                    newSocket.connect();
                    setSocket(newSocket);
                } catch (error) {
                    console.error("❌ Socket creation exception:", error);
                }
            } else {
                return;
            }
        };
        initSocket();

        // return () => {
        //     if (socket) {
        //         socket.disconnect();
        //         setSocket(null);
        //     }
        // };
    }, [user, token]);

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
            return false;
        }
    };

    const reload_user = async (id: string) => {
        let user_fetched;
        if (user) {
            user_fetched = await get_user(id);
        }

        if (user_fetched) {
            setUser(user_fetched);
        }
    }

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
            const fallback: AuthResponse = {
                message: "The email and passwords do not match",
                success: false,
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
                success: false,
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
        setSocket(null);
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('token');
        setTimeout( () => {
            router.replace('/login');
        }, 500)
    };

    const authValue = useMemo(() => ({
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        loadStorage,
        reload_user,
        setUser,
        socket,
    }), [
        user,
        token,
        loading,
        error,
        socket,
    ]);

    return (
        <AuthContext.Provider
            value={authValue}
        >
            {children}
        </AuthContext.Provider>
    );
};
