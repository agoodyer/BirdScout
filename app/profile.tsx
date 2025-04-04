import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity, StyleSheet, View, Image } from "react-native";
import { Platform } from "react-native";
import { auth, db } from "../store/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const [phone, setPhone] = useState("No phone number found");

  const router = useRouter();
  const isAndroid = Platform.OS === "android";
  const [isPremium, setIsPremium] = useState(false);

  const user = auth.currentUser;

  const fetchPhone = async () => {
    const userRef = doc(db, "users", user!.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      setPhone(userData.phone);
    }
  };

  useEffect(() => {
    fetchPhone();
  }, [user]);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      const premiumStatus = await AsyncStorage.getItem("isPremium");
      setIsPremium(premiumStatus === "true");
    };
  
    checkPremiumStatus();
  }, []);
  
  return (
    <>
      {/* Header */}
      <ThemedView
        style={{ ...styles.titleContainer, paddingTop: isAndroid ? 40 : "20%" }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Octicons name="chevron-left" size={28} color="black" />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>
          Profile
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.container}>
        {/* Profile Picture */}
        <View style={styles.avatarContainer}>
          <Image
            source={require("@/assets/images/prof.jpg")}
            style={styles.avatar}
          />
        </View>

        {/* User Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <ThemedText type="subtitle" style={styles.label}>
              Username
            </ThemedText>
            <ThemedText style={styles.value}>{user?.displayName}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText type="subtitle" style={styles.label}>
              Email
            </ThemedText>
            <ThemedText style={styles.value}>{user?.email}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText type="subtitle" style={styles.label}>
              Phone Number
            </ThemedText>
            <ThemedText style={styles.value}>{phone}</ThemedText>
          </View>
          <View style={styles.infoRowLast}>
          <ThemedText type="subtitle" style={styles.label}>
              Account Status
            </ThemedText>
            <ThemedText style={styles.value}>
              {isPremium ? "Premium" : "Free"}
            </ThemedText>
          </View>
        </View>
        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/editprofile")}
        >
          <ThemedText style={styles.editButtonText}>Edit Profile</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#F8F9FA",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    paddingLeft: 20,
    paddingBottom: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },
  avatarContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  infoRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  editButton: {
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
  editButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
