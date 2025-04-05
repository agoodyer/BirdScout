import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import { ThemedText } from "../ThemedText";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
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
    <ThemedView
      style={{ borderBottomWidth: 2, borderColor: "#D3D3D3", padding: 10 }}
    >
      <TouchableOpacity>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
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
            style={{ paddingRight: 10 }}
          />
        </View>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    padding: 20,
    paddingInline: 40,
  },
});
