import React, {useEffect, useState} from "react";
import {View, TextInput, Text, FlatList, StyleSheet, TouchableOpacity} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";

import SellButton from "../../../components/SellButton";
import ActionButton from "../../../components/ActionButton";

import {search_listings} from "../../../services/listingsServices";
import {Products, AllListings, CategoryNode} from "../../../types/interfaces";
import ListProduct from "../../../components/ListProduct";
import taxonomy from "../../../assets/taxonomy.json";
import ListingCard from "../../../components/ListingCard";
import {Ionicons} from "@expo/vector-icons";
import {DrawerNavigationProp} from "@react-navigation/drawer";

export default function Search() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [listings, setListings] = useState<AllListings>([]);
    const [selectedTop, setSelectedTop] = useState<CategoryNode | null | undefined>(null);
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const params = useLocalSearchParams();
    const [category, setCategory] = useState(params.category as string || "");

    useEffect(() => {
        if (query.length < 3 && !category) {
            setListings([]);
            return;
        }

        const fetchData = async () => {
            console.log("I am trying to fetch something here");
            try {
                const found_listings = await search_listings(query, category);
                setListings(found_listings);
            } catch (error) {

            }
        }

        fetchData();
    }, [query, category])

    useEffect(() => {
        console.log(listings)
    }, [listings]);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "flex-start", marginBottom: 10 }}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu" size={28} />
                </TouchableOpacity>
            </View>
            <TextInput
                placeholder="Search"
                placeholderTextColor="#888"
                value={query}
                onChangeText={async (text) => {
                    setQuery(text);
                }}
                style={styles.searchInput}
            />
            {/*<View>*/}
            {/*    <Picker*/}
            {/*        selectedValue={selectedTop?.id ?? ""}*/}
            {/*        onValueChange={(catID) => {*/}
            {/*            const category = taxonomy.find((cat) => cat.id === catID);*/}
            {/*            setSelectedTop(category);*/}
            {/*        }}*/}
            {/*        // style={{*/}
            {/*        //     height: 50*/}
            {/*        // }}*/}
            {/*        style={{ marginVertical: 8, width: 300 }}*/}
            {/*    >*/}
            {/*        <Picker.Item label = "Select a category" value= "" color="#888" />*/}
            {/*        {*/}
            {/*            taxonomy.map((subCat) => (*/}
            {/*                <Picker.Item key = {subCat.id} label = {subCat.name} value = {subCat.id} color="#000" />*/}
            {/*            ))*/}
            {/*        }*/}

            {/*    </Picker>*/}
            {/*</View>*/}
            <View style={styles.resultsContainer}>
                {query.length < 1 && !category ? (
                    <Text style={styles.placeholderText}>Start typing to search…</Text>
                ) : (
                    <Text style={styles.placeholderText}>
                        Showing results for "{query.length > 0 ? query : category}"
                    </Text>
                )}

                {
                    listings.length > 0 && (
                        <FlatList
                            data={listings}
                            keyExtractor={(item) => item.product.id}
                            renderItem={({ item }) => (
                                <ListProduct item={item} key={item.product.id}>

                                </ListProduct>
                            )}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                        />
                    )
                }
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
