import React from "react";
import {Text, View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../hooks/useTheme";
import {styles as globalStyles} from "../src/styles/styles";
import {ImageStyle} from "expo-image";

function SellButton ({ onPress }: { onPress: () => void }) {
    const { theme, isDark, toggleTheme } = useTheme();
    const pageStyles = globalStyles(theme);
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <LinearGradient
                colors={[theme.colors.surface, theme.colors.surface]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[pageStyles.gradient as ImageStyle, { marginRight: theme.spacing.sm }]}
            >
                <Text style={[pageStyles.text as TextStyle, pageStyles.plus as TextStyle]}>+</Text>
                <Text style={pageStyles.text as TextStyle}>Sell</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

export default SellButton;