# BirdScout

BirdScout is a mobile prototype for identifying birds from a photo and keeping the result in a field journal. It also includes a map of community sightings and a small achievement system.

<img src="assets/images/birdscout.png" alt="BirdScout" width="480">

**[View the project case study](https://agoodyer.com/projects/birdscout/)**

Six students built BirdScout over roughly four months for McMaster University's SFWRENG 3AA4 software design course. The project covered requirements, architecture, implementation, and integration rather than only the final application.

## Observation flow

1. A user takes a photo or chooses one from their library, optionally adding notes and a location.
2. The mobile client uploads the image to Supabase Storage and saves an artifact record in PostgreSQL.
3. A Supabase Edge Function retrieves the artifact and asks a vision-capable model for a suggested species.
4. The resulting sighting is saved and reused by the result, journal, map, and achievement views.

The application treats the model response as a suggestion, not an authoritative identification. The prototype did not include a labelled evaluation set, so it does not make an accuracy claim.

## Implemented system

The client is an Expo and React Native application written in TypeScript. Expo Router provides file-based navigation and the Expo camera, image-picker, and location packages handle observation input.

The prototype uses two backend services:

- **Firebase Authentication and Firestore** manage accounts and profile data.
- **Supabase** stores photographs and sighting records and runs the classification Edge Function.

The Edge Function invokes GPT-4o with the photograph and optional field notes, parses the structured response, and upserts the identified sighting. Journal and map screens query the saved records; the detail screen uses OpenStreetMap's Nominatim service to turn coordinates into a readable location.

## Designed architecture versus prototype

The course design proposed a blackboard-style identification system in which a generative model, geographic expert, and rule-based expert could contribute independently. An identification controller would combine their evidence while allowing any one expert to be replaced or temporarily unavailable.

The working prototype implements a narrower version of that idea. The deployed function instantiates one vision-model expert; the geographic and rule-based experts were not integrated into the end-to-end path. Keeping that distinction explicit matters because the architecture documents describe a more complete system than the application currently runs.

## What I worked on

My work covered both design and implementation:

- drafted the initial purpose, scope, and security requirements;
- helped define the business events and stakeholder viewpoints;
- created the use-case and system-architecture diagrams and contributed to the subsystem and class design;
- built the initial mobile interface and core artifact/sighting model;
- implemented photo storage, database-backed sightings, and classification through the Edge Function;
- integrated the journal and map data paths and handled loading, refresh, theming, and platform compatibility.

The repository's commit history reflects that integration role, while the final product and course deliverables were shared across all six team members.

## Development

Requirements:

- Node.js LTS
- Expo Go or an Android/iOS emulator

Install the locked dependencies and start Expo:

```sh
npm ci
npx expo start
```

Run the existing Jest snapshot test once, without watch mode:

```sh
npm test -- --watchAll=false --runInBand
```

The interface can be launched from a clean clone, but the end-to-end observation flow depends on configured Firebase and Supabase projects and a deployed Edge Function. The current code is coupled to the original course deployment in several places rather than packaged as a turnkey backend.

The Edge Function expects Supabase credentials and an OpenAI API key at runtime. Service-role and model-provider keys must remain server-side and should never be committed to a client build.

## Repository map

- `app/` — Expo Router screens for identification, accounts, journal, map, and achievements
- `components/birdscout/` — project-specific result, journal, and settings components
- `api/` — sighting queries and domain-object mapping
- `store/` — Firebase client configuration
- `supabase/functions/classify-artifact/` — classification and sighting persistence
- `app/types/` — artifact and sighting domain types

## Current limitations

- The classifier was not evaluated as a scientific bird-identification system.
- The proposed multi-expert architecture is only partially implemented.
- Location privacy and opt-in community sharing were design goals, not complete prototype features.
- Several achievements are static placeholders.
- Backend configuration is split between environment variables and values embedded in source.
- The automated test suite currently consists of one component snapshot test.

## Team

- [Aidan Goodyer](https://github.com/agoodyer)
- [Hamza Abou Jaib](https://github.com/HamzaAbouJaib)
- [May Yan](https://github.com/mayyan531)
- [Muhammad Zaka](https://github.com/zakamm)
- [Nawaal Fatima](https://github.com/NawaalFatima)
- [Aravin Shankar](https://github.com/aravin04)

## License

[MIT](LICENSE)
