import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { ThemedText } from "../ThemedText";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import { ThemedView } from "../ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Sighting } from "@/app/types/sighting";

export function JournalEntry({
  sighting
}: {
  sighting: Sighting
}) {

  const handlePress = () => {
    router.push({
      pathname: "/birdDetail",
      params: {
        id:sighting.id,
        image: typeof sighting.artifact.imageUrl === "string" ? sighting.artifact.imageUrl : "",
        commonName:sighting.commonName,
        speciesName:sighting.speciesName,
        date:sighting.artifact.date,
        location: sighting.artifact.location.latitude.toString() + ", " +  sighting.artifact.location.latitude.toString() ,
        notes:"We need to add notes to the database if we want info here.",
        shortDesc:"We need to add description to the database if we want info here.",
        longDesc:"We need to add description to the database if we want info here.",
        foundBy:sighting.artifact.username
      },
    });
  };


  const color = useThemeColor({}, "text");
  return (
    <ThemedView style={[styles.container]}>
      <TouchableOpacity onPress={handlePress} >
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
            color={color}
            style={styles.chevron}
          />
        </View>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderColor: "#D3D3D3",
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