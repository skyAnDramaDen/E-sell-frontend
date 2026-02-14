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

import { base_url } from "../../src/config/local";
import { Ionicons } from "@expo/vector-icons";

import taxonomy from "../../assets/taxonomy.json";
import { useLocation } from "../../hooks/useLocation";

export default function Profile() {
    const { login, loading, error, user } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const router = useRouter();
    const [image, setImage] = useState<string>();
    const [userData, setUserData] = useState({
        name: user?.name ?? "",
        email: user?.email ?? "",
        phoneNumber: user?.phoneNumber?.toString() ?? "",
    });

    const updateUserData = (key: keyof typeof userData, value: string) => {
        setUserData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        const payload = {
            ...userData,
            phoneNumber: Number(userData.phoneNumber),
        };

        console.log(payload);

    };

    useEffect(() => {
        if (!editMode) {
            setUserData({
                name: user?.name ?? "",
                email: user?.email ?? "",
                phoneNumber: user?.phoneNumber?.toString() ?? "",
            })
        }
    }, [editMode])

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
                                    {user?.name}
                                </Text>
                            </View>

                            <View>
                                <Text className="text-gray-500 text-sm">Phone Number</Text>
                                <Text className="text-lg font-semibold text-gray-800">
                                    {user?.phoneNumber}
                                </Text>
                            </View>

                            <View>
                                <Text className="text-gray-500 text-sm">Email</Text>
                                <Text className="text-lg font-semibold text-gray-800">
                                    {user?.email}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View className="w-full space-y-4">
                            <View>
                                <Text className="text-gray-500 text-sm mb-1">Name</Text>
                                <TextInput
                                    value={userData.name}
                                    onChangeText={(v) => updateUserData("name", v)}
                                    className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
                                />
                            </View>

                            <View>
                                <Text className="text-gray-500 text-sm mb-1">Phone Number</Text>
                                <TextInput
                                    value={userData.phoneNumber}
                                    onChangeText={(v) => updateUserData("phoneNumber", v)}
                                    keyboardType="phone-pad"
                                    className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
                                />
                            </View>

                            <View>
                                <Text className="text-gray-500 text-sm mb-1">Email</Text>
                                <TextInput
                                    value={userData.email}
                                    onChangeText={(v) => updateUserData("email", v)}
                                    keyboardType="email-address"
                                    className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
                                />
                            </View>

                            <Pressable
                                onPress={handleSubmit}
                                className="mt-4 bg-black py-3 rounded-xl items-center"
                            >
                                <Text className="text-white font-semibold text-base">
                                    Save Changes
                                </Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );

}
