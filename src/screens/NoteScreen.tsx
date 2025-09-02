import React, { useState } from "react";
import { View, TextInput, StyleSheet, Button } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootParamList, Note } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NoteScreenNavigationProp = NativeStackNavigationProp<RootParamList, "NoteScreen">;

export function NoteScreen() {
  const navigation = useNavigation<NoteScreenNavigationProp>();
  const route = useRoute<any>();
  const { note } = route.params as { note: Note };

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleSave = () => {
    note.title = title;
    note.content = content;
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Note Title" />
      <TextInput style={[styles.textArea]} value={content} onChangeText={setContent} placeholder="Note Content" multiline />
      <View style={styles.buttonContainer}>
        <Button title="Back" onPress={() => navigation.goBack()} />
        <Button title="Save" onPress={handleSave} />
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