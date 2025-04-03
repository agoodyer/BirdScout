import { StyleSheet, ScrollView } from 'react-native';
import { JournalEntry } from '@/components/birdscout/JournalEntry';

import { Sighting } from '../types/sighting';
import { Artifact } from '../types/artifact';

import { sightings } from '@/assets/sightings';

export default function Journal() {

  return (

    <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
 {sightings.map((sighting) => (
        <JournalEntry key={sighting.id} sighting={sighting} />
      ))}
    </ScrollView>

  );
}
