import React from "react";
import {Text, View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import { styles as globalStyles } from "../src/styles/styles";
import { useTheme } from "../hooks/useTheme";

function MultiActionButton ({ onPress, icon, name }: { onPress?: () => void, icon?: keyof typeof Ionicons.glyphMap, name?: string, }) {
    const { isDark, toggleTheme, theme } = useTheme();
    const pageStyles = globalStyles(theme);

    return (
        <TouchableOpacity onPress={onPress} style={pageStyles.multiActionButton as ViewStyle} activeOpacity={0.7}>
            <Ionicons name={icon || 'arrow-back'} size={25} color={theme.colors.text} />
            {
                name && (
                    <Text style={pageStyles.backButtonText as TextStyle}>{name}</Text>
                )
            }
        </TouchableOpacity>
    )
}

export default MultiActionButton;

