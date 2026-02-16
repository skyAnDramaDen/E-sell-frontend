import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function ActionButton ({ name, onPress, }: { name: string, onPress: () => void }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <LinearGradient
                colors={["transparent", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    flexDirection: "row",
                    borderRadius: 5,
                    padding: 5,
                    alignItems: "center",
                    borderWidth: 1,
                }}
            >
                <Text className="text-lg">{name}</Text>

            </LinearGradient>
        </TouchableOpacity>
    )
}

export default ActionButton;