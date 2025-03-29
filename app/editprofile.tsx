import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import {
  TouchableOpacity,
  StyleSheet,
  TextInput,
  View,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../store/firebaseConfig";

export default function EditProfile() {
  const router = useRouter();
  const [username, setUsername] = useState("user");
  const [email, setEmail] = useState("user@example.com");
  const [phone, setPhone] = useState("+1 234 567 890");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("@/assets/images/prof.jpg");

  const user = auth.currentUser;

  const fetchData = async () => {
    setEmail(user!.email);
    setUsername(user!.displayName);

    const userRef = doc(db, "users", user!.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      setPhone(userData.phone);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const updateUserInfo = async () => {
    const user = auth.currentUser; // Get the current authenticated user

    try {
      if (user) {
        // Step 1: Update Firebase Authentication (displayName, email, password)
        if (username) {
          await updateProfile(user, { displayName: username });
          console.log("Display name updated in Firebase Authentication!");
        }

        // if (email) {
        //   await updateEmail(user, email);
        //   console.log("Email updated in Firebase Authentication!");
        // }

        if (password) {
          await updatePassword(user, password);
          console.log("Password updated in Firebase Authentication!");
        }

        // Step 2: Update Firestore data (username, full name, phone number)
        const userRef = doc(db, "users", user.uid); // Reference to the user's Firestore document
        const updates = {
          username: username,
          email: email,
          phone: phone,
        };

        await updateDoc(userRef, updates);
        console.log("User data updated in Firestore!");
      }
    } catch (error) {
      console.log("Error updating user information:", error.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Edit Profile
      </ThemedText>

      {/* Profile Picture */}
      <View style={styles.avatarContainer}>
        <Image
          source={require("@/assets/images/prof.jpg")}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <ThemedText style={styles.uploadButtonText}>Upload Image</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Username</ThemedText>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Email</ThemedText>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Phone</ThemedText>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Password</ThemedText>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            updateUserInfo();
            router.back();
          }}
        >
          <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, styles.cancelButton]}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.saveButtonText}>Cancel</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  uploadButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  uploadButtonText: {
    color: "#FFF",
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // Adjust as needed
    width: "100%",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#6c757d", // A different color for cancel button
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
