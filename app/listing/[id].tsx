import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ViewStyle,
    TextStyle,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient";
import {useLocalSearchParams, useRouter} from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import { Ionicons } from '@expo/vector-icons';
import { styles as globalStyles } from '../../src/styles/styles';

import { get_listing } from "../../services/listingsService";

import { useAuth } from "../../hooks/useAuth";
import MultiActionButton from "../../components/MultiActionButton";
import {
    ProductAndSellerResponseBody
} from "../../types/interfaces";

export default function Listing() {
    const router = useRouter();
    const { user } = useAuth();
    const [loadingPage, setLoadingPage] = useState(true);

    const [product, setProduct] = useState<ProductAndSellerResponseBody | null>(null);
    const [imageURLs, setImageURLs] = useState<string[]>([]);

    const { id } = useLocalSearchParams();
    const listing_id = Array.isArray(id) ? id[0] : id;

    const { theme, toggleTheme, isDark } = useTheme();
    const pageStyles = globalStyles(theme);

    const {
        from
    } = useLocalSearchParams<{
        from: string;
    }>();

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
        <SafeAreaView style={{ flex: 1, borderStyle: "solid", borderColor: 'red', backgroundColor: theme.colors.background  }}
                      edges={["top", "left", "right"]}
        >
            <ScrollView
                contentContainerStyle={[pageStyles.profileScrollContainer, { backgroundColor: theme.colors.background }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={pageStyles.listingTopSection as ViewStyle}>
                    <MultiActionButton
                        name="Back"
                        icon="arrow-back"
                        onPress={() => {
                            if (from === "listings" || from === "sell-page") {
                                router.replace("/listing");
                            } else if (from === "search-page") {
                                router.replace("/search");
                            }
                        }}
                    />
                </View>

                {imageURLs && imageURLs.length > 0 ? (
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={pageStyles.imageCarousel}
                    >
                        {imageURLs && imageURLs.map((url, index) => (
                            <Image key={index} source={{ uri: url }} style={pageStyles.image} />
                        ))}
                    </ScrollView>
                ) : (
                    <View style={pageStyles.imagePlaceholder}>
                        <Ionicons name="image-outline" size={48} color={theme.colors.textLight} />
                        <Text style={pageStyles.listingPlaceholderText}>No images</Text>
                    </View>
                )}

                <View style={pageStyles.infoCard}>
                    <View style={pageStyles.headerRow}>
                        <Text style={pageStyles.productName}>{product.name}</Text>
                        <Text style={pageStyles.productPrice}>£{product.price}</Text>
                    </View>

                    <View style={pageStyles.metaContainer}>
                        <View style={pageStyles.metaItem}>
                            <Ionicons name="pricetag-outline" size={16} color={theme.colors.textLight} />
                            <Text style={pageStyles.metaText}>
                                {product.topCategory} / {product.subCategory} / {product.lowestCategory}
                            </Text>
                        </View>
                        <View style={pageStyles.metaItem}>
                            <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.textLight} />
                            <Text style={pageStyles.metaText}>
                                Condition: {product.condition === 'good' ? 'Good' : product.condition === "like_new" ? "Used like new" : product.condition === "new" ? "New" : "Good"}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={pageStyles.section as ViewStyle}>
                    <Text style={pageStyles.sectionTitle as TextStyle}>Description</Text>
                    <Text style={pageStyles.description}>{product.description}</Text>
                </View>

                {
                    user && product && user.id != product.sellerId && (
                        <View>
                            <View style={pageStyles.section as ViewStyle}>
                                <Text style={pageStyles.sectionTitle as TextStyle}>Seller</Text>
                                <View style={pageStyles.sellerRow}>
                                    <Ionicons name="person-circle-outline" size={48} color={theme.colors.primary} />
                                    <View style={pageStyles.sellerInfo}>
                                        <Text style={pageStyles.sellerName}>{product.sellerName}</Text>
                                        <Text style={pageStyles.sellerJoined}>{product.sellerPhoneNumber}</Text>
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
                                style={pageStyles.contactButtonWrapper}
                            >
                                <LinearGradient
                                    colors={[theme.colors.primary, theme.colors.secondary]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={pageStyles.contactButton}
                                >
                                    <Ionicons name="chatbubble-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={pageStyles.contactButtonText} onPress={() => {

                                    }} >Message Seller</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )
                }

                <View style={{ height: theme.spacing.xl }} />
            </ScrollView>
        </SafeAreaView>
    );
}