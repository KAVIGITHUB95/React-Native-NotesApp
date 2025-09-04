import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootParamList, Note } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons"; // ✅ Expo vector icons

type HomeNavigationProps = NativeStackNavigationProp<RootParamList, "Home">;
type HomeRouteProps = RouteProp<RootParamList, "Home">;

const PUBLIC_URL = "http://10.0.2.2:8080/"; // backend

// Extend Note type with inDB flag
type NoteWithDB = Note & { inDB?: boolean };

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProps>();
  const route = useRoute<HomeRouteProps>();
  const [notes, setNotes] = React.useState<NoteWithDB[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const loadNotes = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;

    const notesJSON = await AsyncStorage.getItem(`notes_${userId}`);
    const localNotes: NoteWithDB[] = notesJSON ? JSON.parse(notesJSON) : [];

    // Fetch server notes
    try {
      const response = await fetch(PUBLIC_URL + "NotesApp/GetNotes?userId=" + userId);
      if (response.ok) {

        const json = await response.json();

        if (json.status) {
          const serverNotes: Note[] = json.noteList;
          // Mark local notes if they exist in DB
          const mergedNotes = localNotes.map(note => ({
            ...note,
            inDB: serverNotes.some(
              sn => sn.title === note.title && sn.content === note.content
            ),
          }));

          setNotes(mergedNotes);
          return;
        }

      } else {
        setNotes(localNotes); // fallback
      }
    } catch (error) {
      console.error("DB fetch error:", error);
      setNotes(localNotes); // fallback
    }
  };

  React.useEffect(() => {
    loadNotes();
    const unsubscribe = navigation.addListener("focus", () => {
      loadNotes();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {notes.length === 0 && <Text style={styles.emptyText}>No notes yet</Text>}
      <FlatList
        data={notes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.noteCard}
            onPress={() => navigation.navigate("NoteScreen", { note: item })}
          >
            <View style={styles.noteRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.content} numberOfLines={2}>
                  {item.content}
                </Text>
              </View>
              {item.inDB && (
                <Ionicons name="cloud-done-outline" size={22} color="green" />
              )}
            </View>
          </TouchableOpacity>
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddNote")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9", padding: 15 },
  noteCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  noteRow: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "bold", color: "#222" },
  content: { fontSize: 14, color: "#666", marginTop: 5 },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#888" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#007BFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },

    shadowRadius: 6,
  },

  fabText: { fontSize: 28, color: "#fff", fontWeight: "bold" },
});