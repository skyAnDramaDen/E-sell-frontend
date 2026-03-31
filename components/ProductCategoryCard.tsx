import React, {useState} from "react";
import {Text, View, Image, Pressable, StyleSheet, Dimensions} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../hooks/useTheme";

export default function ProductCategoryCard({ category, imageSource, onLoaded, size }: { category: string, imageSource: string, onLoaded: () => void, size?: "small" | "large"; }) {
    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const { theme } = useTheme();

    return (
        <Pressable onPress={() => {
            router.push(`/search?query=shoes&category=${category}`);
        }}
        style={{ width: ((Dimensions.get("window").width - theme.spacing.sm * 5) / 2), height: ((Dimensions.get("window").width - theme.spacing.sm * 5) / 2), marginBottom: 10,}}
        >
            <Image
                source={typeof imageSource === "string"
                    ? { uri: imageSource }
                    : imageSource}
                onLoadEnd={() => {
                    setLoaded(true)
                    onLoaded && onLoaded();
                }}
                style={[
                    styles.card,
                    size === "large" ? styles.largeCard : styles.smallCard,
                ]}

            />
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
        left: 8,
        right: 8,
        bottom: 8,
        borderWidth: 1,
        borderColor: "transparent",
        // backgroundColor: "rgba(0,0,0,0.5)",
        backgroundColor: "transparent",
        borderRadius: 5,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },

    text: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});