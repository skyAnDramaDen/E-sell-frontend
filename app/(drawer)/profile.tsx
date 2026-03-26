import React, {useEffect, useRef, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context"
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Pressable,
    Modal,
    ViewStyle, StatusBar,
    Animated
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useRouter} from "expo-router";
import {useAuth} from "../../hooks/useAuth";
import {takePhoto, pickOneImage} from "../../utils/imagePicker";

import { styles as globalStyles } from "../../src/styles/styles";
import {edit_user, get_user} from "../../services/userService";
import {Ionicons} from "@expo/vector-icons";

import {showMessage} from "react-native-flash-message";
import {useFocusEffect} from "expo-router";
import {UserDTO, GetUserResponseBody} from "../../types/interfaces";
import {useTheme} from "../../hooks/useTheme";

export default function Profile() {
    const {login, loading, error, user, reload_user} = useAuth();
    const [editMode, setEditMode] = useState(false);
    const router = useRouter();
    const [image, setImage] = useState<string>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [shouldOpenLibrary, setShouldOpenLibrary] = useState(false);
    const { isDark, toggleTheme, theme } = useTheme();

    const pageStyles = globalStyles(theme);

    const [userData, setUserData] = useState<UserDTO>({
        id: "",
        username: "",
        email: "",
        phoneNumber: "",
        profileImageUri: "",
    });

    const updateUserData = (key: keyof typeof userData, value: string) => {
        setUserData(prev => ({...prev, [key]: value}));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        if (userData.phoneNumber) {
            if (userData.phoneNumber .length < 11) {
                showMessage({message: "Phone number is less than eleven digits!", type: "danger",});
                return;
            }
        }

        if (image) {
            formData.append("image", {
                uri: userData.profileImageUri,
                type: "image/jpeg",
                name: `${userData.id}_profile_photo.jpg`,
            } as any);
        }

        formData.append("email", userData.email);
        formData.append("id", userData.id);
        formData.append("username", userData.username);
        formData.append("phoneNumber", userData.phoneNumber ? userData.phoneNumber : "");
        formData.append("profileImageUri", userData.profileImageUri ? userData.profileImageUri : "");

        const response = await edit_user(formData);

        if (response.success === true) {
            setUserData({
                id: response.user.id,
                username: response.user.username,
                email: response.user.email,
                phoneNumber: response.user.phoneNumber,
                profileImageUri: response.user.profileImageUri,
            });
            setEditMode(false);
            showMessage({message: "Profile updated successfully", type: "success",});
        } else {
            showMessage({message: "Failed to update profile!", type: "danger",});
        }
    };

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        let fetched_user;
        (async () => {
            if (user) {
                fetched_user = await get_user(user.id);

                if (fetched_user) {
                    const fetched_user_number = fetched_user.user.phoneNumber || "";
                    setUserData({
                        id: fetched_user.user.id,
                        username: fetched_user.user.username,
                        email: fetched_user.user.email,
                        phoneNumber: fetched_user_number,
                        profileImageUri: fetched_user.user.profileImageUri,
                    });
                }
            }
        })()
    }, [])

    useEffect(() => {
        if (!editMode) {
            setUserData({
                id: userData.id,
                username: userData.username,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                profileImageUri: userData.profileImageUri,
            })
        }
    }, [editMode])

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            const fetch_user = async () => {
                if (!user) {
                    return;
                }
                let fetched_user = await get_user(user.id);

                if (!fetched_user) {
                    setUserData({
                        id: fetched_user.user?.id ?? "",
                        username: fetched_user.user?.username ?? "",
                        email: fetched_user.user?.email ?? "",
                        phoneNumber: fetched_user.user?.phoneNumber ?? "",
                    })
                }
            }

            fetch_user();

            return () => {
                isActive = false;
            };
        }, [user])
    );

    return (
        <LinearGradient
            colors={['#f8f9fa', '#e9ecef']}
            style={{ flex: 1 }}
        >
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                <ScrollView
                    contentContainerStyle={[pageStyles.scrollContainer as ViewStyle]}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={pageStyles.centered}>
                        <View style={[pageStyles.profileCard as ViewStyle]}>
                            <View style={pageStyles.cardHeader as ViewStyle}>
                                <TouchableOpacity
                                    onPress={() => router.replace('/(tabs)' as any)}
                                    style={pageStyles.iconButton as ViewStyle}
                                >
                                    <Ionicons name="home-outline" size={24} color={theme.colors.text} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setEditMode(!editMode)}
                                    activeOpacity={0.8}
                                    style={pageStyles.profileEditButton}
                                >
                                    <LinearGradient
                                        colors={['transparent', 'transparent']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={pageStyles.profileGradientButton}
                                    >
                                        <Text style={[pageStyles.profileEditButtonText, editMode && { color: theme.colors.text }]}>
                                            {editMode ? 'Cancel' : 'Edit'}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

                            <View style={pageStyles.profileImageContainer}>
                                {editMode && (
                                    <Pressable
                                        onPress={() => setShowModal(true)}
                                        style={pageStyles.cameraButtonOverlay}
                                    >
                                        <Ionicons name="camera" size={24} color="#fff" />
                                    </Pressable>
                                )}
                                <Image
                                    source={{
                                        uri:
                                            userData.profileImageUri ||
                                            'https://www.iconsdb.com/icons/download/gray/user-512.png',
                                    }}
                                    style={pageStyles.profileImage}
                                />
                            </View>

                            <Modal
                                visible={showModal}
                                transparent
                                animationType="fade"
                                onRequestClose={() => setShowModal(false)}
                            >
                                <View style={pageStyles.modalOverlay}>
                                    <View style={pageStyles.modalContent}>
                                        <Text style={pageStyles.modalTitle}>Add Profile Image</Text>

                                        <Pressable
                                            onPress={async () => {
                                                setShowModal(false);
                                                setShouldOpenLibrary(true);
                                                const user_image = await pickOneImage();
                                                if (user_image?.assets?.[0]?.uri) {
                                                    setUserData({
                                                        ...userData,
                                                        profileImageUri: user_image.assets[0].uri,
                                                    });
                                                    setImage(user_image.assets[0].uri);
                                                }
                                            }}
                                            style={pageStyles.modalButton}
                                        >
                                            <Text style={pageStyles.modalButtonText}>From Photos</Text>
                                        </Pressable>

                                        <Pressable
                                            onPress={async () => {
                                                const user_img_uri = await takePhoto();
                                                if (user_img_uri) {
                                                    setUserData({
                                                        ...userData,
                                                        profileImageUri: user_img_uri,
                                                    });
                                                    setImage(user_img_uri);
                                                    setShowModal(false);
                                                }
                                            }}
                                            style={pageStyles.modalButton}
                                        >
                                            <Text style={pageStyles.modalButtonText}>Take Picture</Text>
                                        </Pressable>

                                        <Pressable
                                            onPress={() => setShowModal(false)}
                                            style={pageStyles.modalCancelButton}
                                        >
                                            <Text style={pageStyles.modalCancelText}>Cancel</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </Modal>

                            {!editMode ? (
                                <View style={pageStyles.profileInfoContainer as ViewStyle}>
                                    <View style={pageStyles.profileInfoRow}>
                                        <Ionicons name="person-outline" size={20} color={theme.colors.primary} style={pageStyles.infoIcon} />
                                        <Text style={pageStyles.profileLabel}>Username</Text>
                                        <Text style={pageStyles.profileValue}>{userData.username}</Text>
                                    </View>

                                    <View style={pageStyles.profileInfoRow}>
                                        <Ionicons name="call-outline" size={20} color={theme.colors.primary} style={pageStyles.infoIcon} />
                                        <Text style={pageStyles.profileLabel}>Phone</Text>
                                        <Text style={pageStyles.profileValue}>{userData.phoneNumber}</Text>
                                    </View>

                                    <View style={pageStyles.profileInfoRow}>
                                        <Ionicons name="mail-outline" size={20} color={theme.colors.primary} style={pageStyles.infoIcon} />
                                        <Text style={pageStyles.profileLabel}>Email</Text>
                                        <Text style={pageStyles.profileValue}>{userData.email}</Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={pageStyles.profileEditContainer as ViewStyle}>
                                    <View style={pageStyles.profileInputGroup}>
                                        <Text style={pageStyles.inputLabel}>Name</Text>
                                        <View style={pageStyles.profileInputWrapper}>
                                            <TextInput
                                                style={pageStyles.profileInput}
                                                value={userData.username}
                                                onChangeText={(v) => updateUserData('username', v)}
                                                placeholderTextColor={theme.colors.textLight}
                                            />
                                        </View>
                                    </View>

                                    <View style={pageStyles.profileInputGroup}>
                                        <Text style={pageStyles.inputLabel}>Phone</Text>
                                        <View style={pageStyles.profileInputWrapper}>
                                            <TextInput
                                                style={pageStyles.profileInput}
                                                value={userData.phoneNumber}
                                                onChangeText={(v) => updateUserData('phoneNumber', v)}
                                                placeholderTextColor={theme.colors.textLight}
                                                keyboardType="phone-pad"
                                            />
                                        </View>
                                    </View>

                                    <View style={pageStyles.profileInputGroup}>
                                        <Text style={pageStyles.inputLabel}>Email</Text>
                                        <View style={pageStyles.profileInputWrapper}>
                                            <TextInput
                                                style={pageStyles.profileInput}
                                                value={userData.email}
                                                onChangeText={(v) => updateUserData('email', v)}
                                                placeholderTextColor={theme.colors.textLight}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                            />
                                        </View>
                                    </View>

                                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                                        <TouchableOpacity
                                            onPress={handleSubmit}
                                            onPressIn={onPressIn}
                                            onPressOut={onPressOut}
                                            activeOpacity={0.9}
                                        >
                                            <LinearGradient
                                                colors={[theme.colors.primary, theme.colors.secondary]}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                style={pageStyles.profileSaveButton}
                                            >
                                                <Text style={pageStyles.profileSaveButtonText}>Save Changes</Text>
                                                <Ionicons name="checkmark" size={20} color="#fff" style={{ marginLeft: 8 }} />
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </Animated.View>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}
