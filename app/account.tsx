import {
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

import { useRouter } from "expo-router";
import { useNavigation } from "expo-router";

import { Text } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { SettingsButton } from "@/components/birdscout/SettingsButton";
export default function Account() {
  const router = useRouter();

  return (
    <>
      <ThemedView style={styles.titleContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Octicons name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <ThemedText type="subtitle">Account Settings</ThemedText>
      </ThemedView>

      <ScrollView style={{ backgroundColor: "white" }}>
        <ThemedView style={styles.profileContainer}>
          {/* <Ionicons name="person-circle-sharp" size={120} color="#D3D3D3" /> */}
          <Image
            source={require("@/assets/images/prof.jpg")}
            style={{ width: 120, height: 120, borderRadius: 100 }}
            resizeMode="contain"
          />
          <ThemedText type="subtitle">Ridha Khedri</ThemedText>
          <ThemedText type="default">@sfwreng3a04</ThemedText>
        </ThemedView>

        <SettingsButton text={"Payment Information"} route={"/payment"} />

        <SettingsButton text={"Profile Status"} route={"/profile"} />

        <SettingsButton
          text={"Notification Settings"}
          route={"/notifications"}
        />

        <SettingsButton text={"Language & Region"} route={"/language"} />

        <SettingsButton text={"Privacy & Security"} route={"/privacy"} />

        <SettingsButton text={"Storage"} route={"/storage"} />

        <ThemedView
          style={{
            marginBottom: 40,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
            width: "100%",
          }}
        >
          <ThemedView style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("@/assets/images/icon_silhouette.png")}
              style={{ height: 60, width: 60, opacity: 0.15 }}
              resizeMode="contain"
            />

            <ThemedText style={{ paddingLeft: 5, opacity: 0.15 }} type="title">
              BirdScout
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    paddingTop: "20%",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  profileContainer: {
    flexDirection: "column",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
    paddingTop: 20,
  },

  optionContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",

    padding: 20,
    paddingInline: 40,

    borderTopWidth: 2,
    borderColor: "#D3D3D3",
    //    borderLeftWidth:0,
    //    borderRightWidth:0
  },
});
