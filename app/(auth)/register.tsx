import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useAuth } from "../../hooks/useAuth";
import {AuthResponse} from "../../types/interfaces";

import { useRouter } from "expo-router";
import {showMessage} from "react-native-flash-message";
import LottieView from "lottie-react-native";

import { validatePassword } from "../../utils/passwordVerifier";

import { username_verifier, email_verifier } from "../../utils/nameVerifier";

export default function RegisterScreen() {
    const { register, loading, error } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerLoading, setRegisterLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            if (!password || !name || !email) {
                showMessage({message: "Please make sure to include all fields", type: "warning", });
                return;
            }

            const emailValid = email_verifier(email);

            if (!emailValid) {
                showMessage({message: "Enter a valid email address!", type: "warning", });
                return;
            }

            const nameIsValid = username_verifier(name);

            if (nameIsValid.hasInvalidSymbol) {
                showMessage({message: "Username should not contain symbols or space characters!", type: "warning", });
                return;
            }

            if (nameIsValid.hasSpace) {
                showMessage({message: "Username should not contain space characters!", type: "warning", });
                return;
            }

            if (!nameIsValid.isLongEnough) {
                showMessage({message: "Username should be at least 5 characters long!", type: "warning", });
                return;
            }

            const passwordIsValid = validatePassword(password);

            if (!passwordIsValid.hasLower) {
                showMessage({message: "Password does not contain a lowercase character!", type: "warning", });
                return;
            }

            if (!passwordIsValid.hasSymbol) {
                showMessage({message: "Password does not contain a special character!", type: "warning", });
                return;
            }

            if (!passwordIsValid.hasUpper) {
                showMessage({message: "Password does not contain an uppercase character!", type: "warning", });
                return;
            }

            if (!passwordIsValid.hasNumber) {
                showMessage({message: "Password does not contain a number!", type: "warning", });
                return;
            }

            if (!passwordIsValid.length) {
                showMessage({message: "Password needs to be at least 8 characters long!", type: "warning", });
                return;
            }

            if (passwordIsValid.hasSpace) {
                showMessage({message: "Password cannot contain space characters!", type: "warning", });
                return;
            }
            setRegisterLoading(true);
            let refined_name = name.trim().toLowerCase();
            const result: AuthResponse = await register({ name: refined_name, email, password });
            setRegisterLoading(false);

            if (result.token && result.user) {
                router.replace("/");
            } else {
                showMessage({ message: `${result.message}`, type: "danger" });
            }

        } catch (err) {
            setRegisterLoading(false);
            console.error('Register failed:', err);
        }
    };

    return (
        <View className="flex-1 justify-center px-6">
            {
                registerLoading ? (
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
                )
            }

        </View>
    );
}
