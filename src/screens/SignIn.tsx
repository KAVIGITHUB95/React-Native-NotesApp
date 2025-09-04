import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    Platform,
} from "react-native";
import { ALERT_TYPE, AlertNotificationRoot, Toast } from "react-native-alert-notification";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootParamList } from "../../App";

type SignInNavigationProp = NativeStackNavigationProp<RootParamList, "SignInScreen">;

const PUBLIC_URL = "http://10.0.2.2:8080/";

export function SignInScreen() {
    const navigation = useNavigation<SignInNavigationProp>();
    const [getEmail, setEmail] = useState("");
    const [getPassword, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        if (!getEmail.trim() || !getPassword.trim()) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: "Warning",
                textBody: "Please enter both email and password",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(PUBLIC_URL + "NotesApp/SignIn", {
                method: "POST",
                body: JSON.stringify({ email: getEmail, password: getPassword }),
                headers: { "Content-Type": "application/json" },
            });

            const json = await response.json();

            if (response.ok && json.status) {
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Success",
                    textBody: "SignIn successful",
                });

                // ✅ Save userId as a string
                await AsyncStorage.setItem("userId", JSON.stringify(json.userId));

                // ✅ Save token as usual
                if (json.token) await AsyncStorage.setItem("userToken", json.token);

                // Reset navigation stack and go to Home
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Home" }],
                });
            } else {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Error",
                    textBody: json.message || "Invalid login",
                });
            }
        } catch (error) {
            console.error(error);
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "Error",
                textBody: "Something went wrong!",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
            <AlertNotificationRoot>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.profileContainer}>
                        <Text style={styles.title}>Welcome to NotesApp!</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter Email"
                            keyboardType="email-address"
                            value={getEmail}
                            onChangeText={setEmail}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Enter Password"
                            secureTextEntry
                            value={getPassword}
                            onChangeText={setPassword}
                        />

                        <Pressable style={styles.signInBtn} onPress={handleSignIn} disabled={loading}>
                            <Text style={styles.buttonText}>{loading ? "Signing In..." : "Sign In"}</Text>
                        </Pressable>

                        <Pressable style={styles.createBtn} onPress={() => navigation.navigate("SignUpScreen")}>
                            <Text style={styles.createBtnText}>Create Account</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </AlertNotificationRoot>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scroll: { flex: 1 },
    container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 10 },
    profileContainer: { width: "100%", maxWidth: 420, alignItems: "center", padding: 20 },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, color: "#333" },
    input: {
        width: "100%",
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    signInBtn: {
        width: "100%",
        height: 50,
        backgroundColor: "#007bff",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    createBtn: {
        width: "100%",
        height: 50,
        backgroundColor: "#09a122ff",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    createBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});