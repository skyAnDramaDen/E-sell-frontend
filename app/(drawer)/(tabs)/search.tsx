import React, {useEffect, useState} from "react";
import {View, TextInput, Text, FlatList, StyleSheet, TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";

import SellButton from "../../../components/SellButton";
import ActionButton from "../../../components/ActionButton";

import {search_listings} from "../../../services/listingsServices";
import {Products, AllListings} from "../../../types/interfaces";
import ListProduct from "../../../components/ListProduct";

export default function Search() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [listings, setListings] = useState<AllListings>([]);

    useEffect(() => {
        if (query.length < 3) {
            setListings([]);
            return;
        }

        const fetchData = async () => {
            try {
                const found_listings = await search_listings(query);
                setListings(found_listings);
            } catch (error) {
            }
        }

        fetchData();
    }, [query])

    useEffect(() => {
        console.log(listings)
    }, [listings]);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search listings…"
                placeholderTextColor="#888"
                value={query}
                onChangeText={async (text) => {
                    setQuery(text);
                }}
                style={styles.searchInput}
            />
            <View style={styles.resultsContainer}>
                {query.length === 0 ? (
                    <Text style={styles.placeholderText}>Start typing to search…</Text>
                ) : (
                    <Text style={styles.placeholderText}>
                        Showing results for "{query}"
                    </Text>
                )}

                {
                    listings.length > 0 && (
                        <View style={styles.resultsList}>
                            {
                                listings.map((item) => (
                                    <ListProduct item={item} key={item.product.id}>

                                </ListProduct>
                                ))}
                        </View>)}
            </View>
            <View style={styles.bottomButtons}>
                {/*<SellButton />*/}
                {/*<ActionButton />*/}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
    },
    searchInput: {
        backgroundColor: "#f2f2f2",
        padding: 14,
        borderRadius: 10,
        fontSize: 16,
        color: "#000",
    },
    resultsContainer: {
        flex: 1,
        marginTop: 20,
    },
    placeholderText: {
        fontSize: 16,
        color: "#666",
    },
    bottomButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    // resultsContainer: {
    //     marginTop: 10,
    //     paddingHorizontal: 16,
    // },
    //
    // placeholderText: {
    //     color: "#888",
    //     marginBottom: 8,
    // },

    resultsList: {
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingVertical: 8,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    resultItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    resultText: {
        fontSize: 16,
    },

});
