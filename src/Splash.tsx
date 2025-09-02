import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootParamList } from "../App";


type SplashNavigationProps = NativeStackNavigationProp<RootParamList,"Splash">;

type SignUpNavigationProps = NativeStackNavigationProp<RootParamList,"SignUpScreen">;
type SignInNavigationProps = NativeStackNavigationProp<RootParamList,"SignInScreen">;
export function SplashScreen(){
    
    const navigation = useNavigation<SplashNavigationProps>();
    const signUpNavigation = useNavigation<SignUpNavigationProps>();
    const signInNavigation = useNavigation<SignInNavigationProps>();
    
    
    
    return(
        
  <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Your personal notes app</Text>

      {/* Buttons */}
      <TouchableOpacity 
        style={[styles.button, styles.signInBtn]} 
        onPress={() => signInNavigation.navigate("SignInScreen")} // 👉 replace with SignIn screen
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.signUpBtn]} 
        onPress={() => signUpNavigation.navigate("SignUpScreen")} // 👉 replace with SignUp screen
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
    );

}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 40,
  },
  button: {
    width: width * 0.7,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
  },
  signInBtn: {
    backgroundColor: "#007BFF",
  },
  signUpBtn: {
    backgroundColor: "#28A745",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});