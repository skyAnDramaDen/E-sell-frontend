import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ViewStyle,
    TextStyle
} from 'react-native';

import { useAuth } from "../../hooks/useAuth";
import {AuthResponse} from "../../types/interfaces";
import { useRouter } from "expo-router";
import {showMessage} from "react-native-flash-message";
import LottieView from "lottie-react-native";

import { validatePassword } from "../../utils/passwordVerifier";
import { username_verifier, email_verifier } from "../../utils/nameVerifier";

import { theme } from "../../src/theme/theme";

export default function RegisterScreen() {
    const { register, loading, error } = useAuth();
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerLoading, setRegisterLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            if (!password || !username || !email) {
                showMessage({message: "Please make sure to include all fields", type: "warning", });
                return;
            }

            const emailValid = email_verifier(email);

            if (!emailValid) {
                showMessage({message: "Enter a valid email address!", type: "warning", });
                return;
            }

            const nameIsValid = username_verifier(username);

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
            let refined_username = username.trim().toLowerCase();

            const result: AuthResponse = await register({ username: refined_username, email, password: password.trim() });

            setRegisterLoading(false);

            if (result.token && result.user) {
                router.replace("/");
            } else {
                showMessage({ message: `${result.message}`, type: "danger" });
            }

        } catch (err) {
            setRegisterLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={localStyles.loadingContainer}>
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
        <View style={localStyles.outerContainer}>
            <View style={localStyles.formWrapper}>
                <Text style={localStyles.title as TextStyle}>Register</Text>

                <Text style={localStyles.label as TextStyle}>Username</Text>
                <TextInput
                    style={localStyles.input}
                    value={username}
                    onChangeText={setUserName}
                    placeholder="johndoe"
                    placeholderTextColor={theme.colors.textLight}
                />

                <Text style={localStyles.label as TextStyle}>Email</Text>
                <TextInput
                    style={localStyles.input}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="your@email.com"
                    placeholderTextColor={theme.colors.textLight}
                />

                <Text style={localStyles.label as TextStyle}>Password</Text>
                <TextInput
                    style={localStyles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor={theme.colors.textLight}
                />

                <TouchableOpacity
                    style={[localStyles.button, loading && localStyles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={localStyles.buttonText}>Register</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={localStyles.registerLink as ViewStyle}
                    onPress={() => router.back()}
                    disabled={loading}
                >
                    <Text style={localStyles.registerText as TextStyle}>
                        <Text style={localStyles.registerHighlight as TextStyle}>Back to login</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const localStyles = StyleSheet.create({
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
    formWrapper: {},
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
        backgroundColor: theme.colors.success,
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
});