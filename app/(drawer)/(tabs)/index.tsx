import {Text, View, Pressable, StyleSheet, ScrollView, ViewStyle, TextStyle} from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import SellButton from "../../../components/SellButton";
import {useNavigation, useRouter} from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import ActionButton from "../../../components/ActionButton";
import ProductCategoryCard from "../../../components/ProductCategoryCard";
import { Ionicons } from "@expo/vector-icons"; import { TouchableOpacity } from "react-native"
import React from "react";
import { styles } from "../../../src/styles/styles";

import { theme } from "../../../src/theme/theme";
import {SafeAreaView} from "react-native-safe-area-context";

export default function Index() {
    const router = useRouter();
    const navigation = useNavigation<DrawerNavigationProp<any>>();

    return (
        <SafeAreaView style={{ flex: 1, borderStyle: "solid", borderColor: 'red'  }}
                      edges={["top", "left", "right"]}
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer as ViewStyle}>
                <View style={styles.header as ViewStyle}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton as ViewStyle}>
                        <Ionicons name="menu" size={25} color={theme.colors.text} />
                    </TouchableOpacity>
                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.secondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.titleGradient as ViewStyle}
                    >
                        <Text style={styles.title as TextStyle}>Marketplace</Text>
                    </LinearGradient>
                </View>

                <View style={styles.actionsRow as ViewStyle}>
                    <SellButton onPress={() => router.navigate('/sell')} />
                    <ActionButton name="Listings" onPress={() => router.push('/listing')} />
                </View>

                <Pressable
                    onPress={() => router.push('/search')}
                    style={styles.searchBar as ViewStyle}
                >
                    <Ionicons name="search" size={20} color={theme.colors.textLight} style={styles.searchIcon as TextStyle} />
                    <Text style={styles.searchText as TextStyle}>Search</Text>
                </Pressable>

                <View style={styles.section as ViewStyle}>
                    <Text style={styles.sectionTitle as TextStyle}>Browse Categories</Text>
                    <View style={styles.grid as ViewStyle}>
                        <ProductCategoryCard
                            category="Electronics"
                            imageURL="https://images.pexels.com/photos/1105379/pexels-photo-1105379.jpeg"
                        />
                        <ProductCategoryCard
                            category="Mobile Phones"
                            imageURL="https://images.pexels.com/photos/10791677/pexels-photo-10791677.jpeg"
                        />
                        <ProductCategoryCard
                            category="Accessories"
                            imageURL="https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg"
                        />
                        <ProductCategoryCard
                            category="Audio"
                            imageURL="https://images.pexels.com/photos/14935011/pexels-photo-14935011.jpeg"
                        />
                        <ProductCategoryCard
                            category="Gaming"
                            imageURL="https://images.pexels.com/photos/35005905/pexels-photo-35005905.jpeg"
                        />
                        <ProductCategoryCard
                            category="Cameras"
                            imageURL="https://images.pexels.com/photos/955794/pexels-photo-955794.jpeg"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


const local_styles = StyleSheet.create({
    header: {
        height: 60,
        justifyContent: "center",
    },

    menuButton: {
        position: "absolute",
        left: 15,
        zIndex: 10,
    },

    titleGradient: {
        position: "absolute",
        left: 0,
        right: 0,
        paddingVertical: 8,
        alignItems: "center",
    },

    title: {
        fontSize: 20,
        fontWeight: "600",
        color: "#fff",
    },
})