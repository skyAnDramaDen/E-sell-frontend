import React, {useState, useRef} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Animated,
    ViewStyle, TextStyle
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Picker } from '@react-native-picker/picker';
import { useRouter, useNavigation } from "expo-router";
import { useAuth } from "../../../hooks/useAuth";
import { styles } from "../../../src/styles/styles";

import {
    CategoryNode
} from "../../../types/interfaces";


import { useFocusEffect } from "expo-router";

import taxonomy from "../../../assets/taxonomy.json";


import * as Location from "expo-location";
import {DrawerNavigationProp} from "@react-navigation/drawer";
import {Ionicons} from "@expo/vector-icons";
import { pickImage, takePhoto } from "../../../utils/imagePicker";
import { create_listing } from "../../../services/listingsService";
import { theme } from "../../../src/theme/theme";
import {SafeAreaView} from "react-native-safe-area-context";
import {ImageStyle} from "expo-image";

export default function SellScreen() {
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const router = useRouter();
    const { user } = useAuth();
    const [images, setImages] = useState<string[]>([]);

    const [selectedTop, setSelectedTop] = useState<CategoryNode | null | undefined>(null);
    const [selectedSecond, setSelectedSecond] = useState<CategoryNode | null | undefined>(null);
    const [selectedThird, setSelectedThird] = useState<CategoryNode | null | undefined>(null);

    const [description, setDescription] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [condition, setCondition] = useState<string | null>(null);
    const [price, setPrice] = useState<number | null>(0);
    const [location, setLocation] = useState<string>("");

    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [geocode1, setGeocode1] = useState<any>(null);
    const [address, setAddress] = useState<string | undefined>(undefined);
    const [useLocationError, setUseLocationError] = useState<string | null>(null);
    const [useLocationLoading, setUseLocationLoading] = useState(false);

    const galleryButtonScale = useRef(new Animated.Value(1)).current;
    const cameraButtonScale = useRef(new Animated.Value(1)).current;

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'New', value: 'new' },
        { label: 'Used - Like New', value: 'like_new' },
    ]);

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
        <SafeAreaView style={{ flex: 1, borderStyle: "solid", borderColor: 'red'  }}
                      edges={["top", "left", "right"]}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer as ViewStyle}
            >
                <View style={styles.header as ViewStyle}>
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                        style={styles.menuButton as ViewStyle}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="menu" size={25} color={theme.colors.text} />
                    </TouchableOpacity>
                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.secondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.titleGradient as ViewStyle}
                    >
                        <Text style={styles.title as TextStyle}>Create a Listing</Text>
                    </LinearGradient>
                </View>

                <View style={styles.section as ViewStyle}>
                    <Text style={styles.sectionTitle as TextStyle}>Photos</Text>
                    <View style={styles.buttonRow as ViewStyle}>
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
                                style={styles.flexOne as ViewStyle}
                            >
                                <LinearGradient
                                    colors={[theme.colors.primary, theme.colors.accent]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.gradientButton as ViewStyle}
                                >
                                    <Ionicons name="images" size={20} color="#fff" style={styles.buttonIcon as TextStyle} />
                                    <Text style={styles.buttonText as TextStyle}>Photos</Text>
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
                                style={styles.flexOne as ViewStyle}
                            >
                                <LinearGradient
                                    colors={[theme.colors.secondary, theme.colors.accent]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.gradientButton as ViewStyle}
                                >
                                    <Ionicons name="camera" size={20} color="#fff" style={styles.buttonIcon as TextStyle} />
                                    <Text style={styles.buttonText as TextStyle}>Camera</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                    {images.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.imagePreviewContainer as ViewStyle}
                        >
                            {images.map((uri, index) => (
                                <View key={index} style={styles.imageWrapper as ViewStyle}>
                                    <Image source={{ uri }} style={styles.previewImage as ImageStyle} />
                                    <TouchableOpacity
                                        style={styles.removeImageButton as ViewStyle}
                                        onPress={() => setImages(images.filter((_, i) => i !== index))}
                                    >
                                        <Ionicons name="close-circle" size={22} color={theme.colors.error} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>

                <View style={styles.section as ViewStyle}>
                    <Text style={styles.sectionTitle as TextStyle}>Title</Text>

                    <View style={styles.inputGroup as ViewStyle}>
                        <Text style={styles.label as TextStyle}>Name</Text>
                        <TextInput
                            placeholder="e.g., Vintage Leather Jacket"
                            placeholderTextColor={theme.colors.textLight}
                            value={title}
                            onChangeText={setTitle}
                            style={styles.input as TextStyle}
                        />
                    </View>

                    <View style={styles.inputGroup as ViewStyle}>
                        <Text style={styles.label as TextStyle}>Description</Text>
                        <TextInput
                            placeholder="Describe your item..."
                            placeholderTextColor={theme.colors.textLight}
                            value={description}
                            onChangeText={setDescription}
                            style={[styles.input as TextStyle, styles.textArea as TextStyle]}
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    <View style={styles.row as ViewStyle}>
                        <View style={[styles.inputGroup as ViewStyle, styles.flexOne as ViewStyle, styles.marginRight as ViewStyle]}>
                            <Text style={styles.label as TextStyle}>Price (£)</Text>
                            <TextInput
                                placeholder="0.00"
                                placeholderTextColor={theme.colors.textLight}
                                value={price !== null ? price.toString() : ''}
                                onChangeText={(text) => setPrice(Number(text))}
                                style={styles.input as TextStyle}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={[styles.inputGroup as ViewStyle, styles.flexOne as ViewStyle]}>
                            <Text style={styles.label as TextStyle}>Condition</Text>
                            <View style={styles.pickerContainer as ViewStyle}>
                                <Picker
                                    selectedValue={condition}
                                    onValueChange={setCondition}
                                    style={styles.picker as TextStyle}
                                    dropdownIconColor={theme.colors.primary}
                                >
                                    <Picker.Item label="Select condition" value="" color={theme.colors.textLight} />
                                    <Picker.Item label="New" value="new" color={theme.colors.text} />
                                    <Picker.Item label="Used - Like New" value="like_new" color={theme.colors.text} />
                                    <Picker.Item label="Used - Good" value="good" color={theme.colors.text} />
                                    <Picker.Item label="Used - Fair" value="fair" color={theme.colors.text} />
                                </Picker>
                                <Ionicons name="chevron-down" size={20} color={theme.colors.textLight} style={styles.pickerIcon as ImageStyle} />
                            </View>
                            {/*<View style={{ zIndex: open ? 1000 : 1 }}>*/}
                            {/*    <DropDownPicker*/}
                            {/*        open={open}*/}
                            {/*        value={value}*/}
                            {/*        items={items}*/}
                            {/*        setOpen={setOpen}*/}
                            {/*        setValue={setValue}*/}
                            {/*        setItems={setItems}*/}
                            {/*        // modal={true}*/}
                            {/*        modalProps={{*/}
                            {/*            animationType: 'slide',   // optional*/}
                            {/*        }}*/}

                            {/*    />*/}
                            {/*</View>*/}
                        </View>
                    </View>
                </View>

                <View style={styles.section as ViewStyle}>
                    <Text style={styles.sectionTitle  as TextStyle}>Category</Text>

                    <View style={styles.inputGroup as ViewStyle}>
                        <Text style={styles.label as TextStyle}>Category</Text>
                        <View style={styles.pickerContainer as ViewStyle}>
                            <Picker
                                selectedValue={selectedTop?.id ?? ''}
                                onValueChange={(catID) => {
                                    const category = taxonomy.find((cat) => cat.id === catID);
                                    setSelectedTop(category);
                                    setSelectedSecond(null);
                                    setSelectedThird(null);
                                }}
                                style={styles.picker as TextStyle}
                                dropdownIconColor={theme.colors.primary}
                            >
                                <Picker.Item label="Select a category" value="" color={theme.colors.textLight} />
                                {taxonomy.map((cat) => (
                                    <Picker.Item key={cat.id} label={cat.name} value={cat.id} color={theme.colors.text} />
                                ))}
                            </Picker>
                            <Ionicons name="chevron-down" size={20} color={theme.colors.textLight} style={styles.pickerIcon as TextStyle} />
                        </View>
                    </View>

                    {selectedTop && (
                        <View style={styles.inputGroup as ViewStyle}>
                            <Text style={styles.label as TextStyle}>Sub-category</Text>
                            <View style={styles.pickerContainer as ViewStyle}>
                                <Picker
                                    selectedValue={selectedSecond?.id ?? ''}
                                    onValueChange={(subCatID) => {
                                        const subCategory = selectedTop.children?.find((sub) => sub.id === subCatID);
                                        setSelectedSecond(subCategory);
                                        setSelectedThird(null);
                                    }}
                                    style={styles.picker as TextStyle}
                                    dropdownIconColor={theme.colors.primary}
                                >
                                    <Picker.Item label="Select a sub-category" value="" color={theme.colors.textLight} />
                                    {selectedTop.children?.map((sub) => (
                                        <Picker.Item key={sub.id} label={sub.name} value={sub.id} color={theme.colors.text} />
                                    ))}
                                </Picker>
                                <Ionicons name="chevron-down" size={20} color={theme.colors.textLight} style={styles.pickerIcon as TextStyle} />
                            </View>
                        </View>
                    )}

                    {selectedSecond && selectedSecond.children?.length > 0 && (
                        <View style={styles.inputGroup as ViewStyle}>
                            <Text style={styles.label as TextStyle}>Sub-category</Text>
                            <View style={styles.pickerContainer as ViewStyle}>
                                <Picker
                                    selectedValue={selectedThird?.id ?? ''}
                                    onValueChange={(subCatID) => {
                                        const subCategory = selectedSecond.children?.find((sub) => sub.id === subCatID);
                                        setSelectedThird(subCategory);
                                    }}
                                    style={styles.picker as TextStyle}
                                    dropdownIconColor={theme.colors.primary}
                                >
                                    <Picker.Item label="Select a sub-category" value="" color={theme.colors.textLight} />
                                    {selectedSecond.children?.map((sub) => (
                                        <Picker.Item key={sub.id} label={sub.name} value={sub.id} color={theme.colors.text} />
                                    ))}
                                </Picker>
                                <Ionicons name="chevron-down" size={20} color={theme.colors.textLight} style={styles.pickerIcon as TextStyle} />
                            </View>
                        </View>
                    )}
                </View>

                <View style={styles.section as ViewStyle}>
                    <Text style={styles.sectionTitle as TextStyle}>Location</Text>
                    <View style={styles.locationRow as ViewStyle}>
                        <View style={[styles.flexOne as ViewStyle, styles.marginRight as ViewStyle]}>
                            <TextInput
                                placeholder="Enter address"
                                placeholderTextColor={theme.colors.textLight}
                                value={address}
                                onChangeText={setAddress}
                                style={styles.input as TextStyle}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={getLocation}
                            style={styles.locationButton as ViewStyle}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="locate" size={22} color={theme.colors.primary} />
                            <Text style={styles.locationButtonText as TextStyle}>Use my location</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={async () => {
                        await handleSubmit();
                    }}
                    style={styles.submitButtonWrapper as ViewStyle}
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
                        style={styles.submitButton  as ViewStyle}
                    >
                        <Text style={styles.submitText as TextStyle}>Create Listing</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>

    );
}