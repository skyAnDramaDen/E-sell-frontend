import React, {useEffect, useState} from "react";
import {View, TextInput, Text, FlatList, StyleSheet, TouchableOpacity} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";

import SellButton from "../../../components/SellButton";
import ActionButton from "../../../components/ActionButton";

import {search_listings} from "../../../services/listingsService";
import {Products, AllListings, CategoryNode} from "../../../types/interfaces";
import ListProduct from "../../../components/ListProduct";
import taxonomy from "../../../assets/taxonomy.json";
import ListingCard from "../../../components/ListingCard";
import {Ionicons} from "@expo/vector-icons";
import {DrawerNavigationProp} from "@react-navigation/drawer";

import { useFocusEffect } from "expo-router";
import { useAuth } from "../../../hooks/useAuth";
import { styles as globalStyles } from "../../../src/styles/styles";
import { theme } from "../../../src/theme/theme";

export default function Search() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [listings, setListings] = useState<AllListings>([]);
    const [selectedTop, setSelectedTop] = useState<CategoryNode | null | undefined>(null);
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const params = useLocalSearchParams();
    const [category, setCategory] = useState(params.category as string || "");
    const { login, loading, error, user } = useAuth();

    useEffect(() => {
        if (query.length < 3 && !category) {
            setListings([]);
            return;
        }

        const fetchData = async () => {
            try {
                let found_listings;
                if (user) {
                    found_listings = await search_listings(query, user.id, category);
                }
                setListings(found_listings);
            } catch (error) {

            }
        }

        fetchData();
    }, [query, category])

    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.header}>
                <TouchableOpacity
                    onPress={() => navigation.openDrawer()}
                    style={globalStyles.iconButton}
                >
                    <Ionicons name="menu" size={28} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            <View style={globalStyles.searchBar}>
                <Ionicons
                    name="search"
                    size={20}
                    color={theme.colors.textLight}
                    style={globalStyles.searchIcon}
                />
                <TextInput
                    placeholder="Search"
                    placeholderTextColor={theme.colors.textLight}
                    value={query}
                    onChangeText={setQuery}
                    style={globalStyles.searchInput}
                />
            </View>

            <View style={globalStyles.resultsContainer}>
                {query.length < 1 && !category ? (
                    <Text style={globalStyles.placeholderText}>Start typing to search…</Text>
                ) : (
                    <Text style={globalStyles.placeholderText}>
                        Showing results for "{query.length > 0 ? query : category}"
                    </Text>
                )}

                {listings.length > 0 && (
                    <FlatList
                        data={listings}
                        keyExtractor={(item) => item.product.id}
                        renderItem={({ item }) => <ListProduct item={item} />}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: theme.spacing.md }} />
                        )}
                        contentContainerStyle={{ paddingTop: theme.spacing.sm }}
                    />
                )}
            </View>
        </View>
    );
}