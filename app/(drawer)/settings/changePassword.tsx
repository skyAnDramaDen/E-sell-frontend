import React, {useState} from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Switch,
    SafeAreaView,
    StyleSheet,
    TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LinearGradient} from 'expo-linear-gradient';
import {theme} from '../../../src/theme/theme';
import {styles as globalStyles} from '../../../src/styles/styles';
import {SettingItemProps, SettingToggleProps, ChangePasswordPayload} from "../../../types/interfaces";
import {showMessage} from "react-native-flash-message";
import { change_user_password } from "../../../services/userService";

import {validatePassword, passwordsMatch} from "../../../utils/passwordVerifier";

import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useNavigation, useLocalSearchParams, useRouter} from "expo-router";
import MultiActionButton from "../../../components/MultiActionButton";
import {styles} from "../../../src/styles/styles";

import { useAuth } from "../../../hooks/useAuth";

export default function ChangePassword() {
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [passwordIsValid, setPasswordIsValid] = useState(false);
    const [confirmedPasswordIsValid, setConfirmedPasswordIsValid] = useState(false);
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const { login, loading, error, user } = useAuth();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit () {
        const passwordIsValid = validatePassword(password);
        const confirmedPasswordIsValid = validatePassword(confirmedPassword);

        const passwords_match = passwordsMatch(password, confirmedPassword)

        if (!password || !confirmedPassword) {
            showMessage({message: "Password missing!", type: "warning", });
            return;
        }

        if (!passwords_match) {
            showMessage({message: "Passwords do not match!", type: "warning", });
            return;
        } else {
            if (!passwordIsValid.hasLower || !confirmedPasswordIsValid.hasLower) {
                showMessage({message: "Password does not contain a lowercase character!", type: "warning", });
                return;
            }

            if (!passwordIsValid.hasSymbol || !confirmedPasswordIsValid.hasSymbol) {
                showMessage({message: "Password does not contain a special character!", type: "warning", });
                return;
            }

            if (!passwordIsValid.hasUpper || !confirmedPasswordIsValid.hasUpper) {
                showMessage({message: "Password does not contain an uppercase character!", type: "warning", });
                return;
            }

            if (!passwordIsValid.hasNumber || !confirmedPasswordIsValid.hasNumber) {
                showMessage({message: "Password does not contain a number!", type: "warning", });
                return;
            }

            if (!passwordIsValid.length || !confirmedPasswordIsValid.length) {
                showMessage({message: "Password needs to be at least 8 characters long!", type: "warning", });
                return;
            }

            if (passwordIsValid.hasSpace || confirmedPasswordIsValid.hasSpace) {
                showMessage({message: "Password cannot contain space characters!", type: "warning", });
                return;
            }
            showMessage({message: "Passwords  match!", type: "success", });
            if (user) {
                const payload: ChangePasswordPayload = {
                    id: user.id,
                    password1: password,
                    password2: confirmedPassword,
                }

                const response = await change_user_password(payload);
                if (response.success === true) {
                    showMessage({message: "Password  successfully changed!", type: "success", });
                    setPassword("");
                    setConfirmedPassword("");
                } else {
                    showMessage({message: "Password cannot contain space characters!", type: "warning", });
                }
            }
        }
    }

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={globalStyles.centered}>
                <View style={globalStyles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                        style={globalStyles.menuButton}
                    >
                        <Ionicons name="menu" size={28} color={theme.colors.text} />
                    </TouchableOpacity>

                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.secondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={globalStyles.titleGradient}
                    >
                        <Text style={globalStyles.title}>Change Password</Text>
                    </LinearGradient>

                    <MultiActionButton
                        name="Back"
                        icon="arrow-back"
                        onPress={() => router.push('/settings')}
                    />
                </View>

                <View style={globalStyles.section}>
                    <View style={globalStyles.inputGroup}>
                        <Text style={globalStyles.label}>Current Password</Text>
                        <View style={globalStyles.inputWrapper}>
                            <TextInput
                                style={globalStyles.input}
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text)
                                }}
                                placeholder="Enter current password"
                                placeholderTextColor={theme.colors.textLight}
                                secureTextEntry ={!showPassword}
                            />
                        </View>
                    </View>

                    <View style={globalStyles.inputGroup}>
                        <Text style={globalStyles.label}>New Password</Text>
                        <View style={globalStyles.inputWrapper}>
                            <TextInput
                                style={globalStyles.input}
                                value={confirmedPassword}
                                onChangeText={(text) => {
                                    setConfirmedPassword(text)
                                }}
                                placeholder="Enter new password"
                                placeholderTextColor={theme.colors.textLight}
                                secureTextEntry ={!showPassword}
                            />
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}
                    style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
                    >
                        <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={24}
                            color="#333"
                        />
                        <Text style={{ marginRight: 50 }}>{ showPassword ? "Hide password" : "Show Password" }</Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                        style={globalStyles.saveButtonWrapper}
                    >
                        <LinearGradient
                            colors={[theme.colors.primary, theme.colors.secondary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={globalStyles.saveButton}
                        >
                            <Text style={globalStyles.saveButtonText}>Update Password</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}


