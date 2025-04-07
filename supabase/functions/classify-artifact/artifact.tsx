export interface Artifact{
    
    id: string;
    location: {
        latitude: number;
        longitude: number;
      };   
    date: string;
    imageUrl: string; 
    username: string;
    textDescription?: string;
}