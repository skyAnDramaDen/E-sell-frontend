 import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    FlatList,
    Dimensions, SafeAreaView
} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import ListingCard from "../../components/ListingCard";
import { theme } from "../../src/theme/theme";

 import {
    Product,
    AllListings,
} from "../../types/interfaces";

import {get_listing, get_listings} from "../../services/listingsService";

import { useAuth } from "../../hooks/useAuth";

import MultiActionButton from "../../components/MultiActionButton";
export default function Listings() {
     const router = useRouter();
     const { login, loading, error, user } = useAuth();

     const [listings, setListings] = useState<AllListings>([]);

     const CARD_GAP = theme.spacing.sm;
     const CARD_WIDTH = (Dimensions.get("window").width - CARD_GAP * 3) / 2;

     const handleDelete = (productId: string) => {
         setListings(prev => prev.filter(listing => listing.product.id !== productId) )
     }

     useEffect(() => {
         async function load_list() {
             if (user) {
                try {
                    const listings  = await get_listings(user.id);

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
     }, [user])

     return (
         <SafeAreaView style={{ flex: 1, borderStyle: "solid", borderColor: 'red'  }}
                       // edges={["top", "left", "right"]}
         >
         <View style={{ flex: 1, padding: theme.spacing.sm }}>
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
                         renderItem={({ item }) => (
                             <View style={{ width: CARD_WIDTH }}>
                                 <ListingCard listing={item} onDelete={handleDelete} />
                             </View>
                         )}
                         numColumns={2}
                         columnWrapperStyle={{ gap: theme.spacing.sm }}
                         showsVerticalScrollIndicator={false}
                         ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sm }} />}
                         contentContainerStyle={{
                             paddingTop: theme.spacing.md,
                             paddingBottom: theme.spacing.xl,
                         }}
                     />
                 ) : (
                     <View>
                         <Text>You dont have any listings</Text>
                     </View>
                 )
             }

         </View>

         </SafeAreaView>
     )
}