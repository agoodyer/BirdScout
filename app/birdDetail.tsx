import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useState } from "react";

export default function BirdDetail() {
  const params = useLocalSearchParams();
  const textColor = "white";
  const secondaryColor = "#bbbbbb";
  const borderColor = "#333333";
  const color = useThemeColor({}, "text");

  const [location, setLocation] = useState<string>("");

  useEffect(() => {
    const fetchLocation = async () => {
      const loc = await getLocation();
      setLocation(loc);
    };
    fetchLocation();
  }, []);

  async function getLocation() {
    let location = "";
    if (params.location) {
      const [latitude, longitude] = (params.location as string).split(", ");
      await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to fetch location data");
          }
        })
        .then((data) => {
          location =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "";
          location = location + (location && ", ") + data.address.country;
        })
        .catch((error) => {
          location = "Location not available";
        });
    }
    return location;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={color} />
          <ThemedText style={styles.backText}>Back</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={{ backgroundColor: "white" }}
      >
        <ThemedView style={[styles.container]}>
          <Image source={{ uri: params.image as string }} style={styles.image} />

          <View style={styles.detailsContainer}>
            <View style={styles.titleRow}>
              <ThemedText type="title" style={[styles.commonName]}>
                {params.commonName}
              </ThemedText>
            </View>

            <ThemedText type="subtitle" style={[styles.speciesName]}>
              {params.speciesName}
            </ThemedText>

            {params.shortDesc && (
              <ThemedText style={[styles.shortDesc]}>
                {params.shortDesc}
              </ThemedText>
            )}

            <View style={styles.infoContainer}>
              <View style={styles.detailRow}>
                <MaterialIcons name="calendar-month" size={20} color={color} />
                <ThemedText style={[styles.detailText]}>{params.date}</ThemedText>
              </View>

              <View style={styles.detailRow}>
                <MaterialIcons name="person" size={20} color={color} />
                <ThemedText style={[styles.detailText]}>
                  Spotted by {params.foundBy}
                </ThemedText>
              </View>

              {params.location && (
                <View style={styles.detailRow}>
                  <MaterialIcons name="location-on" size={20} color={color} />
                  <ThemedText style={[styles.detailText]}>{location}</ThemedText>
                </View>
              )}
            </View>

            {params.longDesc && (
              <View
                style={[styles.sectionContainer, { borderTopColor: borderColor }]}
              >
                <ThemedText style={[styles.sectionTitle]}>Description</ThemedText>
                <ThemedText style={[styles.longDescText]}>
                  {params.longDesc}
                </ThemedText>
              </View>
            )}

            {params.notes && (
              <View
                style={[styles.sectionContainer, { borderTopColor: borderColor }]}
              >
                <ThemedText style={[styles.sectionTitle]}>
                  Observation Notes
                </ThemedText>
                <ThemedText style={[styles.notesText]}>{params.notes}</ThemedText>
              </View>
            )}
          </View>
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    backgroundColor: "rgba(211, 211, 211, 0.2)",
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailsContainer: {
    paddingHorizontal: 5,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
    flexWrap: "wrap",
  },
  commonName: {
    fontSize: 28,
    flexShrink: 1,
    marginRight: 10,
  },
  speciesName: {
    fontStyle: "italic",
    fontSize: 18,
    marginBottom: 15,
  },
  shortDesc: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "rgba(211, 211, 211, 0.2)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
    gap: 10,
  },
  detailText: {
    fontSize: 16,
    flex: 1,
  },
  sectionContainer: {
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 12,
  },
  longDescText: {
    fontSize: 16,
    lineHeight: 24,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: "italic",
  },
});