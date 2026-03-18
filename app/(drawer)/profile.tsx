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
import {theme} from "../../src/theme/theme";
import {edit_user, get_user} from "../../services/userService";
import {Ionicons} from "@expo/vector-icons";

import {showMessage} from "react-native-flash-message";
import {useFocusEffect} from "expo-router";
import {UserDTO, GetUserResponseBody} from "../../types/interfaces";

export default function Profile() {
    const {login, loading, error, user, reload_user} = useAuth();
    const [editMode, setEditMode] = useState(false);
    const router = useRouter();
    const [image, setImage] = useState<string>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [shouldOpenLibrary, setShouldOpenLibrary] = useState(false);

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

    useEffect(() => {
        // console.log(userData);
        console.log(editMode);
    }, [userData, editMode]);

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
                    const fetched_user_number = "0" + fetched_user.user.phoneNumber;
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
                    contentContainerStyle={[globalStyles.scrollContainer as ViewStyle, { paddingBottom: 30 }]}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={globalStyles.centered as ViewStyle}>
                        <View style={[globalStyles.card as ViewStyle, localStyles.card]}>
                            <View style={globalStyles.cardHeader as ViewStyle}>
                                <TouchableOpacity
                                    onPress={() => router.replace('/(tabs)' as any)}
                                    style={globalStyles.iconButton as ViewStyle}
                                >
                                    <Ionicons name="home-outline" size={24} color={theme.colors.text} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setEditMode(!editMode)}
                                    activeOpacity={0.8}
                                    style={localStyles.editButton}
                                >
                                    <LinearGradient
                                        colors={['transparent', 'transparent']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={localStyles.gradientButton}
                                    >
                                        <Text style={[localStyles.editButtonText, editMode && { color: theme.colors.text }]}>
                                            {editMode ? 'Cancel' : 'Edit'}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

                            <View style={localStyles.profileImageContainer}>
                                {editMode && (
                                    <Pressable
                                        onPress={() => setShowModal(true)}
                                        style={localStyles.cameraButtonOverlay}
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
                                    style={localStyles.profileImage}
                                />
                            </View>

                            <Modal
                                visible={showModal}
                                transparent
                                animationType="fade"
                                onRequestClose={() => setShowModal(false)}
                            >
                                <View style={localStyles.modalOverlay}>
                                    <View style={localStyles.modalContent}>
                                        <Text style={localStyles.modalTitle}>Add Profile Image</Text>

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
                                            style={localStyles.modalButton}
                                        >
                                            <Text style={localStyles.modalButtonText}>From Photos</Text>
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
                                            style={localStyles.modalButton}
                                        >
                                            <Text style={localStyles.modalButtonText}>Take Picture</Text>
                                        </Pressable>

                                        <Pressable
                                            onPress={() => setShowModal(false)}
                                            style={localStyles.modalCancelButton}
                                        >
                                            <Text style={localStyles.modalCancelText}>Cancel</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </Modal>

                            {!editMode ? (
                                <View style={globalStyles.infoContainer as ViewStyle}>
                                    <View style={localStyles.infoRow}>
                                        <Ionicons name="person-outline" size={20} color={theme.colors.primary} style={localStyles.infoIcon} />
                                        <Text style={localStyles.label}>Username</Text>
                                        <Text style={localStyles.value}>{userData.username}</Text>
                                    </View>

                                    <View style={localStyles.infoRow}>
                                        <Ionicons name="call-outline" size={20} color={theme.colors.primary} style={localStyles.infoIcon} />
                                        <Text style={localStyles.label}>Phone</Text>
                                        <Text style={localStyles.value}>{userData.phoneNumber}</Text>
                                    </View>

                                    <View style={localStyles.infoRow}>
                                        <Ionicons name="mail-outline" size={20} color={theme.colors.primary} style={localStyles.infoIcon} />
                                        <Text style={localStyles.label}>Email</Text>
                                        <Text style={localStyles.value}>{userData.email}</Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={globalStyles.editContainer as ViewStyle}>
                                    <View style={localStyles.inputGroup}>
                                        <Text style={localStyles.inputLabel}>Name</Text>
                                        <View style={localStyles.inputWrapper}>
                                            <TextInput
                                                style={localStyles.input}
                                                value={userData.username}
                                                onChangeText={(v) => updateUserData('username', v)}
                                                placeholderTextColor={theme.colors.textLight}
                                            />
                                        </View>
                                    </View>

                                    <View style={localStyles.inputGroup}>
                                        <Text style={localStyles.inputLabel}>Phone</Text>
                                        <View style={localStyles.inputWrapper}>
                                            <TextInput
                                                style={localStyles.input}
                                                value={userData.phoneNumber}
                                                onChangeText={(v) => updateUserData('phoneNumber', v)}
                                                placeholderTextColor={theme.colors.textLight}
                                                keyboardType="phone-pad"
                                            />
                                        </View>
                                    </View>

                                    <View style={localStyles.inputGroup}>
                                        <Text style={localStyles.inputLabel}>Email</Text>
                                        <View style={localStyles.inputWrapper}>
                                            <TextInput
                                                style={localStyles.input}
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
                                                style={localStyles.saveButton}
                                            >
                                                <Text style={localStyles.saveButtonText}>Save Changes</Text>
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

const localStyles = StyleSheet.create({
    editButton: {
        ...theme.shadows.sm,
    },
    gradientButton: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    editButtonText: {
        color: theme.colors.text,
        fontWeight: '600',
        fontSize: 16,
    },
    cameraButtonOverlay: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.sm,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.md,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    modalButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    modalCancelButton: {
        backgroundColor: theme.colors.border,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
    },
    modalCancelText: {
        color: theme.colors.text,
        fontSize: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 28,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        marginHorizontal: 16,
        marginTop: 20,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 24,
        position: 'relative',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: theme.colors.primary,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    infoContainer: {
        marginTop: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoIcon: {
        marginRight: 12,
    },
    label: {
        width: 80,
        fontSize: 14,
        color: '#6c757d',
        fontWeight: '500',
    },
    value: {
        flex: 1,
        fontSize: 16,
        color: '#212529',
        fontWeight: '400',
    },
    // Edit mode styles
    editContainer: {
        marginTop: 8,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#495057',
        marginBottom: 6,
    },
    inputWrapper: {
        borderWidth: 1,
        borderColor: '#dee2e6',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    input: {
        fontSize: 16,
        color: '#212529',
        padding: 0,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 30,
        marginTop: 16,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
});