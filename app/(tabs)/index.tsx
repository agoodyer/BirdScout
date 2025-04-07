import {
  StyleSheet,
  Image,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import * as Location from "expo-location";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import IdentifyIcon from '../../assets/ui/identifyIcon';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

import { auth, db } from "../../store/firebaseConfig";

import { createClient } from "@supabase/supabase-js";
import * as FileSystem from "expo-file-system";

const useLocation = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      // Get current location
      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: coords.latitude, longitude: coords.longitude });
    })();
  }, []);

  return location;
};

export default function IdentifyScreen() {
  const location = useLocation();

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  const [uri, setUri] = useState<string | undefined>(undefined);
  const [showTextInput, setShowTextInput] = useState(false);
  const [inputText, setInputText] = useState("");

  const ref = useRef<CameraView>(null);

  // Initialize Supabase client
  const supabaseUrl = "https://silypxhanlxapseqeqtt.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbHlweGhhbmx4YXBzZXFlcXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MTE2NjEsImV4cCI6MjA1OTI4NzY2MX0.sh-LowT6UUgquGHtMRMtW1uYNvtHV5qm9UFL1pVqBU4"; // Replace with your Supabase anon key
  const supabase = createClient(supabaseUrl, supabaseKey);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });

    console.log(result);

    if (!result.canceled) {
      setUri(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setUri(photo?.uri);
    console.log("Photo taken:", photo);
  };

  const discardPicture = () => {
    setUri(undefined);
  };

  const base64ToArrayBuffer = (base64: string) => {
    const binaryString = atob(base64);
    const length = binaryString.length;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new Uint8Array(arrayBuffer);

    for (let i = 0; i < length; i++) {
      view[i] = binaryString.charCodeAt(i);
    }

    return arrayBuffer;
  };

  const uploadPhoto = async () => {
    if (!uri) return;

    try {
      const fileUri = uri;
      const fileName = fileUri.split("/").pop()!;
      // const fileType = mime.getType(fileUri);

      const response = await fetch(uri);

      if (!response.ok) {
        console.error("Failed to fetch image:", response.statusText);
        return;
      }

      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const arrayBuffer = base64ToArrayBuffer(base64);

      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from("birds")
        .upload(filePath, arrayBuffer, {
          upsert: true,
          contentType: "image/jpeg",
        });

      if (error) {
        console.log(error);
      }
      console.log("File uploaded successfully:", data);

      const imagePath = data.path;

      const latitude = location.latitude;
      const longitude = location.longitude;

      const username = auth.currentUser?.displayName || "anonymous";

      const { data: artifactData, error: insertError } = await supabase
        .from("artifacts")
        .insert({
          latitude,
          longitude,
          image_path: imagePath,
          username,
          text_description: { text: inputText },
        })
        .select();

      if (insertError) {
        console.error("Failed to insert artifact data:", insertError);
        return;
      }

      console.log("Artifact data inserted successfully!");
      const artifactId = artifactData?.[0]?.id;

      console.log(artifactId);

      const { data: identifyData, error: identifyError } =
        await supabase.functions.invoke("test-identify", {
          body: { artifact_id: artifactId },
        });

      console.log(identifyData, identifyError);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleView = () => {
    setShowTextInput((prev) => !prev);
  };

  const handleDummySubmit = () => {
    console.log("Submitted text:", inputText);
    console.log("Current photo URI:", uri);
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* View toggle button */}
      <TouchableOpacity
        style={{
          ...styles.viewToggle,
          backgroundColor: uri ? "white" : "black",
        }}
        onPress={toggleView}
      >
        <MaterialIcons
          name={showTextInput ? "photo-camera" : "edit"}
          size={28}
          color={uri ? "black" : "white"}
        />
      </TouchableOpacity>

      {showTextInput ? (
        <KeyboardAwareScrollView
          contentContainerStyle={styles.textInputContainer}
        >
          <View style={styles.textCard}>
            <Text style={styles.prompt}>
              Please describe any characteristics of the bird you wish to
              identify.
              {"\n\n"}You can include details such as:
              {"\n"}• Color and size
              {"\n"}• Beak shape or markings
              {"\n"}• Whether it’s aquatic, nocturnal, or tree-dwelling
              {"\n"}• Sounds or behaviors
              {"\n"}• Where and when you saw it
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. Small brown bird with a yellow chest, curved beak, seen near a lake at dusk..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleDummySubmit}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                🔍 Identify Bird
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      ) : !uri ? (
        <CameraView style={styles.camera} facing={facing} ref={ref}>
          <View style={styles.overlay}>
            <View style={styles.cameraControlsWrapper}>
              <View style={styles.cameraControls}>
                <TouchableOpacity onPress={pickImage}>
                  <MaterialIcons name="photo-library" size={40} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={takePicture}
                >
                  <View style={styles.captureInnerCircle}></View>
                </TouchableOpacity>

                <TouchableOpacity onPress={toggleCameraFacing}>
                  <FontAwesome6 name="rotate" size={40} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </CameraView>
      ) : (
        <View style={{ width: "100%", height: "100%" }}>
          <TouchableOpacity
            onPress={discardPicture}
            style={styles.discardButton}
          >
            <MaterialIcons name="delete-forever" size={40} color="red" />
          </TouchableOpacity>

          <View
            style={{
              position: "absolute",
              bottom: Platform.select({
                ios: 120,
                android: 80,
              }),
              width: "100%",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <TouchableOpacity
              onPress={uploadPhoto}
              style={{
                paddingInline: 30,
                paddingBlock: 10,
                opacity: 0.9,
                backgroundColor: "white",
                borderRadius: 200,
                justifyContent: "center",
                alignItems: "center",
                gap:5
              }}
            >
             <IdentifyIcon width={40} height={28} fill="#006FFD"  />
              <Text
                style={{ color: "#71727A", fontSize: 16, textAlign: "center" }}
              >
                Identify
              </Text>
            </TouchableOpacity>
          </View>

          <Image
            source={{ uri: uri }}
            style={{ flex: 1, resizeMode: "contain" }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    paddingBottom: Platform.select({
      ios: 120,
      android: 80, // or 0 or whatever suits Android
    }),
  },
  cameraControlsWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  cameraControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 60,
  },
  captureButton: {
    borderWidth: 4,
    borderColor: "white",
    width: 80,
    height: 80,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  captureInnerCircle: {
    backgroundColor: "white",
    width: "90%",
    height: "90%",
    borderRadius: 100,
  },
  discardButton: {
    position: "absolute",
    top: 15,
    left: 20,
    zIndex: 10,
    padding: 5,
    backgroundColor: "white",
    borderRadius: 100,
  },
  viewToggle: {
    position: "absolute",
    top: 15,
    right: 20,
    zIndex: 100,
    padding: 12,
    borderRadius: 100,
    elevation: 4,
  },
  textInputContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    backgroundColor: "#f8f8f8",
    // justifyContent: "space-between",
    gap: 40,
  },
  textCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  prompt: {
    fontSize: 16,
    marginBottom: 16,
    color: "#333",
    lineHeight: 22,
    fontWeight: "500",
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fafafa",
    minHeight: 130,
    fontSize: 15,
    marginTop: 10,
  },
  buttonWrapper: {
    marginBottom: 30,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
  },
});
