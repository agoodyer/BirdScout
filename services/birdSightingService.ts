import AsyncStorage from '@react-native-async-storage/async-storage';
import { BirdData } from "./openaiService";
import { saveImageToLocalStorage, deleteImageFromLocalStorage } from './storageService';

// Storage key
const BIRD_SIGHTINGS_KEY = 'birdscout_sightings';

export interface BirdSighting {
  id: string;
  species: string;
  scientificName: string;
  imageUri: string;
  confidence: number;
  description: string;
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  timestamp: number; // Using numeric timestamp instead of Firebase Timestamp
}

/**
 * Generate a unique ID for a sighting
 */
const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Save a bird sighting to AsyncStorage
 * 
 * @param birdData The identified bird data from OpenAI
 * @param imageUri The local URI of the bird image
 * @param location Optional location data
 * @returns Promise with the ID of the new sighting
 */
export async function saveBirdSighting(
  birdData: BirdData, 
  imageUri: string, 
  location?: { latitude: number; longitude: number; name?: string }
): Promise<string | null> {
  try {
    // Generate a unique ID for this sighting
    const sightingId = generateUniqueId();
    
    // Save the image to permanent storage
    const savedImageUri = await saveImageToLocalStorage(imageUri);
    
    // Create the sighting object
    const sightingData: BirdSighting = {
      id: sightingId,
      species: birdData.species,
      scientificName: birdData.scientificName,
      imageUri: savedImageUri,
      confidence: birdData.confidence,
      description: birdData.description,
      location: location,
      timestamp: Date.now()
    };

    // Get existing sightings
    const existingSightingsJSON = await AsyncStorage.getItem(BIRD_SIGHTINGS_KEY);
    const existingSightings: BirdSighting[] = existingSightingsJSON 
      ? JSON.parse(existingSightingsJSON) 
      : [];
    
    // Add new sighting to the beginning of the array
    const updatedSightings = [sightingData, ...existingSightings];
    
    // Save to AsyncStorage
    await AsyncStorage.setItem(BIRD_SIGHTINGS_KEY, JSON.stringify(updatedSightings));
    
    console.log("Bird sighting saved with ID:", sightingId);
    return sightingId;
  } catch (error) {
    console.error("Error saving bird sighting:", error);
    return null;
  }
}

/**
 * Get all bird sightings from AsyncStorage
 * 
 * @returns Promise with an array of bird sightings
 */
export async function getUserBirdSightings(): Promise<BirdSighting[]> {
  try {
    const sightingsJSON = await AsyncStorage.getItem(BIRD_SIGHTINGS_KEY);
    if (!sightingsJSON) {
      return [];
    }
    
    const sightings: BirdSighting[] = JSON.parse(sightingsJSON);
    
    // Sort by timestamp (newest first)
    return sightings.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error fetching bird sightings:", error);
    return [];
  }
}

/**
 * Delete a bird sighting by ID
 * 
 * @param sightingId The ID of the sighting to delete
 * @returns Promise resolving to true if deletion was successful
 */
export async function deleteBirdSighting(sightingId: string): Promise<boolean> {
  try {
    const sightingsJSON = await AsyncStorage.getItem(BIRD_SIGHTINGS_KEY);
    if (!sightingsJSON) {
      return false;
    }
    
    const sightings: BirdSighting[] = JSON.parse(sightingsJSON);
    
    // Find the sighting to delete
    const sightingToDelete = sightings.find(s => s.id === sightingId);
    if (!sightingToDelete) {
      return false;
    }
    
    // Delete the associated image file
    await deleteImageFromLocalStorage(sightingToDelete.imageUri);
    
    // Remove the sighting from the array
    const updatedSightings = sightings.filter(s => s.id !== sightingId);
    
    // Save the updated list
    await AsyncStorage.setItem(BIRD_SIGHTINGS_KEY, JSON.stringify(updatedSightings));
    return true;
  } catch (error) {
    console.error("Error deleting bird sighting:", error);
    return false;
  }
}

/**
 * Clear all bird sightings and associated images
 * 
 * @returns Promise resolving to true if clearing was successful
 */
export async function clearAllBirdSightings(): Promise<boolean> {
  try {
    // Get all sightings to delete their images
    const sightingsJSON = await AsyncStorage.getItem(BIRD_SIGHTINGS_KEY);
    if (sightingsJSON) {
      const sightings: BirdSighting[] = JSON.parse(sightingsJSON);
      
      // Delete each image file
      for (const sighting of sightings) {
        await deleteImageFromLocalStorage(sighting.imageUri);
      }
    }
    
    // Clear the sightings from storage
    await AsyncStorage.removeItem(BIRD_SIGHTINGS_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing bird sightings:", error);
    return false;
  }
} 