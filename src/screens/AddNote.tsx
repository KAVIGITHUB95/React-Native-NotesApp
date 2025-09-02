import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootParamList, Note } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AddNoteNavigationProp = NativeStackNavigationProp<RootParamList, "AddNote">;

export function AddNote() {
    const navigation = useNavigation<AddNoteNavigationProp>();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert("Error", "Please enter both title and content");
            return;
        }

        const newNote = {
            id: Date.now().toString(),
            title,
            content,
        };

        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
            const notesJSON = await AsyncStorage.getItem(`notes_${userId}`);
            const prevNotes = notesJSON ? JSON.parse(notesJSON) : [];
            const updatedNotes = [newNote, ...prevNotes];
            await AsyncStorage.setItem(`notes_${userId}`, JSON.stringify(updatedNotes));
            return;
        
        }


        // Go back to Home
        navigation.navigate("Home", { newNote });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Title</Text>
            <TextInput style={styles.input} placeholder="Enter note title" value={title} onChangeText={setTitle} />

            <Text style={styles.label}>Content</Text>
            <TextInput
                style={[styles.input, { height: 120 }]}
                placeholder="Enter note content"
                value={content}
                onChangeText={setContent}
                multiline
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Note</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    label: { fontSize: 18, marginBottom: 8, fontWeight: "600" },
    input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16, backgroundColor: "#f9f9f9" },
    saveButton: { backgroundColor: "#007BFF", padding: 15, borderRadius: 8, alignItems: "center" },
    saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },

});