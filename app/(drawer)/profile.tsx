import React, {useEffect, useState} from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, Pressable, Modal} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {LinearGradient} from "expo-linear-gradient";
import {Picker} from '@react-native-picker/picker';
import {useRouter, useNavigation} from "expo-router";
import {useAuth} from "../../hooks/useAuth";
import {takePhoto, pickImage, pickOneImage} from "../../utils/imagePicker";
import {
    CategoryNode
} from "../../types/interfaces";
import { styles as globalStyles } from "../../src/styles/styles";
import {theme} from "../../src/theme/theme";
import {styles} from "../../src/styles/styles";
import {edit_user, get_user} from "../../services/userService";
import {base_url} from "../../src/config/local";
import {Ionicons} from "@expo/vector-icons";

import taxonomy from "../../assets/taxonomy.json";
import {useLocation} from "../../hooks/useLocation";
import {showMessage} from "react-native-flash-message";
import {useFocusEffect} from "expo-router";
import {UserDTO, GetUserResponseBody} from "../../types/interfaces";
import {delete_listing} from "../../services/listingsService";
import {DrawerNavigationProp} from "@react-navigation/drawer";
import {launchImageLibraryAsync} from "expo-image-picker";

export default function Profile() {
    const {login, loading, error, user, reload_user} = useAuth();
    const [editMode, setEditMode] = useState(false);
    const router = useRouter();
    const [image, setImage] = useState<string>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [shouldOpenLibrary, setShouldOpenLibrary] = useState(false);

    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const [userData, setUserData] = useState<UserDTO>({
        id: "",
        name: "",
        email: "",
        phoneNumber: "",
        profileImageUri: "",
    });

    const updateUserData = (key: keyof typeof userData, value: string) => {
        setUserData(prev => ({...prev, [key]: value}));
    };

    const handleSubmit = async () => {
        const formData = new FormData();

        if (image) {
            formData.append("image", {
                uri: userData.profileImageUri,
                type: "image/jpeg",
                name: `${userData.id}_profile_photo.jpg`,
            } as any);
        }

        formData.append("email", userData.email);
        formData.append("id", userData.id);
        formData.append("name", userData.name);
        formData.append("phoneNumber", userData.phoneNumber ? userData.phoneNumber : "");
        formData.append("profileImageUri", userData.profileImageUri ? userData.profileImageUri : "");

        const response = await edit_user(formData);

        if (response.success === true) {
            setUserData({
                id: response.user.id,
                name: response.user.name,
                email: response.user.email,
                phoneNumber: response.user.phoneNumber,
                profileImageUri: response.user.profileImageUri,
            });
            setEditMode(false);
            showMessage({message: "Profile updated successfully", type: "success",});
        }
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
                        name: fetched_user.user.name,
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
                name: userData.name,
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
                        name: fetched_user.user?.name ?? "",
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
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={globalStyles.centered}>
                <View style={globalStyles.card}>
                    <View style={globalStyles.cardHeader}>
                        <TouchableOpacity
                            onPress={() => router.replace('/(tabs)' as any)}
                            style={globalStyles.iconButton}
                        >
                            <Ionicons name="home-outline" size={24} color={theme.colors.text} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setEditMode(!editMode)}
                            style={localStyles.editButton}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={editMode ? ['transparent', 'transparent'] : [theme.colors.primary, theme.colors.secondary]}
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

                    <View>
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
                            style={globalStyles.profileImage}
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
                        <View style={globalStyles.infoContainer}>
                            <View style={globalStyles.infoRow}>
                                <Text style={globalStyles.label}>Name</Text>
                                <Text style={globalStyles.value}>{userData.name}</Text>
                            </View>

                            <View style={globalStyles.infoRow}>
                                <Text style={globalStyles.label}>Phone</Text>
                                <Text style={globalStyles.value}>{userData.phoneNumber}</Text>
                            </View>

                            <View style={globalStyles.infoRow}>
                                <Text style={globalStyles.label}>Email</Text>
                                <Text style={globalStyles.value}>{userData.email}</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={globalStyles.editContainer}>
                            <View style={globalStyles.inputGroup}>
                                <Text style={globalStyles.label}>Name</Text>
                                <View style={globalStyles.inputWrapper}>
                                    <TextInput
                                        style={globalStyles.input}
                                        value={userData.name}
                                        onChangeText={(v) => updateUserData('name', v)}
                                        placeholderTextColor={theme.colors.textLight}
                                    />
                                </View>
                            </View>

                            <View style={globalStyles.inputGroup}>
                                <Text style={globalStyles.label}>Phone</Text>
                                <View style={globalStyles.inputWrapper}>
                                    <TextInput
                                        style={globalStyles.input}
                                        value={userData.phoneNumber}
                                        onChangeText={(v) => updateUserData('phoneNumber', v)}
                                        placeholderTextColor={theme.colors.textLight}
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>

                            <View style={globalStyles.inputGroup}>
                                <Text style={globalStyles.label}>Email</Text>
                                <View style={globalStyles.inputWrapper}>
                                    <TextInput
                                        style={globalStyles.input}
                                        value={userData.email}
                                        onChangeText={(v) => updateUserData('email', v)}
                                        placeholderTextColor={theme.colors.textLight}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

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
                                    <Text style={globalStyles.saveButtonText}>Save Changes</Text>
                                    <Ionicons name="checkmark" size={20} color="#fff" style={{ marginLeft: 8 }} />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
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
});