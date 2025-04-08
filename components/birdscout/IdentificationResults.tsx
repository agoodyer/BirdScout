import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const IdentificationResultScreen = ({ bird, setIdentificationData }) => {
  const isUnknown = !bird || bird.commonName === "No bird found";

  return (
    <View style={styles.container}>
      {/* Close (X) button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setIdentificationData(null)}
      >
        <Ionicons name="close" size={28} color="#333" />
      </TouchableOpacity>

      {/* Bird Image */}
      {bird?.artifact?.imageUrl && (
        <Image
          source={{ uri: bird.artifact.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* If no bird was confidently identified */}
      {isUnknown ? (
        <>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              paddingVertical: 40,
            }}
          >
            <View>
              <Text style={styles.commonName}>No Bird Found</Text>
              <Text style={styles.description}>
                We couldn't confidently identify the bird. Try again with a
                clearer photo or different characteristics.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.centeredButton}
              onPress={() => setIdentificationData(null)}
            >
              <Text style={styles.buttonText}>Back to Identification</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {/* Bird Info */}
          <Text style={styles.commonName}>{bird.commonName}</Text>
          <Text style={styles.speciesName}>{bird.speciesName}</Text>
          <Text style={styles.description}>{bird.description}</Text>

          {/* Bottom Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setIdentificationData(null)}
            >
              <Text style={styles.buttonText}>Back to Identification</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                router.push({
                  pathname: "/birdDetail",
                  params: {
                    id: bird.id,
                    image:
                      typeof bird.artifact.imageUrl === "string"
                        ? bird.artifact.imageUrl
                        : "",
                    commonName: bird.commonName,
                    speciesName: bird.speciesName,
                    date: bird.artifact.date,
                    location:
                      bird.artifact.location.latitude.toString() +
                      ", " +
                      bird.artifact.location.longitude.toString(),
                    notes:
                      "We need to add notes to the database if we want info here.",
                    shortDesc: "",
                    longDesc: bird.description,
                    foundBy: bird.artifact.username,
                  },
                })
              }
            >
              <Text style={styles.buttonText}>View in Journal</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default IdentificationResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 20,
    zIndex: 10,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
  },
  commonName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  speciesName: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#555",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#444",
    marginBottom: 30,
  },
  buttonContainer: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  primaryButton: {
    flex: 0.48,
    backgroundColor: "#00BDFF",
    borderColor: "#00BDFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  secondaryButton: {
    flex: 0.48,
    backgroundColor: "#bbb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  centeredButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
