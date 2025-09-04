import React, { useState } from "react";
import { View, TextInput, StyleSheet, Button, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootParamList, Note } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NoteScreenNavigationProp = NativeStackNavigationProp<RootParamList, "NoteScreen">;

export function NoteScreen() {
  const navigation = useNavigation<NoteScreenNavigationProp>();
  const route = useRoute<any>();
  const { note } = route.params as { note: Note };

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  // Save changes
  const handleSave = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const notesJSON = await AsyncStorage.getItem(`notes_${userId}`);
        const notes = notesJSON ? JSON.parse(notesJSON) : [];

        // Update the note
        const updatedNotes = notes.map((n: Note) =>
          n.id === note.id ? { ...n, title, content } : n
        );

        await AsyncStorage.setItem(`notes_${userId}`, JSON.stringify(updatedNotes));
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to save note");
    }
  };

  // Delete note
  const handleDelete = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const notesJSON = await AsyncStorage.getItem(`notes_${userId}`);
        const notes = notesJSON ? JSON.parse(notesJSON) : [];

        // Remove note
        const updatedNotes = notes.filter((n: Note) => n.id !== note.id);

        await AsyncStorage.setItem(`notes_${userId}`, JSON.stringify(updatedNotes));
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to delete note");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Note Title"
      />
      <TextInput
        style={[styles.textArea]}
        value={content}
        onChangeText={setContent}
        placeholder="Note Content"
        multiline
      />
      <View style={styles.buttonContainer}>
        <Button title="Back" onPress={() => navigation.goBack()} />
        <Button title="Save" onPress={handleSave} />
        <Button title="Delete" color="red" onPress={handleDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  input: { fontSize: 18, borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 15, padding: 10 },
  textArea: { fontSize: 16, borderWidth: 1, borderColor: "#ccc", marginBottom: 15, padding: 10, height: 150 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
});