import React, {useState, useEffect} from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from '@react-native-picker/picker';
import {useLocalSearchParams, useRouter} from "expo-router";

import {
    Product
} from "../../types/interfaces";

import { get_listing } from "../../services/listingsService";

import { useAuth } from "../../hooks/useAuth";
import ActionButton from "../../components/ActionButton";

export default function Listing() {
    const router = useRouter();
    const { login, loading, error, user } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);
    const [imageURLs, setImageURLs] = useState([]);

    const { id } = useLocalSearchParams();
    const listing_id = Array.isArray(id) ? id[0] : id;

    useEffect(() => {
        async function load() {
            const { product, imageURLs } = await get_listing(listing_id);
            setProduct(product);
            setImageURLs(imageURLs);
        }
        load();
    }, [id])

    return (
        <ScrollView style={styles.container}>
            <ActionButton name="Back" onPress={() => {
                router.replace("/listing");
            }} />
            <ScrollView horizontal pagingEnabled style={styles.imageCarousel}>
                {imageURLs != null && imageURLs.map((url, index) => (
                    <Image key={index} source={{ uri: url }} style={styles.image} />
                ))}
            </ScrollView>
            <View style={styles.headerSection}>
                {
                    product ? (
                            <View>
                                <Text style={styles.title}>{product.name}</Text>
                                <Text style={styles.price}>£{product.price}</Text>
                            </View>
                    ) : (
                        <View></View>
                    )
                }
            </View>
            <View style={styles.metaSection}>
                {
                    product ? (
                        <View>
                            <Text style={styles.metaText}>Category: {product.topCategory}/{product.subCategory}/{product.lowestCategory}</Text>
                            <Text style={styles.metaText}>Condition: {product.condition == "good" ? "Good" : ""}</Text>
                        </View>
                    ) : (
                        <View></View>
                    )
                }
            </View>
            <View style={styles.section}>
                {
                    product ? (
                        <View>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.description}>{product.description}</Text>
                        </View>
                    ) : (
                        <View></View>
                    )
                }
            </View>
            <View style={styles.section}>
                {
                    product ? (
                        <View>
                            <Text style={styles.sectionTitle}>Seller</Text>

                        </View>
                    ) : (
                        <View></View>
                    )
                }
            </View>
            <Text>
                {/*<TouchableOpacity style={styles.button} onPress={() => router.push(`/chat/${product.user_id}`)} >*/}
                {/*    <LinearGradient colors={["#4c669f", "#3b5998", "#192f6a"]} style={styles.buttonGradient} >*/}
                {/*        <Text style={styles.buttonText}>Contact Seller</Text>*/}
                {/*    </LinearGradient>*/}
                {/*</TouchableOpacity>*/}
            </Text>
            <View style={{ height: 40 }} />
        </ScrollView> );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 10 },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", },
    imageCarousel: { width: "100%", height: 300, backgroundColor: "#f2f2f2", },
    image: { width: 400, height: 300, resizeMode: "cover", },
    headerSection: { padding: 20, borderBottomWidth: 1, borderColor: "#eee", },
    title: { fontSize: 24, fontWeight: "700", marginBottom: 8, },
    price: { fontSize: 22, fontWeight: "600", color: "#2a7", },
    metaSection: { paddingHorizontal: 20, paddingVertical: 10, },
    metaText: { fontSize: 16, color: "#555", marginBottom: 4, },
    section: { padding: 20, },
    sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8, },
    description: { fontSize: 16, color: "#444", lineHeight: 22, },
    sellerName: { fontSize: 16, fontWeight: "600", },
    button: { marginHorizontal: 20, marginTop: 10, },
    buttonGradient: { paddingVertical: 15, borderRadius: 10, alignItems: "center", },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "600", },
});