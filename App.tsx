import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";

import { SplashScreen } from "./src/Splash";
import { HomeScreen } from "./src/screens/Home";
import { ProfileScreen } from "./src/screens/Profile";
import { NoteScreen } from "./src/screens/NoteScreen";
import { AddNote } from "./src/screens/AddNote";
import { SignUpScreen } from "./src/screens/SignUp";
import { SignInScreen } from "./src/screens/SignIn";

import AsyncStorage from "@react-native-async-storage/async-storage";

export type Note = {
  id: string;
  title: string;
  content: string;
};

export type RootParamList = {
  Splash: undefined;
  Home: { newNote?: Note } | undefined;
  Profile: { userId: number; name: string };
  NoteScreen: { note: Note };
  AddNote: undefined;
  SignUpScreen: undefined;
  SignInScreen: undefined;
};

const Stack = createNativeStackNavigator<RootParamList>();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setUserToken(token);
      } catch (error) {
        console.error("Failed to get token", error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName={"Splash"}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="NoteScreen"
          component={NoteScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddNote"
          component={AddNote}
          options={{ title: "Add Note" }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Profile" }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{ title: "Sign Up" }}
        />
        <Stack.Screen
          name="SignInScreen"
          component={SignInScreen}
          options={{ title: "Sign In" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}