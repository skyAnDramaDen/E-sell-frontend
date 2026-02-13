import {useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";

export default function LoginScreen() {
    const { login, loading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [loginLoading, setLoginLoading] = useState(false);

    const handleSubmit = async () => {
        setLoginLoading(true);
        try {
            const response = await login({ email, password });

            if (response.token && response.user) {
                setLoginLoading(false);
                // router.replace("/(tabs)/index" as any); for the record this is wrong
                router.replace("/(tabs)" as any);
            }

        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <View className="flex-1 justify-center px-6">
            {
                loginLoading ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text>Hang tight...</Text>
                        <LottieView
                            source={require("../../assets/loading.json")}
                            autoPlay
                            loop
                            style={{ width: 200, height: 200 }}
                        />
                    </View>
                ) : (
                    <View>
                        <Text className="text-2xl font-bold mb-6">Login</Text>

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
                            className="bg-blue-500 p-4 rounded mb-4"
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white text-center">Login</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={loading}
                            onPress={() => {
                                router.push("/(auth)/register")
                            }}
                        >
                            <Text>Not registered?{" "}
                                <Text className="underline text-blue-500">Register here</Text>

                            </Text>
                        </TouchableOpacity>
                    </View>
                )
            }
        </View>
    );
}
