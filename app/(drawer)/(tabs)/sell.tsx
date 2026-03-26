import React, {useState, useRef, useEffect, useCallback} from "react";
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
import DropDownPicker from 'react-native-dropdown-picker';

import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useNavigation } from "expo-router";
import { useAuth } from "../../../hooks/useAuth";
import { styles as globalStyles } from "../../../src/styles/styles";

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
import { useTheme } from "../../../hooks/useTheme";
import {SafeAreaView} from "react-native-safe-area-context";
import {ImageStyle} from "expo-image";
import {showMessage} from "react-native-flash-message";

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

    const { isDark, toggleTheme, theme } = useTheme();
    const pageStyles = globalStyles(theme);

    const [conditionOpen, setConditionOpen] = useState(false);
    const [conditionValue, setConditionValue] = useState(null);
    const [conditionItems, setConditionItems] = useState([
        { label: 'New', value: 'new' },
        { label: 'Used - Like New', value: 'like_new' },
        { label: 'Used - Good', value: 'good' },
        { label: 'Used - Fair', value: 'fair' },
    ]);

    const [topCategoryOpen, setTopCategoryOpen] = useState(false);
    const [topCategoryValue, setTopCategoryValue] = useState<number | null>(null);
    const [topCategoryItems, setTopCategoryItems] = useState<{label: string, value: number}[]>([]);

    useEffect(() => {
        if (taxonomy) {
            setTopCategoryItems(
                taxonomy.map(cat => ({
                    label: cat.name,
                    value: cat.id,
                }))
            );
        }
    }, [taxonomy]);

    const [subCategoryItems, setSubCategoryItems] = useState<{label: string, value: number}[]>([]);
    const [subCategoryOpen, setSubCategoryOpen] = useState(false);
    const [subCategoryValue, setSubCategoryValue] = useState<number | null>(null);
    useEffect(() => {
        if (taxonomy) {
            taxonomy.find((cat) => {
                if (cat.id == topCategoryValue) {
                    const mappedChildren = cat.children.map(child => ({
                        label: child.name,
                        value: child.id,
                    }));
                    setSubCategoryItems(mappedChildren);
                }
            })
        }
    }, [topCategoryValue])

    const [lowestCategoryItems, setLowestCategoryItems] = useState<{label: string, value: number}[]>([]);
    const [lowestCategoryOpen, setLowestCategoryOpen] = useState(false);
    const [lowestCategoryValue, setLowestCategoryValue] = useState<number | null>(null);
    useEffect(() => {
        if (taxonomy) {
            taxonomy.find((cat) => {
                if (cat.id === topCategoryValue) {
                    cat.children.find((sub_cat) => {
                        if (sub_cat.id === subCategoryValue) {
                            const mappedChildren = sub_cat.children.map(child => ({
                                label: child.name,
                                value: child.id,
                            }));
                            setLowestCategoryItems(mappedChildren);
                        }
                    })
                }
            })
        }
    }, [subCategoryValue])

    useFocusEffect(
        useCallback(() => {
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

    const isDisabled = () => {
        if (!user ||
            !images.length ||
            !selectedTop ||
            !selectedSecond ||
            !description ||
            !title ||
            !condition ||
            !price ||
            !address) {
            return true
        }
        return false
    }

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

                router.replace({
                    pathname: `/listing/${res.product.id}` as any,
                    params: {
                        from: "sell-page"
                    },
                });
            } catch (error) {
                alert("Error");
            }
        } else {
            showMessage({ message: "something is missing", type: "danger" });
        }
    }

    const animatePress = (animatedValue: Animated.Value) => {
        Animated.sequence([
            Animated.timing(animatedValue, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.timing(animatedValue, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
    };

    return (
        <SafeAreaView style={{ flex: 1, borderStyle: "solid", borderColor: 'red', backgroundColor: theme.colors.background  }}
                      edges={["top", "left", "right"]}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[pageStyles.scrollContainer as ViewStyle, { backgroundColor: theme.colors.background }]}
            >
                <View style={pageStyles.header as ViewStyle}>
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                        style={pageStyles.menuButton as ViewStyle}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="menu" size={25} color={theme.colors.text} />
                    </TouchableOpacity>
                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.secondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={pageStyles.titleGradient as ViewStyle}
                    >
                        <Text style={pageStyles.title as TextStyle}>Create a Listing</Text>
                    </LinearGradient>
                </View>

                <View style={pageStyles.section as ViewStyle}>
                    <Text style={pageStyles.sectionTitle as TextStyle}>Photos</Text>
                    <View style={pageStyles.buttonRow as ViewStyle}>
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
                                style={pageStyles.flexOne as ViewStyle}
                            >
                                <LinearGradient
                                    colors={[theme.colors.primary, theme.colors.accent]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={pageStyles.gradientButton as ViewStyle}
                                >
                                    <Ionicons name="images" size={20} color="#fff" style={pageStyles.buttonIcon as TextStyle} />
                                    <Text style={pageStyles.buttonText as TextStyle}>Photos</Text>
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
                                style={pageStyles.flexOne as ViewStyle}
                            >
                                <LinearGradient
                                    colors={[theme.colors.secondary, theme.colors.accent]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={pageStyles.gradientButton as ViewStyle}
                                >
                                    <Ionicons name="camera" size={20} color="#fff" style={pageStyles.buttonIcon as TextStyle} />
                                    <Text style={pageStyles.buttonText as TextStyle}>Camera</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                    {images.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={pageStyles.imagePreviewContainer as ViewStyle}
                        >
                            {images.map((uri, index) => (
                                <View key={index} style={pageStyles.imageWrapper as ViewStyle}>
                                    <Image source={{ uri }} style={pageStyles.previewImage as ImageStyle} />
                                    <TouchableOpacity
                                        style={pageStyles.removeImageButton as ViewStyle}
                                        onPress={() => setImages(images.filter((_, i) => i !== index))}
                                    >
                                        <Ionicons name="close-circle" size={22} color={theme.colors.error} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>

                <View style={pageStyles.section as ViewStyle}>
                    <Text style={pageStyles.sectionTitle as TextStyle}>Title</Text>

                    <View style={pageStyles.inputGroup as ViewStyle}>
                        <Text style={pageStyles.label as TextStyle}>Name</Text>
                        <TextInput
                            placeholder="e.g., Vintage Leather Jacket"
                            placeholderTextColor={theme.colors.textLight}
                            value={title}
                            onChangeText={setTitle}
                            style={pageStyles.input as TextStyle}
                        />
                    </View>

                    <View style={pageStyles.inputGroup as ViewStyle}>
                        <Text style={pageStyles.label as TextStyle}>Description</Text>
                        <TextInput
                            placeholder="Describe your item..."
                            placeholderTextColor={theme.colors.textLight}
                            value={description}
                            onChangeText={setDescription}
                            style={[pageStyles.input as TextStyle, pageStyles.textArea as TextStyle]}
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    <View style={pageStyles.row as ViewStyle}>
                        <View style={[pageStyles.inputGroup as ViewStyle, pageStyles.flexOne as ViewStyle, pageStyles.marginRight as ViewStyle]}>
                            <Text style={pageStyles.label as TextStyle}>Price (£)</Text>
                            <TextInput
                                placeholder="0.00"
                                placeholderTextColor={theme.colors.textLight}
                                value={price !== null ? price.toString() : ''}
                                onChangeText={(text) => setPrice(Number(text))}
                                style={pageStyles.input as TextStyle}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={[pageStyles.inputGroup as ViewStyle, pageStyles.flexOne as ViewStyle]}>
                            <Text style={pageStyles.label as TextStyle}>Condition</Text>

                            <View style={{ zIndex: conditionOpen ? 9999 : 1}}>
                                <DropDownPicker
                                    open={conditionOpen}
                                    value={conditionValue}
                                    items={conditionItems}
                                    setOpen={setConditionOpen}
                                    setValue={setConditionValue}
                                    setItems={setConditionItems}
                                    modalProps={{
                                        animationType: 'slide',
                                    }}
                                    listMode="MODAL"
                                    onChangeValue={(condition_value) => {
                                        setCondition(condition_value);
                                    }}
                                    style={[pageStyles.pickerInput]}
                                    placeholderStyle={{
                                        color: theme.colors.text
                                    }}

                                    labelStyle={{
                                        color: theme.colors.text,
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={pageStyles.section as ViewStyle}>
                    <Text style={pageStyles.sectionTitle  as TextStyle}>Category</Text>

                    <View style={pageStyles.inputGroup as ViewStyle}>
                        <Text style={pageStyles.label as TextStyle}>Category</Text>
                        <View style={pageStyles.pickerContainer as ViewStyle}>
                            <View style={{ zIndex: topCategoryOpen ? 9999 : 1}}>
                                <DropDownPicker
                                    open={topCategoryOpen}
                                    value={topCategoryValue}
                                    items={topCategoryItems}
                                    setOpen={setTopCategoryOpen}
                                    setValue={setTopCategoryValue}
                                    setItems={setTopCategoryItems}
                                    modalProps={{
                                        animationType: 'slide',
                                    }}
                                    onChangeValue={(catID) => {
                                        const category = taxonomy.find((cat) => cat.id === catID);
                                        setSelectedTop(category);
                                        setSelectedSecond(null);
                                        setSelectedThird(null);
                                        setSubCategoryValue(null);
                                        setLowestCategoryValue(null);
                                    }}
                                    listMode="MODAL"
                                    style={[pageStyles.pickerInput]}
                                    placeholderStyle={{
                                        color: theme.colors.text
                                    }}

                                    labelStyle={{
                                        color: theme.colors.text,
                                    }}
                                />
                            </View>
                        </View>
                    </View>

                    {selectedTop && (
                        <View style={pageStyles.inputGroup as ViewStyle}>
                            <Text style={pageStyles.label as TextStyle}>Sub-category</Text>
                            <View style={pageStyles.pickerContainer as ViewStyle}>
                                <View style={{ zIndex: subCategoryOpen ? 9999 : 1}}>
                                    <DropDownPicker
                                        open={subCategoryOpen}
                                        value={subCategoryValue}
                                        items={subCategoryItems}
                                        setOpen={setSubCategoryOpen}
                                        setValue={setSubCategoryValue}
                                        setItems={setSubCategoryItems}
                                        modalProps={{
                                            animationType: 'slide',
                                        }}
                                        onChangeValue={(catID) => {
                                            selectedTop?.children.find((cat) => {
                                                if (cat.id === catID) {
                                                    setSelectedSecond(cat);
                                                    setSelectedThird(null);
                                                    setLowestCategoryValue(null);
                                                }
                                            });
                                        }}
                                        listMode="MODAL"
                                        style={[pageStyles.pickerInput]}
                                        placeholderStyle={{
                                            color: theme.colors.text
                                        }}

                                        labelStyle={{
                                            color: theme.colors.text,
                                        }}

                                    />
                                </View>
                            </View>
                        </View>
                    )}

                    {selectedSecond && selectedSecond.children?.length > 0 && (
                        <View style={pageStyles.inputGroup as ViewStyle}>
                            <Text style={pageStyles.label as TextStyle}>Sub-category</Text>
                            <View style={pageStyles.pickerContainer as ViewStyle}>
                                <View style={{ zIndex: subCategoryOpen ? 9999 : 1}}>
                                    <DropDownPicker
                                        open={lowestCategoryOpen}
                                        value={lowestCategoryValue}
                                        items={lowestCategoryItems}
                                        setOpen={setLowestCategoryOpen}
                                        setValue={setLowestCategoryValue}
                                        setItems={setLowestCategoryItems}
                                        modalProps={{
                                            animationType: 'slide',
                                        }}
                                        onChangeValue={(catID) => {
                                            selectedSecond?.children.find((cat) => {
                                                if (cat.id === catID) {
                                                    setSelectedThird(cat);
                                                }
                                            })
                                        }}
                                        listMode="MODAL"
                                        style={[pageStyles.pickerInput]}
                                        placeholderStyle={{
                                            color: theme.colors.text
                                        }}

                                        labelStyle={{
                                            color: theme.colors.text,
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                <View style={pageStyles.section as ViewStyle}>
                    <Text style={pageStyles.sectionTitle as TextStyle}>Location</Text>
                    <View style={pageStyles.locationRow as ViewStyle}>
                        <View style={[pageStyles.flexOne as ViewStyle, pageStyles.marginRight as ViewStyle]}>
                            <TextInput
                                placeholder="Enter address"
                                placeholderTextColor={theme.colors.textLight}
                                value={address}
                                onChangeText={setAddress}
                                style={pageStyles.input as TextStyle}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={getLocation}
                            style={pageStyles.locationButton as ViewStyle}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="locate" size={22} color={theme.colors.primary} />
                            <Text style={pageStyles.locationButtonText as TextStyle}>Use my location</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={async () => {
                        await handleSubmit();
                    }}
                    style={pageStyles.submitButtonWrapper as ViewStyle}
                    disabled={
                        isDisabled()
                    }
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={[theme.colors.surface, theme.colors.surface]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={pageStyles.submitButton  as ViewStyle}
                    >
                        <Text style={pageStyles.submitText as TextStyle}>Create Listing</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}