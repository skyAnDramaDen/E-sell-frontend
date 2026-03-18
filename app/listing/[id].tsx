import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ViewStyle,
    TextStyle,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context"
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from '@react-native-picker/picker';
import {useLocalSearchParams, useRouter} from "expo-router";
import { theme } from "../../src/theme/theme";
import { Ionicons } from '@expo/vector-icons';
import { styles as globalStyles } from '../../src/styles/styles';

import {
    Product
} from "../../types/interfaces";

import { get_listing } from "../../services/listingsService";

import { useAuth } from "../../hooks/useAuth";
import ActionButton from "../../components/ActionButton";
import MultiActionButton from "../../components/MultiActionButton";
import {
    ProductAndSellerResponseBody
} from "../../types/interfaces";

export default function Listing() {
    const router = useRouter();
    const { login, loading, error, user } = useAuth();
    const [loadingPage, setLoadingPage] = useState(true);

    const [product, setProduct] = useState<ProductAndSellerResponseBody | null>(null);
    const [imageURLs, setImageURLs] = useState<string[]>([]);

    const { id } = useLocalSearchParams();
    const listing_id = Array.isArray(id) ? id[0] : id;

    useEffect(() => {
        async function load() {
            const fetched_product = await get_listing(listing_id);

            setLoadingPage(false);
            if (fetched_product) {
                setProduct(fetched_product);
                setImageURLs(fetched_product.images);
            }
        }
        load();
    }, [id])

    if (loadingPage) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: theme.colors.textLight }}>Loading...</Text>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: theme.colors.error }}>Product not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, borderStyle: "solid", borderColor: 'red'  }}
                      edges={["top", "left", "right"]}
            // edges={["top"]}
        >
            <ScrollView
                contentContainerStyle={localStyles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={globalStyles.listingTopSection as ViewStyle}>
                    <MultiActionButton
                        name="Back"
                        icon="arrow-back"
                        onPress={() => router.back()}
                    />
                </View>

                {imageURLs && imageURLs.length > 0 ? (
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={localStyles.imageCarousel}
                    >
                        {imageURLs && imageURLs.map((url, index) => (
                            <Image key={index} source={{ uri: url }} style={localStyles.image} />
                        ))}
                    </ScrollView>
                ) : (
                    <View style={localStyles.imagePlaceholder}>
                        <Ionicons name="image-outline" size={48} color={theme.colors.textLight} />
                        <Text style={localStyles.placeholderText}>No images</Text>
                    </View>
                )}

                <View style={localStyles.infoCard}>
                    <View style={localStyles.headerRow}>
                        <Text style={localStyles.productName}>{product.name}</Text>
                        <Text style={localStyles.productPrice}>£{product.price}</Text>
                    </View>

                    <View style={localStyles.metaContainer}>
                        <View style={localStyles.metaItem}>
                            <Ionicons name="pricetag-outline" size={16} color={theme.colors.textLight} />
                            <Text style={localStyles.metaText}>
                                {product.topCategory} / {product.subCategory} / {product.lowestCategory}
                            </Text>
                        </View>
                        <View style={localStyles.metaItem}>
                            <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.textLight} />
                            <Text style={localStyles.metaText}>
                                Condition: {product.condition === 'good' ? 'Good' : product.condition === "like_new" ? "Used like new" : product.condition === "new" ? "New" : "Good"}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={globalStyles.section as ViewStyle}>
                    <Text style={globalStyles.sectionTitle as TextStyle}>Description</Text>
                    <Text style={localStyles.description}>{product.description}</Text>
                </View>

                <View style={globalStyles.section as ViewStyle}>
                    <Text style={globalStyles.sectionTitle as TextStyle}>Seller</Text>
                    <View style={localStyles.sellerRow}>
                        <Ionicons name="person-circle-outline" size={48} color={theme.colors.primary} />
                        <View style={localStyles.sellerInfo}>
                            <Text style={localStyles.sellerName}>{product.sellerName}</Text>
                            <Text style={localStyles.sellerJoined}>{product.sellerPhoneNumber}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        if (product) {
                            router.push({
                                pathname: "/chat/0" as any,
                                params: {
                                    buyerId: user?.id,
                                    buyerName: user?.username,
                                    sellerId: product.sellerId,
                                    sellerName: product.sellerName,
                                },
                            });
                        }
                    }}
                    activeOpacity={0.8}
                    style={localStyles.contactButtonWrapper}
                >
                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.secondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={localStyles.contactButton}
                    >
                        <Ionicons name="chatbubble-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={localStyles.contactButtonText} onPress={() => {

                        }} >Message Seller</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={{ height: theme.spacing.xl }} />
            </ScrollView>
        </SafeAreaView>
    );
}
const localStyles = StyleSheet.create({
    scrollContainer: {
        padding: theme.spacing.sm,
        paddingBottom: theme.spacing.xl,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.sm,
    },
    backButtonText: {
        marginLeft: theme.spacing.xs,
        fontSize: 16,
        color: theme.colors.text,
        fontWeight: '500',
    },
    imageCarousel: {
        marginBottom: theme.spacing.sm,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    image: {
        width: "100%",
        height: 250,
        resizeMode: 'cover',
        borderRadius: theme.borderRadius.lg,
        marginRight: theme.spacing.sm,
    },
    imagePlaceholder: {
        width: '100%',
        height: 200,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
        ...theme.shadows.sm,
    },
    placeholderText: {
        marginTop: theme.spacing.sm,
        fontSize: 16,
        color: theme.colors.textLight,
    },
    infoCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
        ...theme.shadows.md,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    productName: {
        fontSize: 22,
        fontWeight: '700',
        color: theme.colors.text,
        flex: 1,
        marginRight: theme.spacing.md,
    },
    productPrice: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    metaContainer: {
        marginTop: theme.spacing.sm,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    metaText: {
        marginLeft: theme.spacing.sm,
        fontSize: 14,
        color: theme.colors.textLight,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: theme.colors.text,
        marginTop: theme.spacing.xs,
    },
    sellerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.sm,
    },
    sellerInfo: {
        marginLeft: theme.spacing.md,
    },
    sellerName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
    },
    sellerJoined: {
        fontSize: 14,
        color: theme.colors.textLight,
        marginTop: 2,
    },
    contactButtonWrapper: {
        marginTop: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.xl,
    },
    contactButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
});