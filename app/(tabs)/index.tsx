import { StyleSheet, Image } from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

export default function IdentifyScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  const [photo, setPhoto] = useState(null); //???
  const [uri, setUri] = useState<string | undefined>(undefined);

  const ref = useRef<CameraView>(null);

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setUri(photo?.uri);

    console.log(photo);
  };

  const discardPicture = () => {
    setUri(undefined);
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      {!uri ? (
        <CameraView style={styles.camera} facing={facing} ref={ref}>
          <View style={styles.overlay}>
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 60,
              }}
            >
              <TouchableOpacity>
                <MaterialIcons name="photo-library" size={40} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  borderWidth: 4,
                  borderColor: "white",
                  width: 80,
                  height: 80,
                  borderRadius: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={takePicture}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    width: "90%",
                    height: "90%",
                    borderRadius: 100,
                  }}
                ></View>
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleCameraFacing}>
                <FontAwesome6 name="rotate" size={40} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      ) : (
        <>
          <View style={{ width: "100%", height: "100%" }}>
            <TouchableOpacity
              onPress={discardPicture}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                zIndex: 10,
                padding: 5,
                backgroundColor: "white",
                borderRadius: 100,
              }}
            >
              <MaterialIcons name="delete-forever" size={40} color="red" />
            </TouchableOpacity>
            <Image
              source={{ uri: uri }}
              style={{ flex: 1, resizeMode: "contain" }}
            />
          </View>
        </>
      )}
    </View>
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
    flexDirection: "row",
    gap: 8,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    position: "absolute",
    top: -100,
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
  },

  overlay: {
    width: "100%",
    height: "100%",
    position: "relative",

    display: "flex",
    opacity: 0.4,
    alignItems: "center",

    justifyContent: "flex-end",
    padding: "30%",
  },
});
