import { StyleSheet, ScrollView } from 'react-native';
import { JournalEntry } from '@/components/birdscout/JournalEntry';

import { Sighting } from '../types/sighting';
import { Artifact } from '../types/artifact';

import { fetchSightings } from '@/api/fetchSightings';

import { auth, db } from "../../store/firebaseConfig";


import { useEffect, useState } from 'react';

import { createClient } from '@supabase/supabase-js';
import { sightings } from '@/assets/sightings';
const supabaseUrl = "https://silypxhanlxapseqeqtt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbHlweGhhbmx4YXBzZXFlcXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MTE2NjEsImV4cCI6MjA1OTI4NzY2MX0.sh-LowT6UUgquGHtMRMtW1uYNvtHV5qm9UFL1pVqBU4"; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);


export default function Journal() {

  const username = auth.currentUser.displayName;
  const [sightings, setSightings] = useState<Sighting[]>([]);
  //ONCE WE FINALIZE EVERYTHING, pass fetchSightings(username) to get journal entries for a specific user. 
  useEffect(() => { fetchSightings().then(setSightings) }, []);

  return (

    <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
      {sightings.map((sighting, index) => (
        <JournalEntry key={index} sighting={sighting} />
      ))}
    </ScrollView>

  );
}
