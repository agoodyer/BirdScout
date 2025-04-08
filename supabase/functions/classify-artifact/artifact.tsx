export interface Artifact {
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  created_at: string;  // Matches the 'date' field in CSV
  imageUrl: string;    // Should map to 'image_path' in database
  username: string;
  textDescription?: string;  // Should handle the JSON format {"text": "..."}
}