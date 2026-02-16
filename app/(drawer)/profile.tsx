import React, {useEffect, useState} from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, Pressable, Modal} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from '@react-native-picker/picker';
import { useRouter, useNavigation } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { takePhoto, pickImage, pickOneImage } from "../../utils/imagePicker";
import {
    CategoryNode
} from "../../types/interfaces";
import { theme } from "../../src/theme/theme";
import { styles } from "../../src/styles/styles";
import { edit_user, get_user } from "../../services/userService";
import { base_url } from "../../src/config/local";
import { Ionicons } from "@expo/vector-icons";

import taxonomy from "../../assets/taxonomy.json";
import { useLocation } from "../../hooks/useLocation";
import { showMessage } from "react-native-flash-message";
import { useFocusEffect } from "expo-router";
import { UserDTO, GetUserResponseBody } from "../../types/interfaces";
import {delete_listing} from "../../services/listingsService";
import {DrawerNavigationProp} from "@react-navigation/drawer";
import {launchImageLibraryAsync} from "expo-image-picker";

export default function Profile() {
    const { login, loading, error, user, reload_user } = useAuth();
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
        setUserData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        const payload = {
            ...userData,
            phoneNumber: userData.phoneNumber,
            profileImageUri: userData.profileImageUri,
        };

        let response;
        response = await edit_user(payload);

        if (response.success === true) {
            setUserData({
                id: response.user.id,
                name: response.user.name,
                email: response.user.email,
                phoneNumber: response.user.phoneNumber,
                profileImageUri: response.user.profileImageUri,
            });
            setEditMode(false);
            showMessage({ message: "Profile updated successfully", type: "success", });
        }
    };

    useEffect(() => {
        let fetched_user;
        (async () => {
            if (user) {
                fetched_user = await get_user(user.id);
                if (fetched_user) {
                    setUserData({
                        id: fetched_user.user.id,
                        name: fetched_user.user.name,
                        email: fetched_user.user.email,
                        phoneNumber: fetched_user.user.phoneNumber,
                        profileImageUri: fetched_user.profileImageUri,
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

            return () => { isActive = false; };
        }, [user])
    );

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.centered}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <TouchableOpacity
                            onPress={() => router.replace('/(tabs)' as any)}
                            style={styles.iconButton}
                        >
                            <Ionicons name="home-outline" size={24} color={theme.colors.text} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setEditMode(!editMode)}
                            style={styles.editButton}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={["transparent", "transparent"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.editButtonText}>
                                    {editMode ? 'Cancel' : 'Edit'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View>

                        {
                            editMode && (
                                <Pressable
                                    onPress={() => setShowModal(true)}
                                    style={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        zIndex: 10,
                                        backgroundColor: "rgba(0,0,0,0.6)",
                                        width: 32,
                                        height: 32,
                                        borderRadius: 16,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}

                                >
                                    <Ionicons name="camera" size={24} color="white" />

                                </Pressable>
                            )
                        }
                        <Image
                            source={{
                                uri: userData.profileImageUri ||
                                    'https://www.iconsdb.com/icons/download/gray/user-512.png',
                            }}
                            style={styles.profileImage}
                        />
                    </View>

                    <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}
                    >
                        <View style={{
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <View style={{width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10,}}>
                                <Text style={{fontSize: 18, fontWeight: "600", marginBottom: 12}}>
                                    Add Profile Image
                                </Text>
                                <View>
                                    <Pressable onPress={async () => {
                                        setShowModal(false);
                                        setShouldOpenLibrary(true);
                                        const image = await pickOneImage(setShowModal);
                                        console.log(image);

                                    }}
                                               style={{
                                                   backgroundColor: "red",
                                                   padding: 12,
                                                   borderRadius: 8,
                                                   marginBottom: 10,
                                               }}
                                    >
                                        <Text style={{color: "#fff", textAlign: "center"}}>From Photos</Text>
                                    </Pressable>

                                    <Pressable onPress={async () => {
                                        const user_img_uri = await takePhoto();
                                        if (user_img_uri != null) {
                                            setUserData({
                                                ...userData,  profileImageUri: user_img_uri
                                            });
                                        setShowModal(false)
                                        }
                                    }}
                                               style={{
                                                   backgroundColor: "red",
                                                   padding: 12,
                                                   borderRadius: 8,
                                                   marginBottom: 10,
                                               }}
                                    >
                                        <Text style={{color: "#fff", textAlign: "center"}}>Take Picture</Text>
                                    </Pressable>
                                </View>
                                <Pressable onPress={() => setShowModal(false)}
                                           style={{
                                               backgroundColor: "#ddd",
                                               padding: 12,
                                               borderRadius: 8,
                                           }}
                                >
                                    <Text style={{textAlign: "center"}}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>

                    {!editMode ? (
                        <View style={styles.infoContainer}>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Name</Text>
                                <Text style={styles.value}>{userData.name}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Phone</Text>
                                <Text style={styles.value}>{userData.phoneNumber}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Email</Text>
                                <Text style={styles.value}>{userData.email}</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.editContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Name</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        value={userData.name}
                                        onChangeText={(v) => updateUserData('name', v)}
                                        placeholderTextColor={theme.colors.textLight}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Phone</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        value={userData.phoneNumber}
                                        onChangeText={(v) => updateUserData('phoneNumber', v)}
                                        placeholderTextColor={theme.colors.textLight}
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
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
                                style={styles.saveButtonWrapper}
                            >
                                <LinearGradient
                                    colors={[theme.colors.primary, theme.colors.secondary]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.saveButton}
                                >
                                    <Text style={styles.saveButtonText}>Save Changes</Text>
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
