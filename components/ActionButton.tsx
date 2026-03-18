import React from "react";
import {Text, View, TouchableOpacity, StyleSheet, TextStyle} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {Ionicons} from "@expo/vector-icons";
import {theme} from "../src/theme/theme";
import { styles } from "../src/styles/styles";
import {ImageStyle} from "expo-image";

function ActionButton ({ name, onPress,}: { name: string, onPress: () => void, }) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} >
            <LinearGradient
                colors={["#fff", "#fff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradient as ImageStyle, { marginRight: theme.spacing.sm }]}
            >
                <Text style={styles.text as TextStyle}>{name}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

export default ActionButton;
