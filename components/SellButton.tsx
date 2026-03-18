import React from "react";
import {Text, View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import {theme} from "../src/theme/theme";
import {styles} from "../src/styles/styles";
import {ImageStyle} from "expo-image";

function SellButton ({ onPress }: { onPress: () => void }) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <LinearGradient
                colors={["#fff", "#fff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradient as ImageStyle, { marginRight: theme.spacing.sm }]}
            >
                <Text style={[styles.text as TextStyle, styles.plus as TextStyle]}>+</Text>
                <Text style={styles.text as TextStyle}>Sell</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

export default SellButton;