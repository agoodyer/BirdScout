import { StyleSheet, FlatList, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { View, Text } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/store/firebaseConfig";
import { useEffect, useState } from "react";

export default function Achievements() {
  const [count, setCount] = useState(0);

  const user = auth.currentUser;

  const fetchData = async () => {
    const birdsRef = collection(db, "birdSightings");

    const q = query(birdsRef, where("userId", "==", user!.uid.toString()));

    // const querySnapshot = await getDocs(q);

    // querySnapshot.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
    // });

    const snapshot = await getCountFromServer(q);
    setCount(snapshot.data().count);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <FlatList
      contentContainerStyle={{ paddingBottom: 80 }}
      data={[
        {
          title: "Novice Explorer",
          description: "Complete your first identification.",
          icon: "🐣",
          isComplete: count > 0 ? true : false,
        },
        {
          title: "Birdwatcher",
          description: "Identify 5 unique birds.",
          icon: "🔭",
          isComplete: count >= 5 ? true : false,
        },
        {
          title: "Trailblazer ",
          description:
            "Check the community map to see what birds others have spotted.",
          icon: "🗺️",
          isComplete: false,
        },
        {
          title: " Rare Encounter",
          description:
            "Spot a bird that appears on the endangered species list.",
          icon: "⏳",
          isComplete: false,
        },
        {
          title: "Tropical Trailblazer",
          description: "Track and log a bird from a tropical region.",
          icon: "🦜",
        },
        {
          title: "Night Owl",
          description: "Spot a nocturnal bird and log it after sunset.",
        },
        {
          title: "BirdMaster 5000",
          description: "Successfully log 500 unique bird species!",
          icon: "🏆",
        },
        {
          title: "World Explorer",
          description: "Log birds in 5 different countries.",
          icon: "🌍",
        },
        {
          title: "Sky King",
          description: "Identify a bird of prey.",
          icon: "🦅",
        },
      ]}
      renderItem={({ item }) => (
        <AchievementBadge
          title={item.title}
          description={item.description}
          icon={item.icon}
          isComplete={item.isComplete}
        />
      )}
    />
  );
}

const AchievementBadge = ({
  title,
  description,
  icon = "⭐",
  isComplete = false,
}: {
  title: string;
  description: string;
  icon?: string;
  isComplete?: boolean;
}) => {
  return (
    <ThemedView
      style={{
        borderBottomWidth: 2,
        borderColor: "#D3D3D3",
        padding: 10,
        opacity: isComplete ? 1 : 0.35,
      }}
    >
      <TouchableOpacity disabled={!isComplete}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 40 }}>{icon}</Text>
          <ThemedText
            style={{
              fontWeight: "bold",
              fontSize: 20,
              paddingLeft: 10,
              flex: 1,
            }}
          >
            {title}
          </ThemedText>
          {isComplete && (
            <Octicons
              name="chevron-right"
              size={24}
              color="black"
              style={{ paddingRight: 10 }}
            />
          )}
        </View>

        <ThemedText style={{ paddingInline: 60 }}>{description}</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};
