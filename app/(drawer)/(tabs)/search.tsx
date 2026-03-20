import React, {useEffect, useState, useCallback} from "react";
import {
    View,
    TextInput,
    Text,
    FlatList,
    TouchableOpacity,
    Dimensions,
    ViewStyle,
    TextStyle
} from "react-native";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';

import {showMessage} from "react-native-flash-message";

import {search_listings} from "../../../services/listingsService";
import {AllListings, CategoryNode} from "../../../types/interfaces";
import ListProduct from "../../../components/ListProduct";
import {Ionicons} from "@expo/vector-icons";
import {DrawerNavigationProp} from "@react-navigation/drawer";

import { useAuth } from "../../../hooks/useAuth";
import { styles as globalStyles } from "../../../src/styles/styles";
import { theme } from "../../../src/theme/theme";
import {SafeAreaView} from "react-native-safe-area-context";
import {ImageStyle} from "expo-image";

export default function Search() {
    const [query, setQuery] = useState("");
    const [listings, setListings] = useState<AllListings>([]);
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const params = useLocalSearchParams();
    const [category, setCategory] = useState(params.category as string || "" || null);
    const { login, loading, error, user } = useAuth();

    const CARD_GAP = theme.spacing.sm;
    const CARD_WIDTH = (Dimensions.get("window").width - CARD_GAP * 3) / 2;

    useFocusEffect(
        useCallback(() => {
            if (params) {
                setCategory(params.category as string);
            }
            return () => {
                setQuery('');
                setCategory(null);
                setListings([]);
            };
        }, [params?.category])
    );

    useEffect(() => {
        if (query.length < 3 && !category) {
            setListings([]);
            return;
        }

        const fetchData = async () => {
            try {
                let found_listings;
                if (user) {
                    found_listings = await search_listings(user.id, category || null, query || null);

                    setListings(found_listings);
                }
            } catch (error) {
                setListings([]);
                showMessage({message: "Error fetching listings", type: "danger"});
            }
        }

        fetchData();
    }, [query, category])

    return (
        <SafeAreaView style={{ flex: 1, borderStyle: "solid", borderColor: 'red'  }}
                      edges={["top", "left", "right"]}
        >
            <View style={globalStyles.container as ViewStyle}>
                <View style={globalStyles.header as ViewStyle}>
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                        style={globalStyles.iconButton as ViewStyle}
                    >
                        <Ionicons name="menu" size={25} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>

                <View style={globalStyles.searchBar as ViewStyle}>
                    <Ionicons
                        name="search"
                        size={20}
                        color={theme.colors.textLight}
                        style={globalStyles.searchIcon as ImageStyle}
                    />
                    <TextInput
                        placeholder="Search"
                        placeholderTextColor={theme.colors.textLight}
                        value={query}
                        onChangeText={(text) => {
                            setQuery(text);
                            setCategory("");
                        }}
                        style={globalStyles.searchInput as TextStyle}
                    />
                </View>

                <View style={globalStyles.resultsContainer as ViewStyle}>
                    {query.length < 1 && !category ? (
                        <Text style={globalStyles.placeholderText as TextStyle}>Start typing to search…</Text>
                    ) : (
                        <Text style={globalStyles.placeholderText as TextStyle}>
                            Showing results for "{query.length > 0 ? query : category}"
                        </Text>
                    )}

                    {listings.length > 0 && (
                        <FlatList
                            data={listings}
                            keyExtractor={(item) => item.product.id}
                            renderItem={({ item }) => <ListProduct item={item}  width={CARD_WIDTH } />}
                            showsVerticalScrollIndicator={false}
                            numColumns={2}
                            columnWrapperStyle={{ gap: theme.spacing.sm }}
                            ItemSeparatorComponent={() => (
                                <View style={{ height: theme.spacing.xs }} />
                            )}
                            contentContainerStyle={{ paddingTop: theme.spacing.sm }}
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>

    );
}