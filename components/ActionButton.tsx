import React from "react";
import {Text, TouchableOpacity, TextStyle} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../hooks/useTheme";
import { styles as globalStyles } from "../src/styles/styles";
import {ImageStyle} from "expo-image";

function ActionButton ({ name, onPress,}: { name: string, onPress: () => void, }) {
    const { theme } = useTheme();
    const pageStyles = globalStyles(theme)
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} >
            <LinearGradient
                colors={[theme.colors.surface, theme.colors.surface]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[pageStyles.gradient as ImageStyle]}
            >
                <Text style={pageStyles.text as TextStyle}>{name}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

export default ActionButton;
