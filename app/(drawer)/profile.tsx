import React, {useEffect, useState} from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, Pressable} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from '@react-native-picker/picker';
import { useRouter, useNavigation } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import {
    CategoryNode
} from "../../types/interfaces";
import { edit_user, get_user } from "../../services/userService";
import { base_url } from "../../src/config/local";
import { Ionicons } from "@expo/vector-icons";

import taxonomy from "../../assets/taxonomy.json";
import { useLocation } from "../../hooks/useLocation";
import { showMessage } from "react-native-flash-message";
import { useFocusEffect } from "expo-router";
import { UserDTO } from "../../types/interfaces";

export default function Profile() {
    const { login, loading, error, user, reload_user } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const router = useRouter();
    const [image, setImage] = useState<string>();
    const [userData, setUserData] = useState<UserDTO>({
        id: "",
        name: "",
        email: "",
        phoneNumber: "",
    });

    const updateUserData = (key: keyof typeof userData, value: string) => {
        setUserData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        const payload = {
            ...userData,
            phoneNumber: userData.phoneNumber,
        };

        let response;
        response = await edit_user(payload);

        if (response.success === true) {
            setUserData({
                id: response.user.id,
                name: response.user.name,
                email: response.user.email,
                phoneNumber: response.user.phoneNumber,
            });
            setEditMode(false);
            showMessage({ message: "Profile updated successfully", type: "success", });
        }
    };

    useEffect(() => {
        if (!editMode) {
            setUserData({
                id: userData.id,
                name: userData.name,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
            })
        }
    }, [editMode])

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
                    });
                }
            }
        })()
    }, [])

    return (
        <ScrollView className="flex-1 bg-gray-100">
            <View className="flex-1 items-center px-2.5 pt-5 pb-10">
                <View className="w-full bg-white rounded-3xl px-6 py-5 shadow-lg items-center">
                    <View className="flex flex-row justify-between items-center w-full">
                        <TouchableOpacity onPress={() => {
                            router.replace("/(tabs)" as any);
                        }}>
                            <Ionicons name="home-outline" size={25} color="#333" />
                        </TouchableOpacity>
                        <Pressable
                            onPress={() => setEditMode(!editMode)}
                            className="self-end mb-4 bg-black px-4 py-2 rounded-xl"
                        >
                            <Text className="text-white font-semibold">
                                {editMode ? "Cancel" : "Edit"}
                            </Text>
                        </Pressable>
                    </View>

                    <Image
                        source={{ uri: "https://www.iconsdb.com/icons/download/gray/user-512.png" }}
                        className="w-32 h-32 rounded-full mb-6"
                    />

                    {!editMode ? (
                        <View className="w-full space-y-4">
                            <View>
                                <Text className="text-gray-500 text-sm">Name</Text>
                                <Text className="text-lg font-semibold text-gray-800">
                                    {userData.name}
                                </Text>
                            </View>

                            <View>
                                <Text className="text-gray-500 text-sm">Phone Number</Text>
                                <Text className="text-lg font-semibold text-gray-800">
                                    {userData.phoneNumber}
                                </Text>
                            </View>

                            <View>
                                <Text className="text-gray-500 text-sm">Email</Text>
                                <Text className="text-lg font-semibold text-gray-800">
                                    {userData.email}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View className="w-full space-y-4">
                            <View>
                                <Text className="text-gray-500 text-sm mb-1">Name</Text>
                                <View className="border border-gray-300 rounded-xl bg-gray-50 px-4 py-3 justify-center">
                                    <TextInput
                                        textAlignVertical="center"
                                        value={userData.name}
                                        onChangeText={(v) => updateUserData("name", v)}
                                    />
                                </View>
                            </View>

                            <View className="my-5">
                                <Text className="text-gray-500 text-sm mb-1">Phone Number</Text>
                                <View className="border border-gray-300 rounded-xl bg-gray-50 px-4 py-3 justify-center">
                                    <TextInput
                                        textAlignVertical="center"
                                        value={userData.phoneNumber}
                                        onChangeText={(v) => updateUserData("phoneNumber", v)}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text className="text-gray-500 text-sm mb-1">Email</Text>
                                <View className="border border-gray-300 rounded-xl bg-gray-50 px-4 py-3 justify-center">
                                    <TextInput
                                        textAlignVertical="center"
                                        value={userData.email}
                                        onChangeText={(v) => updateUserData("email", v)}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleSubmit}
                                className="mt-4 bg-black py-3 rounded-xl items-center"
                            >
                                <Text className="text-white font-semibold text-base">
                                    Save Changes
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
