import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    FlatList,
    Dimensions, SafeAreaView
} from "react-native";
import {useRouter} from "expo-router";
import ListingCard from "../../components/ListingCard";
import { useTheme } from "../../hooks/useTheme";

import {
    AllListings,
} from "../../types/interfaces";
import MultiActionButton from "../../components/MultiActionButton";
import {get_listings} from "../../services/listingsService";
import {useAuth} from "../../hooks/useAuth";

export default function Listings() {
    const router = useRouter();
    const {user} = useAuth();
    const { theme }  = useTheme();

    const [listings, setListings] = useState<AllListings>([]);

    const CARD_GAP = theme.spacing.sm;
    const CARD_WIDTH = (Dimensions.get("window").width - CARD_GAP * 3) / 2;

    const handleDelete = (productId: string) => {
        setListings(prev => prev.filter(listing => listing.product.id !== productId))
    }

    useEffect(() => {
        async function load_list() {
            if (user) {
                try {
                    const listings = await get_listings(user.id);

                    if (listings.length === 0) {
                        setListings([]);
                    }
                    setListings(listings);
                } catch (error) {
                    setListings([]);
                }
            }
        }

        load_list();

        //removed user as dependency as it was spamming calls to the
        //backend and slowing everything down? find out why
    }, [])

    return (
        <SafeAreaView style={{flex: 1, borderStyle: "solid", borderColor: 'red', backgroundColor: theme.colors.background}}
            // edges={["top", "left", "right"]}
        >
            <View style={{flex: 1, padding: theme.spacing.sm, backgroundColor: theme.colors.background}}>
                <MultiActionButton
                    name="Back"
                    icon="arrow-back"
                    onPress={() => router.replace("/")}
                />
                {
                    listings.length > 0 ? (
                        <FlatList
                            data={listings}
                            keyExtractor={(item) => item.product.id}
                            renderItem={({item}) => (
                                <View style={{width: CARD_WIDTH}}>
                                    <ListingCard listing={item} onDelete={handleDelete}/>
                                </View>
                            )}
                            numColumns={2}
                            columnWrapperStyle={{gap: theme.spacing.sm}}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={() => <View style={{height: theme.spacing.sm}}/>}
                            contentContainerStyle={{
                                paddingTop: theme.spacing.md,
                                paddingBottom: theme.spacing.xl,
                            }}
                        />
                    ) : (
                        <View>
                            <Text style={{ color: theme.colors.text}}>You dont have any listings</Text>
                        </View>
                    )
                }

            </View>

        </SafeAreaView>
    )
}