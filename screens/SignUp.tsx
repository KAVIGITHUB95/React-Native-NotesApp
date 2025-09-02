import React, { useEffect, useState } from "react";
import { StyleSheet, Button, ScrollView, View, Text, Pressable, Alert, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from "@react-native-picker/picker";
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

const PUBLIC_URL = "https://105d73a5142c.ngrok-free.app/";

export default function SignUpScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [getCities, setCities] = useState<{ id: number; name: string }[]>
    (

      []
    );


  const [getFullName, setFullName] = useState("");

  const [getUserName, setUserName] = React.useState('');
  const [getEmail, setEmail] = React.useState('');
  const [getPassword, setPassword] = React.useState('');
  const [getConfirmPassword, setConfirmPassword] = React.useState('');
  useEffect(() => {

    const loadCities = async () => {
      const response = await fetch(PUBLIC_URL + "Notebook/Cities");
      if (response.ok) {

        const json = await response.json();
        setCities(json);
        console.log(json);
      } else {
        console.error("City data loading failed!");
      }

    }

    loadCities();
  }, []);

  // const cities = ['Colombo', 'Anuradhapuea', 'Gampaha', 'Matara', 'Kandy'];

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    // Alert.alert(result);

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <AlertNotificationRoot>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollcontent}>

        <View style={styles.header}>
          <Text style={styles.pageTitle}>Create Account</Text>
          <Text style={styles.subTitle}>Fill in the information below to create your account.</Text>

        </View>
        <View style={styles.form}>

          <View style={styles.imageContainer}>

            <Pressable onPress={pickImage} style={styles.imageUploader}>
              {image ? (
                <Image source={{ uri: image }} style={styles.profileImage} />
              ) : (

                <View style={styles.imagePlaceholder}>

                  <Text style={styles.imageText}>+</Text>
                  <Text style={styles.imageLabel}>Add Image</Text>
                </View>

              )}
            </Pressable>

          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput placeholder="Insert your full name" style={styles.input} onChangeText={setFullName} value={getFullName} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput placeholder="Insert your username" style={styles.input} onChangeText={setUserName} value={getUserName} />

          </View>


          <View style={styles.inputContainer}>

            <Text style={styles.label}>Email</Text>
            <TextInput placeholder="Insert your email" style={styles.input} keyboardType="email-address" onChangeText={setEmail} value={getEmail} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput placeholder="Insert your password" style={styles.input} secureTextEntry onChangeText={setPassword} value={getPassword} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput placeholder="Insert the confirm password" style={styles.input} secureTextEntry onChangeText={setConfirmPassword} value={getConfirmPassword} />

          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>City</Text>

            <View style={styles.pickerContainer}>
              <Picker selectedValue={selectedCity}
                style={styles.picker}

                onValueChange={(itemValue) => setSelectedCity(itemValue)}>
                <Picker.Item label="Select your city" value={''} />
                {getCities.map((city) => (
                  <Picker.Item key={city.id} label={city.name} value={city.name} />

                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.buttonContainer}>

            <Pressable style={styles.backButton}>

              <Text style={styles.backButtonText}>Go Back</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={async () => {
              if (!getFullName || !getUserName || !getEmail || !getPassword || !getConfirmPassword || image == null || !selectedCity) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Warning',
                  textBody: 'Please fill required data',
                });

                return;
              }
              let formData = new FormData();

              formData.append("fullName", getFullName);
              formData.append("username", getUserName);
              formData.append("email", getEmail);
              formData.append("password", getPassword);
              formData.append("confirmPassword", getConfirmPassword);
              formData.append("city", selectedCity);

              if (image) {

                formData.append("profileImage", {
                  uri: image,
                  name: "profile.jpg",
                } as any);
              }
              const response = await fetch(PUBLIC_URL + "NoteBook/NewAccount",
                {
                  method: "POST",
                  body: formData,
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              if (response.ok) {
                Toast.show({
                  type: ALERT_TYPE.SUCCESS,
                  title: 'Success',
                  textBody: 'Congrats! New Account created successfully!',
                });
                setFullName("");
                setUserName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setSelectedCity("0");
                setImage(null);
              } else {
                Toast.show({
                  type: ALERT_TYPE.DANGER,
                  title: 'Warning',
                  textBody: 'Something wennt wrong! Account creation failed!',
                });
              }
            }}>
              <Text style={styles.saveButtonText}>Create Account</Text>

            </Pressable>

          </View>
        </View>
      </ScrollView >
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  backButton: {
    flex: 0.46,
    backgroundColor: "#4A90E2",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#888888",

  },
  backButtonText: {
    color: "#0b0b0ff",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    flex: 0.46,
    backgroundColor: "#4A90E2",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#888888",

  },
  saveButtonText: {
    color: "#0b0b0ff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },

  picker: {
    height: 50,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,

  },

  label: {
    fontSize: 16,
    fontWeight: 600,
    color: "#000000ff",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#3f3e3eff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,

    backgroundColor: "#ffffff",
  },
  form: {
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  imageUploader: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#dddddd",
    borderStyle: "dashed",
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    alignItems: "center",
  },

  imageText: {
    fontSize: 35,
    color: "#888888",
    marginBottom: 5,
  },
  imageLabel: {
    fontSize: 14,
    color: "#666666",

  },
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  scrollcontent: {

    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  pageTitle: {

    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",

    marginBottom: 10,
  },
  subTitle: {

    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  }
});