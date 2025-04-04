import { ScrollView, StyleSheet } from 'react-native';
import { JournalEntry } from '@/components/birdscout/JournalEntry';

export default function Journal() {
  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      style={{ backgroundColor: '#121212' }}
    >
      <JournalEntry 
        id="1"
        image="https://www.ndow.org/wp-content/uploads/2021/10/branta_canadensis-scaled.jpeg"
        commonName='Canada Goose' 
        speciesName="Branta canadensis" 
        date="April 22, 2025"
        location="Central Park, New York"
        notes="Flock of about 12 geese near the pond, very vocal in the morning"
        shortDesc="Large waterbird with black head and neck, white chinstrap"
        longDesc="The Canada goose is a large wild goose species with a black head and neck, white cheeks, white under its chin, and a brown body. Native to arctic and temperate regions of North America, its migration occasionally reaches northern Europe. They're known for their distinctive honking calls and V-shaped flight formations."
        foundBy="Jane Doe"
      />

      <JournalEntry 
        id="2"
        image="https://www.allaboutbirds.org/guide/assets/photo/304463771-480px.jpg"
        commonName='Brown Pelican' 
        speciesName="Pelecanus occidentalis" 
        date="March 6, 2025"
        location="Santa Monica Pier, California"
        notes="Diving for fish near the pier, caught 3 fish in 10 minutes"
        shortDesc="Large seabird with a distinctive pouch"
        longDesc="The brown pelican is a large seabird known for its enormous bill and expandable throat pouch. It's the smallest of the eight pelican species but still has a wingspan of about 7 feet. Unlike other pelicans, it primarily feeds by plunge-diving into the water from heights of up to 60 feet."
        foundBy="John Smith"
      />

      <JournalEntry 
        id="3"
        image="https://cdn12.picryl.com/photo/2016/12/31/mallard-duck-duck-new-animals-487672-1024.jpg"
        commonName='Mallard' 
        speciesName="Anas platyrhynchos" 
        date="February 18, 2025"
        location="Local Park Pond"
        notes="Pair swimming together, male displaying vibrant colors"
        shortDesc="Common dabbling duck with iridescent green head (male)"
        longDesc="The mallard is a large, heavy-bodied dabbling duck with a distinctive flat bill. Males have a glossy green head and white collar, while females are mottled brown. They're found across North America, Europe, and Asia, and are the ancestor of most domestic ducks. Mallards are highly adaptable and often found in urban parks."
        foundBy="Alex Johnson"
      />

      <JournalEntry 
        id="4"
        image="https://cdn.download.ams.birds.cornell.edu/api/v1/asset/297895101/1200"
        commonName='Northern Cardinal' 
        speciesName="Cardinalis cardinalis" 
        date="January 30, 2025"
        location="Backyard Feeder"
        notes="Male singing loudly from the maple tree at dawn"
        shortDesc="Bright red songbird with distinctive crest"
        longDesc="The northern cardinal is a mid-sized songbird with a distinctive crest on the head and a mask-like black face in males. Males are bright red, while females are pale brown with reddish tinges. Cardinals don't migrate and are known for their loud, clear whistled songs. They're common in backyards across eastern and central North America."
        foundBy="Sarah Williams"
      />

      <JournalEntry 
        id="5"
        image="https://cdn.download.ams.birds.cornell.edu/api/v1/asset/297896271/1200"
        commonName='Blue Jay' 
        speciesName="Cyanocitta cristata" 
        date="December 15, 2024"
        location="Oak Forest Preserve"
        notes="Group of 4 jays making alarm calls near hawk nest"
        shortDesc="Noisy, colorful bird with blue crest"
        longDesc="Blue jays are intelligent, noisy birds with striking blue, white, and black plumage. They're known for their loud 'jay! jay!' calls and ability to mimic hawks. Omnivorous, they eat everything from acorns to insects and small vertebrates. They're highly territorial and will mob potential predators."
        foundBy="Michael Brown"
      />

      <JournalEntry 
        id="6"
        image="https://cdn.download.ams.birds.cornell.edu/api/v1/asset/297896501/1200"
        commonName='American Robin' 
        speciesName="Turdus migratorius" 
        date="November 5, 2024"
        location="School Grounds"
        notes="Large flock feeding on berry bushes after rain"
        shortDesc="Familiar thrush with red breast and cheerful song"
        longDesc="The American robin is a large, familiar songbird with a reddish-orange breast and dark gray back. They're often seen running across lawns stopping to pull up earthworms. Robins are among the first birds to sing at dawn and one of the last at dusk. They migrate in large, loose flocks in winter."
        foundBy="Emily Davis"
      />

      <JournalEntry 
        id="7"
        image="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Bald_eagle_about_to_fly_in_Alaska_%282016%29.jpg/1200px-Bald_eagle_about_to_fly_in_Alaska_%282016%29.jpg"
        commonName='Bald Eagle' 
        speciesName="Haliaeetus leucocephalus" 
        date="October 12, 2024"
        location="Lake Michigan Shoreline"
        notes="Adult pair nesting in tall pine, seen catching fish"
        shortDesc="Majestic raptor with white head and tail"
        longDesc="The bald eagle is a large bird of prey with a wingspan up to 7.5 feet. Adults have distinctive white heads and tails with dark brown bodies. They build massive nests in tall trees near water. As apex predators, they primarily eat fish but will scavenge when opportunity arises. They're the national bird of the United States."
        foundBy="David Wilson"
      />

      <JournalEntry 
        id="8"
        image="https://cdn.download.ams.birds.cornell.edu/api/v1/asset/60390101/1200"
        commonName='Great Horned Owl' 
        speciesName="Bubo virginianus" 
        date="September 28, 2024"
        location="Forest Edge"
        notes="Heard calling at dusk, spotted in pine tree"
        shortDesc="Powerful owl with distinctive ear tufts"
        longDesc="The great horned owl is a large, powerful owl with distinctive ear tufts. They have excellent night vision and hearing, hunting a wide variety of prey from small mammals to other birds. Their deep hooting calls are a classic sound of North American woodlands. They're early nesters, often claiming nests in winter."
        foundBy="Olivia Martinez"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 80,
  },
});