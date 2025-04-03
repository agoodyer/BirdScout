import { StyleSheet, ScrollView, Text, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { JournalEntry } from '@/components/birdscout/JournalEntry';
import { useEffect, useState } from 'react';
import { getUserBirdSightings, BirdSighting, deleteBirdSighting } from '../../services/birdSightingService';
import { useIsFocused } from '@react-navigation/native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Journal() {
  const [sightings, setSightings] = useState<BirdSighting[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    // Load sightings when the screen comes into focus
    if (isFocused) {
      loadSightings();
    }
  }, [isFocused]);

  const loadSightings = async () => {
    setLoading(true);
    try {
      const userSightings = await getUserBirdSightings();
      setSightings(userSightings);
    } catch (error) {
      console.error("Error loading bird sightings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSighting = (sightingId: string) => {
    Alert.alert(
      "Delete Sighting",
      "Are you sure you want to delete this sighting from your journal?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteBirdSighting(sightingId);
            if (success) {
              loadSightings();
            } else {
              Alert.alert("Error", "Failed to delete sighting");
            }
          }
        }
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BDFF" />
        <Text style={styles.loadingText}>Loading your bird journal...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
      {sightings.length > 0 ? (
        sightings.map((sighting, index) => (
          <View key={sighting.id || index}>
            <JournalEntry 
              image={sighting.imageUri} 
              commonName={sighting.species} 
              speciesName={sighting.scientificName} 
              date={formatDate(sighting.timestamp)}
            />
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDeleteSighting(sighting.id)}
            >
              <MaterialIcons name="delete" size={20} color="white" />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        // Show example entries if no sightings yet
        <>
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>No Bird Sightings Yet</Text>
            <Text style={styles.emptyStateText}>
              Capture and identify birds to add them to your journal.
            </Text>
          </View>
          
          <JournalEntry image="https://www.ndow.org/wp-content/uploads/2021/10/branta_canadensis-scaled.jpeg" commonName='Canada Goose' speciesName="Branta Canadensis" date="Example Entry"/>
          <JournalEntry image="https://www.allaboutbirds.org/guide/assets/photo/304463771-480px.jpg" commonName='Pelican' speciesName="Pelecanus" date="Example Entry"/>
          <JournalEntry image="https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcS8FU-beI6zELEKha3GDRAR47ge2mekDCU2LOpYkonMMCwFsFlgxZmfy--ppogKECzdjy9XNHx0zrztUmUf" commonName='Homing Pigeon' speciesName="Columba livia domestica" date="Example Entry"/>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyStateContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
