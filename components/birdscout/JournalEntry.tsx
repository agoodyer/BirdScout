import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { ThemedText } from "../ThemedText";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ThemedView } from "../ThemedView";

type JournalEntryProps = {
  id: string;
  image: string | number;
  commonName: string;
  speciesName: string;
  date: string;
  location?: string;
  notes?: string;
  shortDesc?: string;
  longDesc?: string;
  foundBy?: string;
};

export function JournalEntry({
  id,
  image,
  commonName,
  speciesName,
  date,
  location = "",
  notes = "",
  shortDesc = "",
  longDesc = "",
  foundBy = ""
}: JournalEntryProps) {
  const router = useRouter();
  const textColor = 'white';
  const secondaryColor = '#bbbbbb';

  const handlePress = () => {
    router.push({
      pathname: "/birdDetail",
      params: {
        id,
        image: typeof image === "string" ? image : "",
        commonName,
        speciesName,
        date,
        location,
        notes,
        shortDesc,
        longDesc,
        foundBy
      },
    });
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: '#121212' }]}>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.entryContainer}>
          <Image
            source={typeof image === "string" ? { uri: image } : image}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <ThemedText style={[styles.commonName, { color: textColor }]}>{commonName}</ThemedText>
            <ThemedText style={[styles.speciesName, { color: secondaryColor }]}>{speciesName}</ThemedText>
            {shortDesc && (
              <ThemedText 
                style={[styles.shortDesc, { color: secondaryColor }]} 
                numberOfLines={1}
              >
                {shortDesc}
              </ThemedText>
            )}
            <View style={styles.dateContainer}>
              <MaterialIcons name="calendar-month" size={20} color={textColor} />
              <ThemedText style={[styles.dateText, { color: textColor }]}>{date}</ThemedText>
              {foundBy && (
                <>
                  <MaterialIcons name="person" size={20} color={textColor} style={styles.iconSpacer} />
                  <ThemedText style={[styles.foundByText, { color: secondaryColor }]}>{foundBy}</ThemedText>
                </>
              )}
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