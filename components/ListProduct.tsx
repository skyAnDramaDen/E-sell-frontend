import React, {useState, useEffect} from "react";
import {
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Image,
    Pressable,
    Modal,
    StyleSheet,
    StyleProp,
    ViewStyle
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useLocalSearchParams, useRouter} from "expo-router";

import {
    Listing,
    Product
} from "../types/interfaces";

export default function ListProduct({ item, width }: { item: Listing, width?: number }) {
    const router = useRouter();
    return (
        <TouchableOpacity
            style={[styles.container, { width }]}
            onPress={() => {
                router.push(`/listing/${item.product.id}`);
            }}
        >
            <Image
                source={{ uri: item.images[0] }}
                style={styles.list_product_image}
            />

            <View style={styles.details}>
                <View style={styles.listing_info_card}>
                    <Text style={styles.name}>{item.product.name}</Text>
                    {item.product.price && <Text style={styles.price}>£{item.product.price}</Text>}
                </View>
                {item.product.topCategory && <Text style={styles.category}
                                                   numberOfLines={1}
                                                   ellipsizeMode="tail"
                >{item.product.lowestCategory}</Text>}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        padding: 12,
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 8,
        gap: 12,
    },

    list_product_image: {
        width: 170,
        height: 170,
        borderRadius: 8,
        backgroundColor: "#eee",
    },

    details: {
        flex: 1,
    },

    listing_info_card: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    name: {
        fontSize: 16,
        fontWeight: "600",
        flexShrink: 1,
    },


    // listing_info_card: {
    //     display: "flex",
    //     flexDirection: "row",
    //     alignItems: "center",
    //     justifyContent: "space-between"
    // },
    //
    // details: {
    //     flex: 1,
    //     // justifyContent: "space-between",
    // },
    //
    // name: {
    //     fontSize: 16,
    //     fontWeight: "600",
    // },

    price: {
        fontSize: 16,
        color: "#444",
        // marginTop: 4,
    },

    category: {
        fontSize: 12,
        color: "#777",
        marginTop: 2,
    },
});


