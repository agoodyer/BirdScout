import { StyleSheet, Image, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";

export default function IdentifyScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  const [uri, setUri] = useState<string | undefined>(undefined);
  const [showTextInput, setShowTextInput] = useState(false);
  const [inputText, setInputText] = useState("");

  const ref = useRef<CameraView>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setUri(result.assets[0].uri);
      console.log("Image picked:", result.assets[0].uri);
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
        <View style={styles.textInputContainer}>
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
        </View>
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
    paddingBottom: 80,
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
    justifyContent: "space-between",
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
