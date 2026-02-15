import React from "react";
import {useState, useEffect} from "react";
import {Text, View, TouchableOpacity, FlatList, Image, Pressable, Modal, StyleSheet} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useLocalSearchParams, useRouter} from "expo-router";

import {
    Listing,
    Product
} from "../types/interfaces";

import {delete_listing} from "../services/listingsService";

export default function ListProduct({ item }: { item: Listing }) {
    const router = useRouter();
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => router.push(`/listing/${item.product.id}`)}
        >
            <Image
                source={{ uri: item.images[0] }}
                style={styles.image}
            />

            <View style={styles.details}>
                <Text style={styles.name}>{item.product.name}</Text>
                {item.product.price && <Text style={styles.price}>£{item.product.price}</Text>}
                {item.product.topCategory && <Text style={styles.category}>{item.product.subCategory}</Text>}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 12,
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 8,
        gap: 12,
    },

    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: "#eee",
    },

    details: {
        flex: 1,
        justifyContent: "space-between",
    },

    name: {
        fontSize: 16,
        fontWeight: "600",
    },

    price: {
        fontSize: 14,
        color: "#444",
        marginTop: 4,
    },

    category: {
        fontSize: 12,
        color: "#777",
        marginTop: 2,
    },
});


