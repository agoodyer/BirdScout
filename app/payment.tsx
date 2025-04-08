import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  TouchableOpacity,
  StyleSheet,
  Alert,
  View,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Payment() {
  const router = useRouter();
  const color = useThemeColor({}, "text");

  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePurchase = async () => {
    if (!cardholder || !cardNumber || !expiry || !cvv) {
      Alert.alert("Missing Info", "Please fill out all fields.");
      return;
    }

    await AsyncStorage.setItem("isPremium", "true");
    router.back();
  };

  const handleCancelPremium = async () => {
    await AsyncStorage.setItem("isPremium", "false");
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={color} />
          <ThemedText style={styles.backText}>Back</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <ThemedText type="subtitle">Payment Info</ThemedText>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Cardholder Name"
          placeholderTextColor="#555"
          style={styles.input}
          value={cardholder}
          onChangeText={setCardholder}
        />
        <TextInput
          placeholder="Card Number"
          placeholderTextColor="#555"
          style={styles.input}
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={setCardNumber}
        />
        <View style={styles.row}>
          <TextInput
            placeholder="MM/YY"
            placeholderTextColor="#555"
            style={[styles.input, { flex: 1, marginRight: 10 }]}
            value={expiry}
            onChangeText={setExpiry}
          />
          <TextInput
            placeholder="CVV"
            placeholderTextColor="#555"
            style={[styles.input, { flex: 1 }]}
            keyboardType="numeric"
            secureTextEntry
            value={cvv}
            onChangeText={setCvv}
          />
        </View>

        <Button title="Submit Payment" onPress={handlePurchase} />

        <View style={{ marginTop: 20 }}>
          <Button
            title="Cancel Premium"
            color="#d9534f"
            onPress={handleCancelPremium}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingTop: 50,
    backgroundColor: "rgba(211, 211, 211, 0.2)",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
  },
  titleContainer: {
    paddingTop: "5%",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingBottom: 15,
  },
  formContainer: {
    paddingHorizontal: 30,
    gap: 15,
    marginTop: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
