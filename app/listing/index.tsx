import React, {useState, useEffect} from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from '@react-native-picker/picker';
import {useLocalSearchParams, useRouter} from "expo-router";
import ListingCard from "../../components/ListingCard";

import {
    Product,
    AllListings,
} from "../../types/interfaces";

import {get_listing, get_listings} from "../../services/listingsServices";

import { useAuth } from "../../hooks/useAuth";
 export default function Listings() {
     const router = useRouter();
     const { login, loading, error, user } = useAuth();

     const [listings, setListings] = useState<AllListings>([]);

     const handleDelete = (productId: string) => {
         setListings(prev => prev.filter(listing => listing.product.id !== productId) )
     }

     useEffect(() => {
         async function load_list() {
             if (user) {
                 const listings  = await get_listings(user.id);
                 setListings(listings);
             }
         }

         load_list();
     }, [user])

     return (
         <View style={{ flex: 1, padding: 16 }}>
             <FlatList
                 data={listings}
                 keyExtractor={(item) => item.product.id}
                 renderItem={({ item }) => ( <ListingCard listing={item}
                                                          onDelete={handleDelete}/> )}
                 showsVerticalScrollIndicator={false}
                 ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
             />
         </View> );
}