import { Sighting } from "@/app/types/sighting";

  export const sightings = [

    new Sighting('1', 'Canada Goose', 'Branta Canadensis', {
      id: "1",
      location: {  latitude: 43.2666534,
        longitude: -79.905031, },
      date: "April 22, 2025",
      imageUrl: "https://www.ndow.org/wp-content/uploads/2021/10/branta_canadensis-scaled.jpeg",
    },), 

    new Sighting('2', 'Pelican', 'Pelecanus', {
      id: "2",
      location: {  latitude: 43.279730,
        longitude: -79.915941, },
      date: "March 6, 2025",
      imageUrl: "https://www.allaboutbirds.org/guide/assets/photo/304463771-480px.jpg",
    }),
    new Sighting('3', 'Homing Pigeon', 'Columba livia domestica', {
      id: "3",
      location: { latitude: 43.320412,
        longitude: -79.750231,},
      date: "March 1, 2025",
      imageUrl: "https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcS8FU-beI6zELEKha3GDRAR47ge2mekDCU2LOpYkonMMCwFsFlgxZmfy--ppogKECzdjy9XNHx0zrztUmUf",
    }),

    new Sighting('4', 'Blue Jay', 'Cyanocitta cristata', {
      id: "4",
      location: {  latitude: 43.180341,
        longitude: -79.990324, },
      date: "February 18, 2025",
      imageUrl: "https://www.shutterstock.com/shutterstock/videos/3674524103/thumb/1.jpg?ip=x480",
    }),

    new Sighting('5', 'Crow', 'Corvus Albus', {
      id: "5",
      location: {  latitude: 43.340782,
        longitude: -79.920843, },
      date: "February 10, 2025",
      imageUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/97752362/original.jpg",
    }),

    new Sighting('6', 'Mallard Duck', 'Anas Platyrhynchos', {
      id: "6",
      location: {   latitude: 43.215675,
        longitude: -80.045312, },
      date: "February 1, 2025",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Anas_platyrhynchos_male_female_quadrat.jpg",
    }),

  ]