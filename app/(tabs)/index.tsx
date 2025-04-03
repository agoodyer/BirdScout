import { StyleSheet, Image, ActivityIndicator, Alert, ScrollView, View as RNView, NativeSyntheticEvent, NativeScrollEvent, Share, Animated } from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";

import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import * as Clipboard from 'expo-clipboard';
import { identifyBird, BirdData } from "../../services/openaiService";
import { saveBirdSighting } from "../../services/birdSightingService";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tooltip = ({ message, visible, onClose }) => {
  if (!visible) return null;
  
  return (
    <View style={styles.tooltipContainer}>
      <View style={styles.tooltip}>
        <Text style={styles.tooltipText}>{message}</Text>
        <TouchableOpacity onPress={onClose} style={styles.tooltipClose}>
          <MaterialIcons name="close" size={18} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.tooltipArrow} />
    </View>
  );
};

export default function IdentifyScreen() {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [galleryPermission, setGalleryPermission] = useState<boolean>(false);

  const [photo, setPhoto] = useState(null);
  const [uri, setUri] = useState<string | undefined>(undefined);
  const [birdData, setBirdData] = useState<BirdData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandResults, setExpandResults] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const snackbarOpacity = useRef(new Animated.Value(0)).current;

  const ref = useRef<CameraView>(null);
  const resultsScrollRef = useRef(null);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');

  // Request permissions when component mounts
  useEffect(() => {
    (async () => {
      // Location permission
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(locationStatus.status === 'granted');

      // Media library permission
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  // Show tooltip on first load
  useEffect(() => {
    // Only show the tooltip if it's the first time the user is using the app
    const showInitialTooltip = async () => {
      try {
        const hasSeenTooltip = await AsyncStorage.getItem('hasSeenCameraTooltip');
        if (!hasSeenTooltip) {
          // Set initial tooltip message
          setTooltipMessage('Tap to take a photo, or select one from your gallery. Identified birds will be analyzed with AI.');
          setTooltipVisible(true);
          
          // Mark that user has seen the tooltip
          await AsyncStorage.setItem('hasSeenCameraTooltip', 'true');
          
          // Auto-hide tooltip after 8 seconds
          setTimeout(() => {
            setTooltipVisible(false);
          }, 8000);
        }
      } catch (error) {
        console.error("Error checking tooltip status:", error);
      }
    };
    
    showInitialTooltip();
  }, []);
  
  // Function to show contextual tooltips based on current state
  const showTooltip = (message) => {
    setTooltipMessage(message);
    setTooltipVisible(true);
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
      setTooltipVisible(false);
    }, 4000);
  };
  
  // Helper function to show tooltip for a specific control
  const showControlTooltip = (controlName) => {
    const tooltips = {
      copy: 'Copy bird information to clipboard',
      share: 'Share bird information and photo',
      save: 'Save this sighting to your journal',
      close: 'Discard this photo and return to camera',
      expand: 'Tap the image to toggle between showing more of the image or more details',
    };
    
    showTooltip(tooltips[controlName] || '');
  };

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync({ base64: true });
    setUri(photo?.uri);
    
    if (photo?.uri) {
      processBirdIdentification(photo.uri, photo.base64);
    }
  };

  const pickImage = async () => {
    if (!galleryPermission) {
      Alert.alert(
        "Permission Required",
        "BirdScout needs access to your photo library to select images",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Settings", 
            onPress: async () => {
              const status = await ImagePicker.requestMediaLibraryPermissionsAsync();
              setGalleryPermission(status.status === 'granted');
            } 
          }
        ]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setUri(selectedAsset.uri);
        processBirdIdentification(selectedAsset.uri, selectedAsset.base64);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to load image from gallery");
    }
  };

  const discardPicture = () => {
    setUri(undefined);
    setBirdData(null);
  };

  const processBirdIdentification = async (imageUri: string, base64?: string) => {
    setIsAnalyzing(true);
    setBirdData(null);
    
    try {
      // Call our service to identify the bird
      const result = await identifyBird(imageUri, base64);
      setBirdData(result);
      
      console.log("Bird identification result:", result);
    } catch (error) {
      console.error("Error in bird identification processing:", error);
      // Error handling is done in the service
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveSighting = async () => {
    if (!birdData || !uri) return;
    
    setIsSaving(true);
    try {
      let location = undefined;
      
      // Get current location if permission is granted
      if (locationPermission) {
        const currentLocation = await Location.getCurrentPositionAsync();
        location = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
      }
      
      const sightingId = await saveBirdSighting(birdData, uri, location);
      
      if (sightingId) {
        Alert.alert(
          "Success!",
          "Bird sighting saved to your journal",
          [
            {
              text: "View Journal",
              onPress: () => router.push('/journal'),
            },
            {
              text: "Continue",
              style: "cancel",
            },
          ]
        );
      } else {
        Alert.alert("Error", "Failed to save bird sighting");
      }
    } catch (error) {
      console.error("Error saving sighting:", error);
      Alert.alert("Error", "Failed to save bird sighting");
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = async () => {
    if (!birdData) return;
    
    const birdInfo = `
Bird Species: ${birdData.species}
Scientific Name: ${birdData.scientificName}
Confidence: ${Math.round(birdData.confidence * 100)}%
Description: ${birdData.description}
    `.trim();
    
    await Clipboard.setStringAsync(birdInfo);
    Alert.alert("Copied", "Bird information copied to clipboard");
  };

  const shareBirdInfo = async () => {
    if (!birdData || !uri) return;
    
    try {
      const birdInfo = `
Bird Species: ${birdData.species}
Scientific Name: ${birdData.scientificName}
Confidence: ${Math.round(birdData.confidence * 100)}%
Description: ${birdData.description}
      `.trim();
      
      await Share.share({
        message: birdInfo,
        url: uri, // This works on iOS to share the image along with the text
        title: `${birdData.species} identified with BirdScout`
      });
    } catch (error) {
      console.error('Error sharing bird info:', error);
      Alert.alert('Error', 'Failed to share bird information');
    }
  };

  const toggleResultsExpansion = () => {
    setExpandResults(!expandResults);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollHeight = contentSize.height - layoutMeasurement.height;
    
    if (scrollHeight <= 0) {
      setScrollProgress(1); // Prevent division by zero
      return;
    }
    
    const progress = contentOffset.y / scrollHeight;
    setScrollProgress(Math.min(Math.max(progress, 0), 1)); // Clamp between 0 and 1
  };

  // Show snackbar when bird is identified successfully
  useEffect(() => {
    if (birdData && birdData.species !== "Unknown Bird" && !isAnalyzing) {
      setShowSnackbar(true);
      Animated.timing(snackbarOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Hide snackbar after 5 seconds
      const timer = setTimeout(() => {
        hideSnackbar();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [birdData, isAnalyzing]);
  
  const hideSnackbar = () => {
    Animated.timing(snackbarOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSnackbar(false);
    });
  };

  const quickSave = async () => {
    await saveSighting();
    hideSnackbar();
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
        <View style={{ flex: 1 }}>
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
          
          <Tooltip 
            message={tooltipMessage}
            visible={tooltipVisible}
            onClose={() => setTooltipVisible(false)}
          />
        </View>
      ) : (
        <>
          <View style={{ width: "100%", height: "100%" }}>
            <View style={styles.controlButtons}>
              <TouchableOpacity
                onPress={discardPicture}
                style={styles.controlButton}
                onLongPress={() => showControlTooltip('close')}
              >
                <MaterialIcons name="close" size={28} color="white" />
              </TouchableOpacity>
              
              {birdData && birdData.species !== "Unknown Bird" && (
                <>
                  <TouchableOpacity
                    onPress={copyToClipboard}
                    style={styles.controlButton}
                    onLongPress={() => showControlTooltip('copy')}
                  >
                    <MaterialIcons name="content-copy" size={24} color="white" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={shareBirdInfo}
                    style={styles.controlButton}
                    onLongPress={() => showControlTooltip('share')}
                  >
                    <MaterialIcons name="share" size={24} color="white" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={saveSighting}
                    style={styles.controlButton}
                    disabled={isSaving}
                    onLongPress={() => showControlTooltip('save')}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Ionicons name="save" size={28} color="white" />
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
            
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={toggleResultsExpansion}
              style={{ flex: 1 }}
              onLongPress={() => showControlTooltip('expand')}
            >
              <Image
                source={{ uri: uri }}
                style={{ flex: 1, resizeMode: "contain" }}
              />
            </TouchableOpacity>
            
            {isAnalyzing ? (
              <View style={styles.analysisOverlay}>
                <ActivityIndicator size="large" color="#00BDFF" />
                <Text style={styles.analysisText}>Identifying bird...</Text>
              </View>
            ) : birdData ? (
              <>
                <ScrollView 
                  ref={resultsScrollRef}
                  style={[
                    styles.resultsContainer, 
                    expandResults && styles.expandedResults
                  ]}
                  contentContainerStyle={styles.resultsContent}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                >
                  <View style={styles.expandIndicator}>
                    <MaterialIcons 
                      name={expandResults ? "keyboard-arrow-down" : "keyboard-arrow-up"} 
                      size={24} 
                      color="#CCC" 
                    />
                    <Text style={styles.expandText}>
                      {expandResults ? "Show more of image" : "Show more details"}
                    </Text>
                  </View>
                  
                  <Text style={styles.birdName}>{birdData.species}</Text>
                  <Text style={styles.scientificName}>{birdData.scientificName}</Text>
                  <Text style={styles.confidenceText}>
                    Confidence: {Math.round(birdData.confidence * 100)}%
                  </Text>
                  <Text style={styles.description}>{birdData.description}</Text>
                  <View style={{ height: 60 }} />
                </ScrollView>
                
                {(scrollProgress > 0 && scrollProgress < 1) && (
                  <RNView style={styles.progressContainer}>
                    <RNView 
                      style={[
                        styles.progressBar, 
                        { width: `${scrollProgress * 100}%` }
                      ]} 
                    />
                  </RNView>
                )}
              </>
            ) : null}
            
            {/* Snackbar notification */}
            {showSnackbar && (
              <Animated.View style={[styles.snackbar, { opacity: snackbarOpacity }]}>
                <Text style={styles.snackbarText}>
                  {birdData?.species} identified!
                </Text>
                <TouchableOpacity onPress={quickSave} style={styles.snackbarButton}>
                  <Text style={styles.snackbarButtonText}>SAVE</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={hideSnackbar} style={styles.snackbarClose}>
                  <MaterialIcons name="close" size={20} color="#CCC" />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
          
          <Tooltip 
            message={tooltipMessage}
            visible={tooltipVisible}
            onClose={() => setTooltipVisible(false)}
          />
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
  analysisOverlay: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
    alignItems: "center",
  },
  analysisText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
  resultsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "40%",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  expandedResults: {
    maxHeight: "80%",
  },
  resultsContent: {
    padding: 20,
    paddingBottom: 80,
  },
  birdName: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  scientificName: {
    color: "#CCC",
    fontSize: 18,
    fontStyle: "italic",
    marginBottom: 10,
  },
  confidenceText: {
    color: "#00BDFF",
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    color: "white",
    fontSize: 16,
    lineHeight: 22,
  },
  controlButtons: {
    position: "absolute", 
    top: 20,
    right: 20,
    zIndex: 10,
    flexDirection: "row",
    gap: 10,
  },
  controlButton: {
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  expandIndicator: {
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  expandText: {
    color: "#CCC",
    fontSize: 14,
    marginLeft: 5,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00BDFF',
  },
  snackbar: {
    position: 'absolute',
    bottom: 80, // Position above tab navigation
    left: 16,
    right: 16,
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  snackbarText: {
    color: 'white',
    flex: 1,
    marginRight: 8,
  },
  snackbarButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#00BDFF',
    borderRadius: 4,
    marginRight: 8,
  },
  snackbarButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  snackbarClose: {
    padding: 4,
  },
  tooltipContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 1000,
  },
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '100%',
  },
  tooltipText: {
    color: '#333',
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  tooltipClose: {
    padding: 4,
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255, 255, 255, 0.95)',
    position: 'absolute',
    top: -8,
  },
});
