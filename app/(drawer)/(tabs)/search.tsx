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
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';

import {showMessage} from "react-native-flash-message";

import {search_listings} from "../../../services/listingsService";
import {AllListings} from "../../../types/interfaces";
import ListProduct from "../../../components/ListProduct";
import {Ionicons} from "@expo/vector-icons";
import {DrawerNavigationProp} from "@react-navigation/drawer";

import { useAuth } from "../../../hooks/useAuth";
import { styles as globalStyles } from "../../../src/styles/styles";
import {SafeAreaView} from "react-native-safe-area-context";
import {ImageStyle} from "expo-image";
import ActionButton from "../../../components/ActionButton";

import { useTheme } from "../../../hooks/useTheme";

export default function Search() {
    const [query, setQuery] = useState("");
    const [listings, setListings] = useState<AllListings>([]);
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const params = useLocalSearchParams();
    const [category, setCategory] = useState(params.category as string || "" || null);
    const { user } = useAuth();
    const { theme } = useTheme();
    const pageStyles = globalStyles(theme);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const CARD_GAP = theme.spacing.sm;
    const CARD_WIDTH = (Dimensions.get("window").width - CARD_GAP * 3) / 2;

    useFocusEffect(
        useCallback(() => {
            if (params) {
                setCategory(params.category as string);
            }

            return () => {
                // setQuery('');
                // setCategory(null);
                // setListings([]);
                // router.setParams({ category: null });
            };
        }, [params?.category])
    );

    useEffect(() => {
        if (query.length < 3 && !category) {
            setListings([]);
            return;
        }

        setLoading(true);

        const fetchData = async () => {
            try {
                let found_listings;
                if (user) {
                    found_listings = await search_listings(user.id, category || null, query || null);

                    setListings(found_listings);
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                setListings([]);
                showMessage({message: "Error fetching listings", type: "danger"});
            }
        }

        fetchData();
    }, [query, category])

    return (
        <SafeAreaView style={{ flex: 1, borderStyle: "solid", borderColor: 'red', backgroundColor: theme.colors.background  }}
                      edges={["top", "left", "right"]}
        >
            <View style={pageStyles.container as ViewStyle}>
                <View style={pageStyles.header as ViewStyle}>
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                        style={pageStyles.menuButton as ViewStyle}
                    >
                        <Ionicons name="menu" size={25} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>

                <View style={pageStyles.searchBar as ViewStyle}>
                    <Ionicons
                        name="search"
                        size={20}
                        color={theme.colors.textLight}
                        style={pageStyles.searchIcon as ImageStyle}
                    />
                    <TextInput
                        placeholder="Search"
                        placeholderTextColor={theme.colors.textLight}
                        value={query}
                        onChangeText={(text) => {
                            setQuery(text);
                            setCategory("");
                        }}
                        style={pageStyles.searchInput as TextStyle}
                    />
                </View>

                <View style={pageStyles.resultsContainer as ViewStyle}>
                    <View style = {{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        {query.length < 1 && !category ? (
                            <Text style={pageStyles.placeholderText as TextStyle}>Start typing to search…</Text>
                        ) : (
                            <Text style={pageStyles.placeholderText as TextStyle}>
                                {
                                    (category === null && query.length < 3) ? "Start typing to search" :
                                        (category != null || query.length > 2) && listings.length < 1 && loading ? "Loading..." :
                                            (category != null || query.length > 2) && listings.length > 0 ? `Showing results for \"${query.length > 0 ? query : category}\"` :
                                            (category != null || query.length > 2) && listings.length < 1 && !loading
                                            ? "There are no results for that search"
                                            : ""
                                }
                            </Text>
                        )}

                        <ActionButton name={"Clear"} onPress={() => {
                            setLoading(false);
                            setQuery("");
                            setCategory(null);
                            setListings([]);
                            router.setParams({ category: null });
                        }}
                        />
                    </View>

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