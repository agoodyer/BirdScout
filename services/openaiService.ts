import OpenAI from 'openai';
import { OPENAI_API_KEY } from '@env';
import * as FileSystem from 'expo-file-system';

// Initialize OpenAI client with API key from environment variable
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY || 'YOUR-API-KEY-HERE', // Use environment variable or a placeholder
});

// Bird identification response type
export interface BirdData {
  species: string;
  scientificName: string;
  confidence: number;
  description: string;
}

/**
 * Identifies a bird from an image using OpenAI's GPT-4o Vision model
 * 
 * @param imageUri Local URI of the image to analyze
 * @param base64 Optional base64 string of the image (to avoid reading file twice)
 * @returns Promise resolving to bird identification data
 */
export async function identifyBird(imageUri: string, base64?: string): Promise<BirdData> {
  try {
    // Read the image file as base64 if not provided
    const base64Image = base64 || await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert ornithologist. Identify the bird in the image and provide detailed information about the species. Return the data in JSON format with fields: species (common name), scientificName, confidence (0-1), and description (2-3 sentences about the bird). If no bird is detected in the image, indicate this with appropriate values."
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Identify the bird in this image and give me detailed information." },
            { 
              type: "image_url", 
              image_url: { 
                url: `data:image/jpeg;base64,${base64Image}` 
              } 
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the JSON response
    const responseContent = response.choices[0].message.content || "{}";
    return JSON.parse(responseContent);
  } catch (error) {
    console.error("Error identifying bird:", error);
    
    // Return fallback data in case of error
    return {
      species: "Unknown Bird",
      scientificName: "N/A",
      confidence: 0,
      description: "Could not identify the bird in this image. Please try again with a clearer photo."
    };
  }
} 