import {Text, View, Pressable, StyleSheet, ScrollView} from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import SellButton from "../../../components/SellButton";
import {useNavigation, useRouter} from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import ActionButton from "../../../components/ActionButton";
import ProductCategoryCard from "../../../components/ProductCategoryCard";
import { Ionicons } from "@expo/vector-icons"; import { TouchableOpacity } from "react-native"
import {useState} from "react";
import { styles } from "../../../src/styles/styles";


import { theme } from "../../../src/theme/theme";

export default function Index() {
    const router = useRouter();
    // const navigation = useNavigation();
    const navigation = useNavigation<DrawerNavigationProp<any>>();

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
                    <Ionicons name="menu" size={25} color={theme.colors.text} />
                </TouchableOpacity>
                <LinearGradient
                    colors={[theme.colors.primary, theme.colors.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.titleGradient}
                >
                    <Text style={styles.title}>Marketplace</Text>
                </LinearGradient>
            </View>

            <View style={styles.actionsRow}>
                <SellButton onPress={() => router.navigate('/sell')} />
                <ActionButton name="Listings" onPress={() => router.push('/listing')} />
            </View>

            <Pressable
                onPress={() => router.push('/search')}
                style={styles.searchBar}
            >
                <Ionicons name="search" size={20} color={theme.colors.textLight} style={styles.searchIcon} />
                <Text style={styles.searchText}>Search</Text>
            </Pressable>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Browse Categories</Text>
                <View style={styles.grid}>
                    <ProductCategoryCard
                        category="Electronics"
                        imageURL="https://images.pexels.com/photos/1105379/pexels-photo-1105379.jpeg"
                    />
                    <ProductCategoryCard
                        category="Phones"
                        imageURL="https://images.pexels.com/photos/10791677/pexels-photo-10791677.jpeg"
                    />
                    <ProductCategoryCard
                        category="Accessories"
                        imageURL="https://images.unsplash.com/photo-1585386959984-a41552231692"
                    />
                    <ProductCategoryCard
                        category="Audio Equipment"
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
    );
}
