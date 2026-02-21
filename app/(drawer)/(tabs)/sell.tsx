import React, {useEffect, useState, useRef} from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, Pressable, Animated } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from '@react-native-picker/picker';
import { useRouter, useNavigation } from "expo-router";
import { useAuth } from "../../../hooks/useAuth";
import { styles } from "../../../src/styles/styles";
import {
    CategoryNode
} from "../../../types/interfaces";

import { base_url } from "../../../src/config/local";
import { useFocusEffect } from "expo-router";

import taxonomy from "../../../assets/taxonomy.json";
import { useLocation } from "../../../hooks/useLocation";

import * as Location from "expo-location";
import {DrawerNavigationProp} from "@react-navigation/drawer";
import {Ionicons} from "@expo/vector-icons";
import { pickImage, takePhoto } from "../../../utils/imagePicker";
import { create_listing } from "../../../services/listingsService";
import { theme } from "../../../src/theme/theme";

export default function SellScreen() {
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const router = useRouter();
    const { login, loading, error, user } = useAuth();
    const [images, setImages] = useState<string[]>([]);

    const [selectedTop, setSelectedTop] = useState<CategoryNode | null | undefined>(null);
    const [selectedSecond, setSelectedSecond] = useState<CategoryNode | null | undefined>(null);
    const [selectedThird, setSelectedThird] = useState<CategoryNode | null | undefined>(null);

    const [description, setDescription] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [condition, setCondition] = useState<string | null>(null);
    const [price, setPrice] = useState<number | null>(0);
    const [availability , setAvailability] = useState<boolean | null>(true);
    const [location, setLocation] = useState<string>("");

    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [geocode1, setGeocode1] = useState<any>(null);
    const [address, setAddress] = useState<string | undefined>(undefined);
    const [useLocationError, setUseLocationError] = useState<string | null>(null);
    const [useLocationLoading, setUseLocationLoading] = useState(false);


    const galleryButtonScale = useRef(new Animated.Value(1)).current;
    const cameraButtonScale = useRef(new Animated.Value(1)).current;

    useFocusEffect( React.useCallback(() => {
        return () => {
            setImages([]);
            setSelectedTop(null);
            setSelectedSecond(null);
            setLocation("");
            setDescription("");
            setTitle("");
            setPrice(null);
        };
        }, [])
    );

    const getLocation = async () => {
        try {
            setUseLocationLoading(true);

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setUseLocationError("Location permission denied");
                setUseLocationLoading(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            setCoords({ latitude, longitude });

            const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            setGeocode1(geocode[0]);
            setAddress(geocode1.city + ", " + geocode1.subregion);
        } catch (err) {
            setUseLocationError("Failed to get location");
        } finally {
            setUseLocationLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (title && description && condition && price && selectedTop && selectedSecond && user) {

            const formData = new FormData();

            if (images != null) {
                images.forEach((uri, i) => {
                    formData.append("images", {
                        uri,
                        type: "image/jpeg",
                        name: `photo_${i}.jpg`,
                    } as any);
                });
            }

            formData.append("name", title);
            formData.append("description", description);
            formData.append("condition", condition);
            formData.append("price", price.toString());
            formData.append("subCategoryId", selectedSecond.id.toString());
            formData.append("subCategory", selectedSecond.name);
            formData.append("topCategoryId", selectedTop.id.toString());
            formData.append("topCategory", selectedTop.name);
            formData.append("location", address ? address : "" );

            if (selectedThird) {
                formData.append("lowestCategoryId", selectedThird.id.toString());
                formData.append("lowestCategory", selectedThird.name);
            }
            formData.append("userId", user.id);

            try {
                const res = await create_listing(formData);

                router.replace(`/listing/${res.product.id}`)
            } catch (error) {
                alert("Error");
            }
        }
    }

    const animatePress = (animatedValue: Animated.Value) => {
        Animated.sequence([
            Animated.timing(animatedValue, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.timing(animatedValue, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.openDrawer()}
                    style={styles.menuButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="menu" size={25} color={theme.colors.text} />
                </TouchableOpacity>
                <LinearGradient
                    colors={[theme.colors.primary, theme.colors.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.titleGradient}
                >
                    <Text style={styles.title}>Create a Listing</Text>
                </LinearGradient>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Photos</Text>
                <View style={styles.buttonRow}>
                    <Animated.View style={{ transform: [{ scale: galleryButtonScale }], flex: 1 }}>
                        <TouchableOpacity
                            onPress={async () => {
                                animatePress(galleryButtonScale);
                                let loaded_images = await pickImage();
                                if (loaded_images) {
                                    let item_images = loaded_images.assets.map(asset => asset.uri);
                                    setImages([...images, ...item_images]);
                                }
                            }}
                            activeOpacity={0.9}
                            style={styles.flexOne}
                        >
                            <LinearGradient
                                colors={[theme.colors.primary, theme.colors.accent]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Ionicons name="images" size={20} color="#fff" style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>Photos</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>

                    <View style={{ width: theme.spacing.md }} />

                    <Animated.View style={{ transform: [{ scale: cameraButtonScale }], flex: 1 }}>
                        <TouchableOpacity
                            onPress={async () => {
                                animatePress(cameraButtonScale);
                                let camera_image = await takePhoto();
                                if (camera_image) {
                                    setImages((prev) => [...prev, camera_image]);
                                }
                            }}
                            activeOpacity={0.9}
                            style={styles.flexOne}
                        >
                            <LinearGradient
                                colors={[theme.colors.secondary, theme.colors.accent]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Ionicons name="camera" size={20} color="#fff" style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>Camera</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                {images.length > 0 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.imagePreviewContainer}
                    >
                        {images.map((uri, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image source={{ uri }} style={styles.previewImage} />
                                <TouchableOpacity
                                    style={styles.removeImageButton}
                                    onPress={() => setImages(images.filter((_, i) => i !== index))}
                                >
                                    <Ionicons name="close-circle" size={22} color={theme.colors.error} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Title</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        placeholder="e.g., Vintage Leather Jacket"
                        placeholderTextColor={theme.colors.textLight}
                        value={title}
                        onChangeText={setTitle}
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        placeholder="Describe your item..."
                        placeholderTextColor={theme.colors.textLight}
                        value={description}
                        onChangeText={setDescription}
                        style={[styles.input, styles.textArea]}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, styles.flexOne, styles.marginRight]}>
                        <Text style={styles.label}>Price (£)</Text>
                        <TextInput
                            placeholder="0.00"
                            placeholderTextColor={theme.colors.textLight}
                            value={price !== null ? price.toString() : ''}
                            onChangeText={(text) => setPrice(Number(text))}
                            style={styles.input}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={[styles.inputGroup, styles.flexOne]}>
                        <Text style={styles.label}>Condition</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={condition}
                                onValueChange={setCondition}
                                style={styles.picker}
                                dropdownIconColor={theme.colors.primary}
                            >
                                <Picker.Item label="Select condition" value="" color={theme.colors.textLight} />
                                <Picker.Item label="New" value="new" color={theme.colors.text} />
                                <Picker.Item label="Used - Like New" value="like_new" color={theme.colors.text} />
                                <Picker.Item label="Used - Good" value="good" color={theme.colors.text} />
                                <Picker.Item label="Used - Fair" value="fair" color={theme.colors.text} />
                            </Picker>
                            <Ionicons name="chevron-down" size={20} color={theme.colors.textLight} style={styles.pickerIcon} />
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Category</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedTop?.id ?? ''}
                            onValueChange={(catID) => {
                                const category = taxonomy.find((cat) => cat.id === catID);
                                setSelectedTop(category);
                                setSelectedSecond(null);
                                setSelectedThird(null);
                            }}
                            style={styles.picker}
                            dropdownIconColor={theme.colors.primary}
                        >
                            <Picker.Item label="Select a category" value="" color={theme.colors.textLight} />
                            {taxonomy.map((cat) => (
                                <Picker.Item key={cat.id} label={cat.name} value={cat.id} color={theme.colors.text} />
                            ))}
                        </Picker>
                        <Ionicons name="chevron-down" size={20} color={theme.colors.textLight} style={styles.pickerIcon} />
                    </View>
                </View>

                {selectedTop && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Sub-category</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedSecond?.id ?? ''}
                                onValueChange={(subCatID) => {
                                    const subCategory = selectedTop.children?.find((sub) => sub.id === subCatID);
                                    setSelectedSecond(subCategory);
                                    setSelectedThird(null);
                                }}
                                style={styles.picker}
                                dropdownIconColor={theme.colors.primary}
                            >
                                <Picker.Item label="Select a sub-category" value="" color={theme.colors.textLight} />
                                {selectedTop.children?.map((sub) => (
                                    <Picker.Item key={sub.id} label={sub.name} value={sub.id} color={theme.colors.text} />
                                ))}
                            </Picker>
                            <Ionicons name="chevron-down" size={20} color={theme.colors.textLight} style={styles.pickerIcon} />
                        </View>
                    </View>
                )}

                {selectedSecond && selectedSecond.children?.length > 0 && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Sub-category</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedThird?.id ?? ''}
                                onValueChange={(subCatID) => {
                                    const subCategory = selectedSecond.children?.find((sub) => sub.id === subCatID);
                                    setSelectedThird(subCategory);
                                }}
                                style={styles.picker}
                                dropdownIconColor={theme.colors.primary}
                            >
                                <Picker.Item label="Select a sub-category" value="" color={theme.colors.textLight} />
                                {selectedSecond.children?.map((sub) => (
                                    <Picker.Item key={sub.id} label={sub.name} value={sub.id} color={theme.colors.text} />
                                ))}
                            </Picker>
                            <Ionicons name="chevron-down" size={20} color={theme.colors.textLight} style={styles.pickerIcon} />
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.locationRow}>
                    <View style={[styles.inputGroup, styles.flexOne, styles.marginRight]}>
                        <TextInput
                            placeholder="Enter address"
                            placeholderTextColor={theme.colors.textLight}
                            value={address}
                            onChangeText={setAddress}
                            style={styles.input}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={getLocation}
                        style={styles.locationButton}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="locate" size={22} color={theme.colors.primary} />
                        <Text style={styles.locationButtonText}>Use my location</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                onPress={async () => {
                    await handleSubmit();
                }}
                style={styles.submitButtonWrapper}
                disabled={
                    !images.length ||
                    !selectedTop ||
                    !selectedSecond ||
                    !description ||
                    !title ||
                    !condition ||
                    !price ||
                    !address
                }
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={['#000000', "#000000"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.submitButton}
                >
                    <Text style={styles.submitText}>Create Listing</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                </LinearGradient>
            </TouchableOpacity>
        </ScrollView>
    );
}