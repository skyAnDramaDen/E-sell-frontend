import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useAuth } from "../../hooks/useAuth";
import {AuthResponse} from "../../types/interfaces";

import { useRouter } from "expo-router";

export default function RegisterScreen() {
    const { register, loading, error } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            const result: AuthResponse = await register({ name, email, password });

            if (result.token && result.user) {
                router.replace("/(tabs)/index" as any);
            }

        } catch (err) {
            console.error('Register failed:', err);
        }
    };

    return (
        <View className="flex-1 justify-center px-6">
            <Text className="text-2xl font-bold mb-6">Register</Text>

            <Text className="mb-2">Name</Text>
            <TextInput
                className="border border-gray-300 p-3 rounded mb-4"
                value={name}
                onChangeText={setName}
            />

            <Text className="mb-2">Email</Text>
            <TextInput
                className="border border-gray-300 p-3 rounded mb-4"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <Text className="mb-2">Password</Text>
            <TextInput
                className="border border-gray-300 p-3 rounded mb-4"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

            <TouchableOpacity
                className="bg-green-500 p-4 rounded mb-4"
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white text-center">Register</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
