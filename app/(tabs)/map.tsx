import { StyleSheet, Image, Platform, View, Alert, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';


import MapView, { Callout, Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, MapTypes } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { LocationObjectCoords } from 'expo-location';


import { markers } from '../../assets/markers';
import LottieView from 'lottie-react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

export default function TabTwoScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState<null | LocationObjectCoords>(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid' | 'terrain'>('standard');

  const mapRef = useRef<any>();
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        setHasPermission(false);
        return;
      }
      setHasPermission(true);

      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        console.log("No location available");
        setLocationEnabled(false);
        return;
      }

      setLocationEnabled(true);

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setUserLocation(location.coords);
    };
    requestPermissions();
  }, []);

  const goToUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.025,
      }, 1000);
    }
  };

  const toggleMapType = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  if (!hasPermission || !locationEnabled || !userLocation) {
    return (
      <View style={styles.container}>
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.animationContainer}>
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: 150,
                height: 150,
              }}
              source={require('../../assets/animations/warn.json')}
            />
            <ThemedText type='defaultSemiBold'>You need to enable location services to proceed.</ThemedText>
          </View>
        </View>
      </View>
    );
  }

  const INITIAL_REGION = {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        mapType={mapType}
        ref={mapRef}
      >
        {markers.map((marker, index) => (
          <Marker 
            key={index} 
            coordinate={marker}
            title={marker.title}
            pinColor='#00BDFF'
          >
            <Callout tooltip>
              <MapSighting 
                commonName={marker.title} 
                speciesName="Aves" 
                date="April 1, 2024" 
                image="aaa"
              />
            </Callout>
          </Marker>
        ))}
      </MapView>
      
      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity 
          style={styles.mapButton} 
          onPress={goToUserLocation}
        >
          <MaterialIcons name="my-location" size={24} color="#007AFF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.mapButton} 
          onPress={toggleMapType}
        >
          <MaterialIcons 
            name={mapType === 'standard' ? "satellite" : "map"} 
            size={24} 
            color="#007AFF" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const MapSighting = ({ commonName, speciesName, image, date }: { commonName: string; speciesName: string; image: string, date: string }) => {
  const router = useRouter();
  
  return (
    <View style={styles.calloutContainer}>
      <Image
        source={require('@/assets/images/canada_goose.jpeg')}
        style={styles.calloutImage}
      />
      <Text style={styles.calloutTitle}>{commonName}</Text>
      <Text style={styles.calloutSubtitle}>{speciesName}</Text>

      <View style={styles.calloutDateContainer}>
        <MaterialIcons name="calendar-month" size={18} color={'#666'} />
        <Text style={styles.calloutDate}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  animationContainer: {
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    flexDirection: 'column',
    gap: 10,
  },
  mapButton: {
    backgroundColor: 'white',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  calloutContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  calloutImage: {
    width: '100%', 
    height: 120, 
    borderRadius: 8, 
    marginBottom: 8,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  calloutSubtitle: {
    color: '#666',
    marginBottom: 8,
  },
  calloutDateContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4,
  },
  calloutDate: {
    color: '#666',
    fontSize: 14,
  },
});
