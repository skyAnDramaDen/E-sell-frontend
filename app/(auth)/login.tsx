import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ViewStyle, TextStyle,
    SafeAreaView
} from 'react-native';
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";

import {showMessage} from "react-native-flash-message";
import { useTheme } from "../../hooks/useTheme";
import { styles as globalStyles } from "../../src/styles/styles";

export default function LoginScreen() {
    const { login, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [loginLoading, setLoginLoading] = useState(false);
    const { theme } = useTheme();
    const pageStyles = globalStyles(theme);

    const handleSubmit = async () => {
        setLoginLoading(true);
        try {
            const response = await login({ email, password });

            if (response.token && response.user) {
                setLoginLoading(false);
                router.replace("/(tabs)" as any);
            } else if (!response.success) {
                showMessage({message: "Login failed. Please try again!", type: "danger",});
                setLoginLoading(false);
            } else {
                showMessage({message: "Email and passwords do not match!", type: "danger",});
                setLoginLoading(false);
            }
        } catch (err) {
            showMessage({message: "Login failed!", type: "danger",});
            setLoginLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={pageStyles.loadingContainer as ViewStyle}>
                <LottieView
                    source={require("../../assets/loading.json")}
                    autoPlay
                    loop
                    style={{ width: 200, height: 200 }}
                />
                <Text style={pageStyles.loadingText as TextStyle}>Hang tight...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
            }}
        >
        <View style={pageStyles.outerContainer as ViewStyle}>
            <View style={pageStyles.formWrapper as ViewStyle}>
                <Text style={pageStyles.loginTitle as TextStyle}>Login</Text>

                <Text style={pageStyles.loginLabel as TextStyle}>Email</Text>
                <TextInput
                    style={pageStyles.loginInput as TextStyle}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="somethingcool@gmail.com"
                    placeholderTextColor={theme.colors.textLight}
                />

                <Text style={pageStyles.loginLabel as TextStyle}>Password</Text>
                <TextInput
                    style={pageStyles.loginInput as TextStyle}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor={theme.colors.textLight}
                />

                <TouchableOpacity
                    style={[pageStyles.loginButton as ViewStyle, loading && pageStyles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={pageStyles.loginButtonText as TextStyle}>Login</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={pageStyles.registerLink as ViewStyle}
                    onPress={() => router.push("/(auth)/register")}
                    disabled={loading}
                >
                    <Text style={pageStyles.loginRegisterText as TextStyle}>
                        Don't have an account?{" "}
                        <Text style={pageStyles.registerHighlight as TextStyle}>Register here</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
            </SafeAreaView>
    )
}