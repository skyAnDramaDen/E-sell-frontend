import { Stack, SplashScreen } from "expo-router";
import React from 'react';
import { AuthProvider, AuthContext } from "../contexts/AuthContext";
import { useFonts } from 'expo-font';
import { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets, } from 'react-native-safe-area-context';

import "./globals.css";

// function RootLayoutContent() {
//   const { user, loading } = useContext(AuthContext)!;
//
//   if (loading) {
//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <ActivityIndicator size="large" />
//         </View>
//     );
//   }
//
//   return (
//       <Stack>
//           <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
//           <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
//         {/*{!user ? (*/}
//
//         {/*    <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />*/}
//         {/*) : (*/}
//
//         {/*    <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />*/}
//         {/*)}*/}
//       </Stack>
//   );
// }

function RootLayoutContent() {
    const insets = useSafeAreaInsets();
    return (
        <SafeAreaView style={{ flex: 1, borderStyle: "solid", borderColor: 'red'  }} edges={["top"]} >
            <Stack
                screenOptions = {{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="index" options={{ headerShown: false,
                    title: "Home"}} />
                <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="listing/index" options={{ headerShown: false }} />
            </Stack>
        </SafeAreaView>
    );
}


export default function RootLayout() {
  const [fontsLoaded] = useFonts({

  });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }


    return (
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
  );
}
