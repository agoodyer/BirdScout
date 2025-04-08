import { createClient } from '@supabase/supabase-js';
import { sightings } from '@/assets/sightings';
import { Sighting } from '@/app/types/sighting';

const supabaseUrl = "https://silypxhanlxapseqeqtt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbHlweGhhbmx4YXBzZXFlcXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MTE2NjEsImV4cCI6MjA1OTI4NzY2MX0.sh-LowT6UUgquGHtMRMtW1uYNvtHV5qm9UFL1pVqBU4"; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// either fetch all sigtings for a username, or return ALL sightings
export const fetchSightings = async(username: string | null = null) =>{

  //console.log('fetching sightings!');

  let query = supabase.from('sightings').select(
`
    artifact_id,
    common_name,
    species_name,
    created_at,
    artifacts!fk_artifact_id (
      id,
      latitude,
      longitude,
      image_path,
      username,
      text_description
    ), 
    description
  `);


    // If userID is provided, filter sightings by userID
    if (username) {
        query = query.eq('artifacts.username', username); // Adjust based on your schema
    }else{
        query = query.limit(100); // only query 100 results for map  
    }
    

  const { data, error } = await query;


  if (error) {
    console.error('Failed to fetch sightings:', error);
    return;
  }


  const baseurl= "https://silypxhanlxapseqeqtt.supabase.co/storage/v1/object/public/birds/"
  const databaseSightings = data.map((row:any)=>{

    const artifact = row.artifacts; 


    return new Sighting(
      row.artifact_id,
      row.common_name, 
      row.species_name, 
      {
        id:artifact.id.toString(), 
        location:{
          latitude:artifact.latitude, 
          longitude:artifact.longitude
        }, 
        date: new Date(row.created_at).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),

        imageUrl: `${baseurl}${artifact.image_path}`, 
        username: artifact.username || 'anonymous user'

      },
      row?.description || "No Description"
    )

  }); 


  // console.log(databaseSightings)

  // const baseUrl = "https://<your-project-ref>.supabase.co/storage/v1/object/public/<bucket-name>/";
  // const fullUrl = `${baseUrl}${imagePath}`;

  const allSightings = [  ...sightings, ...databaseSightings,]; 
  return allSightings ; 

}
