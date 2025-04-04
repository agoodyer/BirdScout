import { StyleSheet, Image } from "react-native";

import * as Location from 'expo-location';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";


import { auth, db } from "../../store/firebaseConfig";

import { createClient } from "@supabase/supabase-js";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";


const useLocation = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
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

  const [photo, setPhoto] = useState(null); //???
  const [uri, setUri] = useState<string | undefined>(undefined);

  const ref = useRef<CameraView>(null);

// Initialize Supabase client
const supabaseUrl = "https://silypxhanlxapseqeqtt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbHlweGhhbmx4YXBzZXFlcXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MTE2NjEsImV4cCI6MjA1OTI4NzY2MX0.sh-LowT6UUgquGHtMRMtW1uYNvtHV5qm9UFL1pVqBU4"; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);



// EXPO_PUBLIC_SUPABASE_URL=https://silypxhanlxapseqeqtt.supabase.co
// EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbHlweGhhbmx4YXBzZXFlcXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MTE2NjEsImV4cCI6MjA1OTI4NzY2MX0.sh-LowT6UUgquGHtMRMtW1uYNvtHV5qm9UFL1pVqBU4


//secret 97f16bb965ab9c1107898dfcafb56b2988e3dfe75ae4bc2c3e91954224fec4fb





const pickImage = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images', 'videos'],
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

    console.log(photo);
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


  const uploadPhoto = async() =>{

    if(!uri) return; 

    try{
      const fileUri = uri; 
      const fileName = fileUri.split('/').pop()!;
      // const fileType = mime.getType(fileUri); 

      const response = await fetch(uri); 

      if (!response.ok) {
        console.error('Failed to fetch image:', response.statusText);
        return;
      }


      const base64 = await FileSystem.readAsStringAsync(fileUri,{
        encoding: FileSystem.EncodingType.Base64,
      });


      const arrayBuffer = base64ToArrayBuffer(base64);

      const filePath = `${fileName}`;
      
      const {data, error} = await supabase.storage.from("birds").upload(filePath,arrayBuffer, {
        upsert: true,
        contentType: 'image/jpeg',
      }); 

      if(error){
        console.log(error); 
      }
      console.log("File uploaded successfully:", data);

      const imagePath = data.path; 

      const latitude = location.latitude
      const longitude = location.longitude

      const username = auth.currentUser?.displayName || 'anonymous';

      
    
      const {data: artifactData, error:insertError} = await supabase.from('artifacts').insert({
        latitude, 
        longitude, 
        image_path:imagePath, 
        username
      }).select(); 

      if (insertError) {
        console.error('Failed to insert artifact data:', insertError);
        return;
      }
    
    console.log('Artifact data inserted successfully!');
    const artifactId = artifactData?.[0]?.id;

    console.log(artifactId);


    //Temporary code to insert dummy value into sightings DB
    const { error: sightingError } = await supabase
    .from('sightings')
    .insert({
        artifact_id: artifactId, 
        common_name: 'Bird Name', 
        species_name: 'Bird Species', 
        description: 'Reasoning for chosen classification.'
    }); 


    if(sightingError){
      console.error("Failed to insert into sightings: ", sightingError)
    }else{
      console.log('Sighting inserted successfully. ');
    }



    }catch (error) {
      console.error("Error uploading file:", error);
    }



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
              <TouchableOpacity onPress={pickImage}>
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

            <TouchableOpacity
              onPress={uploadPhoto}
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                zIndex: 10,
                padding: 5,
                backgroundColor: "white",
                borderRadius: 100,
              }}
            >
              <MaterialIcons name="cloud-upload" size={40} color="green" />
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
