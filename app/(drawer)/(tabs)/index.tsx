import {Text, View, Pressable, StyleSheet, ScrollView} from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import SellButton from "../../../components/SellButton";
import {useNavigation, useRouter} from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import ActionButton from "../../../components/ActionButton";
import ProductCategoryCard from "../../../components/ProductCategoryCard";
import { Ionicons } from "@expo/vector-icons"; import { TouchableOpacity } from "react-native"
import {useState} from "react";

export default function Index() {
    const router = useRouter();
    // const navigation = useNavigation();
    const navigation = useNavigation<DrawerNavigationProp<any>>();

    return (
        <ScrollView >
            <View style={{ flex: 1, padding: 10 }}>
                <View style={{ flexDirection: "row", justifyContent: "flex-start", marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="menu" size={28} />
                    </TouchableOpacity>
                </View>

                <View>
                    <View style={styles.actions}>
                        <SellButton onPress={() => router.navigate("/sell")} />
                        <ActionButton
                            name="My Listings"
                            onPress={() => router.push("/listing")}
                        />
                    </View>

                    <Pressable
                        onPress={() => router.push("/search")}
                        style={{
                            backgroundColor: "#eee",
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 20,
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>Search</Text>
                    </Pressable>

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
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 12,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: 5,
    },
});
