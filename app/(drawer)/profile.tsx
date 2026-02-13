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

import taxonomy from "../../assets/taxonomy.json";
import { useLocation } from "../../hooks/useLocation";

export default function Profile() {
    const [editMode, setEditMode] = useState(false);
    const [image, setImage] = useState<string>();



    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            //if I set allowsEditing to true, I cannot select multiple images.
            allowsEditing: false,
            quality: 1,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View>
            <View style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
                <Image
                    source={{uri: "https://www.iconsdb.com/icons/download/gray/user-512.png"}}
                    style={{width: 400, height: 400, borderRadius: 10,}}
                />
                <View>
                    <Text>Name:</Text>
                    <Text>Name:</Text>
                    <Text>Name:</Text>
                </View>
            </View>
        </View>
    );
}
