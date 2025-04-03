import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

// Directory where we'll store all the bird images
const BIRD_IMAGES_DIRECTORY = FileSystem.documentDirectory + 'bird-images/';

/**
 * Initialize the images directory if it doesn't exist
 */
export const initializeStorage = async (): Promise<void> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(BIRD_IMAGES_DIRECTORY);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(BIRD_IMAGES_DIRECTORY, { intermediates: true });
      console.log('Created bird images directory');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

/**
 * Save an image to local storage and return its new URI
 * 
 * @param imageUri The original URI of the image (could be temporary)
 * @returns The local URI of the saved image
 */
export const saveImageToLocalStorage = async (imageUri: string): Promise<string> => {
  try {
    // Make sure storage is initialized
    await initializeStorage();
    
    // Create a unique filename based on timestamp and random string
    const fileName = 
      `bird_${Date.now()}_${Math.random().toString(36).substring(2, 10)}.jpg`;
    const localUri = BIRD_IMAGES_DIRECTORY + fileName;
    
    // Copy image to our permanent storage location
    await FileSystem.copyAsync({
      from: imageUri,
      to: localUri
    });
    
    console.log('Saved image to:', localUri);
    return localUri;
  } catch (error) {
    console.error('Error saving image to local storage:', error);
    return imageUri; // Return original URI if saving fails
  }
};

/**
 * Delete an image from local storage
 * 
 * @param imageUri The URI of the image to delete
 * @returns Boolean indicating success
 */
export const deleteImageFromLocalStorage = async (imageUri: string): Promise<boolean> => {
  try {
    // Only delete if it's in our app's directory
    if (imageUri.startsWith(BIRD_IMAGES_DIRECTORY)) {
      await FileSystem.deleteAsync(imageUri);
      console.log('Deleted image:', imageUri);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

/**
 * Get the size of all stored bird images
 * 
 * @returns The total size in bytes
 */
export const getStorageUsage = async (): Promise<number> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(BIRD_IMAGES_DIRECTORY);
    if (!dirInfo.exists) {
      return 0;
    }
    
    // Read all files in the directory
    const files = await FileSystem.readDirectoryAsync(BIRD_IMAGES_DIRECTORY);
    
    // Calculate total size
    let totalSize = 0;
    for (const file of files) {
      const fileInfo = await FileSystem.getInfoAsync(BIRD_IMAGES_DIRECTORY + file);
      if (fileInfo.exists && fileInfo.size) {
        totalSize += fileInfo.size;
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    return 0;
  }
};

/**
 * Clear all stored bird images
 * 
 * @returns Boolean indicating success
 */
export const clearImageStorage = async (): Promise<boolean> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(BIRD_IMAGES_DIRECTORY);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(BIRD_IMAGES_DIRECTORY);
      await FileSystem.makeDirectoryAsync(BIRD_IMAGES_DIRECTORY, { intermediates: true });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error clearing image storage:', error);
    return false;
  }
}; 