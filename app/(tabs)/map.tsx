import { StyleSheet, Image, Platform, View, Alert, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';


import MapView, { Callout, Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { LocationObjectCoords } from 'expo-location';


import { markers } from '../../assets/markers';
import LottieView from 'lottie-react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const onMarkerSelected = (marker: any) => {
  Alert.alert(marker.title);
}


export default function TabTwoScreen() {

  const [hasPermission, setHasPermission] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState<null | LocationObjectCoords>(null);

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
        showsMyLocationButton
        ref={mapRef}
      >
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker}
            style={{ opacity: 0 }}
            icon={require('../../assets/images/icon.png')}
            pinColor='#00BDFF'
          >

            {/* <View>
            <Text>{marker.title}</Text>
            </View> */}

            <Callout>

              {/* <View style={{ padding: 10, width: 200, height: 200 }}>

                <Image
                  source={require('@/assets/images/canada_goose.jpeg')}
                  style={{ width: 200, height: 100, }}
                  resizeMode="contain"
                />
                <Text>{marker.title}</Text>
              </View> */}

              <MapSighting commonName={marker.title} speciesName="Species Name" date="April 1, 2004" image="aaa"></MapSighting>

            </Callout>

          </Marker>
        ))}
      </MapView>
    </View>
  );
}



const MapSighting = ({ commonName, speciesName, image, date }: { commonName: string; speciesName: string; image: string, date: string }) => {

  const router = useRouter();
  return (
  
  

  <View style={{ height:200, justifyContent:'center', gap:10 }}>
    <Image
      source={require('@/assets/images/canada_goose.jpeg')}
      style={{ width: 200, height: 100, borderRadius: 10 }}

    />
    <Text style={{ fontWeight: 'bold', width:'100%' }}>{commonName}</Text>
    <Text style={{  width:'100%' }}>{speciesName}</Text>

    <View style={{ flexDirection: 'row', gap: 4, alignItems:'center'}}>
      <MaterialIcons name="calendar-month" size={24} color={'black'} />
      <Text>{date}</Text>
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
});
