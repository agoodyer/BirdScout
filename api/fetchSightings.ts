import { createClient } from '@supabase/supabase-js';
import { sightings } from '@/assets/sightings';
import { Sighting } from '@/app/types/sighting';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
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


  const baseurl = process.env.SUPABASE_STORAGE_URL || '';
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
