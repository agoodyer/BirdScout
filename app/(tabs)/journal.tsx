import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { JournalEntry } from '@/components/birdscout/JournalEntry';
import { Sighting } from '../types/sighting';
import { fetchSightings } from '@/api/fetchSightings';
import { auth } from "../../store/firebaseConfig";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import React from 'react';

const supabaseUrl = "https://silypxhanlxapseqeqtt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbHlweGhhbmx4YXBzZXFlcXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MTE2NjEsImV4cCI6MjA1OTI4NzY2MX0.sh-LowT6UUgquGHtMRMtW1uYNvtHV5qm9UFL1pVqBU4";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Journal() {
  const [refreshing, setRefreshing] = React.useState(false);
  const username = auth.currentUser?.displayName;
  const [sightings, setSightings] = useState<Sighting[]>([]);

  useEffect(() => { fetchSightings().then(setSightings) }, []);

  const onRefresh = async() => {
    setRefreshing(true); 
    try {
      const newSightings = await fetchSightings();
      setSightings(newSightings); 
    } catch(err) {
      console.log("failed to refresh sightings"); 
    } finally {
      setRefreshing(false); 
    }
  }

  return (
    <View style={styles.outerContainer}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={0}
          />
        }
        overScrollMode="never"
        bounces={false}
      >
        <View style={styles.contentContainer}>
          {sightings?.map((sighting, index) => (
            <JournalEntry key={index} sighting={sighting} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  scrollView: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 0,
    margin: 0,
  },
  contentContainer: {
    paddingBottom: 20, // Small bottom padding only
  },
});