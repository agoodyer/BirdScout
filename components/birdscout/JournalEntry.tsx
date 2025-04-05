import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { ThemedText } from "../ThemedText";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ThemedView } from "../ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Sighting } from "@/app/types/sighting";

export function JournalEntry({
  sighting
}: {
  sighting: Sighting
}) {
  const color = useThemeColor({}, "text");
  return (
    <ThemedView style={[styles.container, { backgroundColor: '#121212' }]}>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.entryContainer}>
          <Image
            source={typeof sighting.artifact.imageUrl === "string" ? { uri: sighting.artifact.imageUrl } : sighting.artifact.imageUrl}
            style={{ width: 100, height: 100, borderRadius: 10 }}
          />

          <View style={{ paddingInline: 30 }}>
            <ThemedText style={{ fontWeight: "bold", fontSize: 20 }}>
              {sighting.commonName}
            </ThemedText>
            <ThemedText style={{}}>{sighting.speciesName}</ThemedText>

            <View style={{ flexDirection: "row", gap: 4 }}>
              <MaterialIcons name="calendar-month" size={24} color={color} />
              <ThemedText>{sighting.artifact.date}</ThemedText>
            </View>
          </View>
          <Octicons
            name="chevron-right"
            size={24}
            color={textColor}
            style={styles.chevron}
          />
        </View>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#333333",
    padding: 15
  },
  entryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  textContainer: {
    paddingHorizontal: 15,
    flex: 1,
  },
  commonName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  speciesName: {
    fontStyle: "italic",
    fontSize: 14,
    marginBottom: 4,
  },
  shortDesc: {
    fontSize: 13,
    marginBottom: 6,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    marginLeft: 4,
  },
  foundByText: {
    fontSize: 14,
    marginLeft: 4,
  },
  iconSpacer: {
    marginLeft: 10,
  },
  chevron: {
    paddingRight: 5,
  },
});