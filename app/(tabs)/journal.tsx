import { StyleSheet, ScrollView } from 'react-native';
import { JournalEntry } from '@/components/birdscout/JournalEntry';

export default function Journal() {


  return (
    
    <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
      <JournalEntry image="https://www.ndow.org/wp-content/uploads/2021/10/branta_canadensis-scaled.jpeg" commonName='Canada Goose' speciesName="Branta Canadensis" date="April 22, 2025"/>
      <JournalEntry image="https://www.allaboutbirds.org/guide/assets/photo/304463771-480px.jpg" commonName='Pelican' speciesName="Pelecanus" date="March 6, 2025"/>
      <JournalEntry image="https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcS8FU-beI6zELEKha3GDRAR47ge2mekDCU2LOpYkonMMCwFsFlgxZmfy--ppogKECzdjy9XNHx0zrztUmUf" commonName='Homing Pigeon' speciesName="Columba livia domestica" date="March 1, 2025"/>
      <JournalEntry image="https://www.shutterstock.com/shutterstock/videos/3674524103/thumb/1.jpg?ip=x480" commonName='Blue Jay' speciesName="Cyanocitta cristata" date="February 18, 2025"/>
      <JournalEntry image="https://inaturalist-open-data.s3.amazonaws.com/photos/97752362/original.jpg" commonName='Crow' speciesName="Corvus Albus" date="February 10, 2025"/>
      <JournalEntry image="https://upload.wikimedia.org/wikipedia/commons/b/bf/Anas_platyrhynchos_male_female_quadrat.jpg" commonName='Mallard Duck' speciesName="Anas Platyrhynchos" date="February 1, 2025"/>
    
    </ScrollView>
      
  );
}
