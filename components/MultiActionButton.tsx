import React from "react";
import {Text, View, TouchableOpacity, StyleSheet} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {Ionicons} from "@expo/vector-icons";
import {theme} from "../src/theme/theme";
import { styles } from "../src/styles/styles";

function MultiActionButton ({ onPress, icon, name }: { onPress?: () => void, icon?: keyof typeof Ionicons.glyphMap, name?: string, }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.multiActionButton} activeOpacity={0.7}>
            <Ionicons name={icon || 'arrow-back'} size={25} color={theme.colors.text} />
            {
                name && (
                    <Text style={styles.backButtonText}>{name}</Text>
                )
            }
        </TouchableOpacity>
    )
}

export default MultiActionButton;

