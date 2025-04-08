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
import { createClient } from "@supabase/supabase-js";
import { fetchSightings } from "@/api/fetchSightings";
import { Sighting } from "../types/sighting";

const supabaseUrl = "https://silypxhanlxapseqeqtt.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbHlweGhhbmx4YXBzZXFlcXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MTE2NjEsImV4cCI6MjA1OTI4NzY2MX0.sh-LowT6UUgquGHtMRMtW1uYNvtHV5qm9UFL1pVqBU4";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Achievements() {
  const [count, setCount] = useState(0);

  const user = auth.currentUser;

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Fetch the sightings for the specific user by their name
      const { data, error, count } = await supabase
        .from("artifacts") // Replace with your table name
        .select("*", { count: "exact" }) // The 'count: exact' option gives you the total count of rows
        .eq("username", user.displayName); // Adjust 'user_name' to the column name you use for user's name

      if (error) {
        console.log("Error fetching sightings:", error.message);
        return;
      }

      console.log("Fetched sightings:", data, count);

      setCount(count);
    } catch (err) {
      console.log("Failed to refresh sightings", err);
    } finally {
      setRefreshing(false);
    }
  };

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
