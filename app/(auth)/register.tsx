import {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    SafeAreaView
} from 'react-native';

import {useAuth} from "../../hooks/useAuth";
import {AuthResponse} from "../../types/interfaces";
import {useRouter} from "expo-router";
import {showMessage} from "react-native-flash-message";
import LottieView from "lottie-react-native";

import {validatePassword} from "../../utils/passwordVerifier";
import {username_verifier, email_verifier} from "../../utils/nameVerifier";

import {useTheme} from "../../hooks/useTheme";
import {styles as globalStyles} from "../../src/styles/styles";

export default function RegisterScreen() {
    const {register, loading} = useAuth();
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerLoading, setRegisterLoading] = useState(false);
    const router = useRouter();

    const {theme} = useTheme();
    const pageStyles = globalStyles(theme);

    const handleSubmit = async () => {
        try {
            if (!password || !username || !email) {
                showMessage({message: "Please make sure to include all fields", type: "warning",});
                return;
            }

            const emailValid = email_verifier(email);

            if (!emailValid) {
                showMessage({message: "Enter a valid email address!", type: "warning",});
                return;
            }

            const nameIsValid = username_verifier(username);

            if (nameIsValid.hasInvalidSymbol) {
                showMessage({message: "Username should not contain symbols or space characters!", type: "warning",});
                return;
            }

            if (nameIsValid.hasSpace) {
                showMessage({message: "Username should not contain space characters!", type: "warning",});
                return;
            }

            if (!nameIsValid.isLongEnough) {
                showMessage({message: "Username should be at least 5 characters long!", type: "warning",});
                return;
            }

            const passwordIsValid = validatePassword(password);

            if (!passwordIsValid.hasLower) {
                showMessage({message: "Password does not contain a lowercase character!", type: "warning",});
                return;
            }

            if (!passwordIsValid.hasSymbol) {
                showMessage({message: "Password does not contain a special character!", type: "warning",});
                return;
            }

            if (!passwordIsValid.hasUpper) {
                showMessage({message: "Password does not contain an uppercase character!", type: "warning",});
                return;
            }

            if (!passwordIsValid.hasNumber) {
                showMessage({message: "Password does not contain a number!", type: "warning",});
                return;
            }

            if (!passwordIsValid.length) {
                showMessage({message: "Password needs to be at least 8 characters long!", type: "warning",});
                return;
            }

            if (passwordIsValid.hasSpace) {
                showMessage({message: "Password cannot contain space characters!", type: "warning",});
                return;
            }
            setRegisterLoading(true);
            let refined_username = username.trim().toLowerCase();

            const result: AuthResponse = await register({username: refined_username, email, password: password.trim()});

            setRegisterLoading(false);

            if (result.token && result.user) {
                router.replace("/");
            } else {
                showMessage({message: `${result.message}`, type: "danger"});
            }

        } catch (err) {
            setRegisterLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={pageStyles.loadingContainer}>
                <LottieView
                    source={require("../../assets/loading.json")}
                    autoPlay
                    loop
                    style={{width: 200, height: 200}}
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
            <View style={pageStyles.outerContainer}>
                <View style={pageStyles.formWrapper}>
                    <Text style={pageStyles.registerTitle as TextStyle}>Register</Text>

                    <Text style={pageStyles.registerLabel as TextStyle}>Username</Text>
                    <TextInput
                        style={pageStyles.registerInput}
                        value={username}
                        onChangeText={setUserName}
                        placeholder="johndoe"
                        placeholderTextColor={theme.colors.textLight}
                    />

                    <Text style={pageStyles.registerLabel as TextStyle}>Email</Text>
                    <TextInput
                        style={pageStyles.registerInput}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholder="your@email.com"
                        placeholderTextColor={theme.colors.textLight}
                    />

                    <Text style={pageStyles.registerLabel as TextStyle}>Password</Text>
                    <TextInput
                        style={pageStyles.registerInput}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholder="••••••••"
                        placeholderTextColor={theme.colors.textLight}
                    />

                    <TouchableOpacity
                        style={[pageStyles.registerButton, loading && pageStyles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff"/>
                        ) : (
                            <Text style={pageStyles.buttonText}>Register</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={pageStyles.registerLink as ViewStyle}
                        onPress={() => router.back()}
                        disabled={loading}
                    >
                        <Text style={pageStyles.registerText as TextStyle}>
                            <Text style={pageStyles.registerHighlight as TextStyle}>Back to login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}