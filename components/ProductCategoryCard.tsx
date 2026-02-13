import React from "react";
import {useState, useEffect} from "react";
import {Text, View, TouchableOpacity, FlatList, Image, Pressable, Modal, StyleSheet} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useLocalSearchParams, useRouter} from "expo-router";
import { useAuth } from "../hooks/useAuth";

import {
    Listing,
    Product
} from "../types/interfaces";

import {delete_listing} from "../services/listingsServices";

export default function ProductCategoryCard({ category, imageURL, size }: { category: string, imageURL: string, size?: "small" | "large"; }) {
    const router = useRouter();
    return (
        <Pressable onPress={() => {
            router.push(`/search?query=shoes&category=${category}`);
            // router.navigate("/sell");
        }}
        style={{ width: 190, height: 190, }}
        >
            <Image source={{
                uri: imageURL,
            }}
                   style={[
                       styles.card,
                       size === "large" ? styles.largeCard : styles.smallCard,
                   ]}
            />
            {/*<Text>${category}</Text>*/}
            <View style={styles.overlay}>
                <Text style={styles.text}>{category}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        overflow: "hidden",
        // marginBottom: 12,
    },
    smallCard: {
        width: "100%",
        height: "100%",
    },
    largeCard: {
        width: "100%",
        height: "100%",
    },
    image: {
        // width: "100%",
        // height: "100%",
    },
    overlay: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        // padding: 8,
    },
    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});