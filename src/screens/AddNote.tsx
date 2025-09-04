import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootParamList, Note } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AddNoteNavigationProp = NativeStackNavigationProp<RootParamList, "AddNote">;

const PUBLIC_URL = "http://10.0.2.2:8080/";

export function AddNote() {

    const navigation = useNavigation<AddNoteNavigationProp>();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [userId, setUserId] = useState<string | null>(null);

    // ✅ Load userId only once
    useEffect(() => {
        const fetchUserId = async () => {
            const storedId = await AsyncStorage.getItem("userId");
            
            if (storedId) {

                Alert.alert(storedId);
            }
            
            setUserId(storedId);
        };

        fetchUserId();

    }, []);


    const newNote = {
        id: Date.now().toString().slice(0, 10),
        title,

        content,
        userId,
    
    };

    const handleSave = async () => {
        Alert.alert("Generated ID", newNote.id);
        if (!title.trim() || !content.trim()) {
            
            Alert.alert("Error", "Please enter both title and content");
            return;
        }

        if (userId) {
            // ✅ Save notes locally tied to userId
            const notesJSON = await AsyncStorage.getItem(`notes_${userId}`);
            const prevNotes = notesJSON ? JSON.parse(notesJSON) : [];
            const updatedNotes = [newNote, ...prevNotes];
            await AsyncStorage.setItem(`notes_${userId}`, JSON.stringify(updatedNotes));
            
            navigation.navigate("Home", { newNote });
        
        } else {
            Alert.alert("Failed to add the note! User not found.");
        }
    };

    const handleSaveandUploadDB = async () => {

        Alert.alert("Generated ID", newNote.id);

        if (!title.trim() || !content.trim()) {
            
            Alert.alert("Error", "Please enter both title and content");
            return;
        }

        if (userId) {
            // ✅ Save notes locally tied to userId
            const notesJSON = await AsyncStorage.getItem(`notes_${userId}`);
            const prevNotes = notesJSON ? JSON.parse(notesJSON) : [];
            const updatedNotes = [newNote, ...prevNotes];
            await AsyncStorage.setItem(`notes_${userId}`, JSON.stringify(updatedNotes));
            
            navigation.navigate("Home", { newNote });
        
        } else {
            Alert.alert("Failed to add the note! User not found.");
        }
        
        try {
            const response = await fetch(PUBLIC_URL + "NotesApp/AddNote", {
                method: 'POST',
                
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNote),
            
            });
            if (response.ok) {
                const json = await response.json();
                
                if (json.status) {
                    Alert.alert(json.message);
                } else {
                    Alert.alert(json.message || "Failed to upload !");
                
                }
            } else {
                throw new Error('Failed to upload note');
            
            }
            navigation.navigate("Home", { newNote });
        } catch (error) {
            Alert.alert("Error");
        
        }
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

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveandUploadDB}>
                <Text style={styles.saveButtonText}>Save and Upload</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    label: { fontSize: 18, marginBottom: 8, fontWeight: "600" },
    input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16, backgroundColor: "#f9f9f9" },
    saveButton: { backgroundColor: "#007BFF", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
    
    saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18, marginTop: 10 },
});