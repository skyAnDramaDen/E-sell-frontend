import {useEffect, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    ViewStyle, TextStyle
} from 'react-native';
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";

import {showMessage} from "react-native-flash-message";
import {theme} from "../../src/theme/theme";

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
            <View style={localStyles.loadingContainer as ViewStyle}>
                <LottieView
                    source={require("../../assets/loading.json")}
                    autoPlay
                    loop
                    style={{ width: 200, height: 200 }}
                />
                <Text style={localStyles.loadingText as TextStyle}>Hang tight...</Text>
            </View>
        );
    }

    return (
        <View style={localStyles.outerContainer as ViewStyle}>
            <View style={localStyles.formWrapper as ViewStyle}>
                <Text style={localStyles.title as TextStyle}>Login</Text>

                <Text style={localStyles.label as TextStyle}>Email</Text>
                <TextInput
                    style={localStyles.input as TextStyle}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="your@email.com"
                    placeholderTextColor={theme.colors.textLight}
                />

                <Text style={localStyles.label as TextStyle}>Password</Text>
                <TextInput
                    style={localStyles.input as TextStyle}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor={theme.colors.textLight}
                />

                <TouchableOpacity
                    style={[localStyles.button as ViewStyle, loading && localStyles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={localStyles.buttonText as TextStyle}>Login</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={localStyles.registerLink as ViewStyle}
                    onPress={() => router.push("/(auth)/register")}
                    disabled={loading}
                >
                    <Text style={localStyles.registerText as TextStyle}>
                        Don't have an account?{" "}
                        <Text style={localStyles.registerHighlight as TextStyle}>Register here</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const localStyles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        paddingHorizontal: theme.spacing.md,
        marginTop: theme.spacing.xl * 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...theme.typography.body,
        color: theme.colors.text,
        marginTop: theme.spacing.md,
    },
    formWrapper: {

    },
    title: {
        ...theme.typography.h2,
        color: theme.colors.text,
        marginBottom: theme.spacing.lg,
    },
    label: {
        ...theme.typography.caption,
        color: theme.colors.textLight,
        marginBottom: theme.spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.sm,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.text,
        backgroundColor: theme.colors.surface,
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: theme.typography.body.fontSize,
        fontWeight: '600',
        textAlign: 'center',
    },
    registerLink: {
        alignSelf: 'center',
    },
    registerText: {
        // ...theme.typography.body,
        color: theme.colors.text,
    },
    registerHighlight: {
        color: theme.colors.primary,
        textDecorationLine: 'underline',
    },
});