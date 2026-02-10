import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function SellButton ({ onPress }: { onPress: () => void }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <LinearGradient
                colors={["#4B76C8", "#1F4691"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    flexDirection: "row",
                    borderRadius: 5,
                    padding: 5,
                    alignItems: "center",
                }}
            >
                <Text>+</Text>
                <Text>Sell</Text>

            </LinearGradient>
        </TouchableOpacity>
    )
}

export default SellButton;