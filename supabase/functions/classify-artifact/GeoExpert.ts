import { Artifact } from "./artifact.tsx";
import { Sighting } from "./sighting.tsx";
import { Expert } from "./Expert.ts";
import birdData from "./birdCountries.json" with { type: "json" };

export class GeoExpert implements Expert {
    async identify(artifact: Artifact): Promise<{
        sighting: Sighting;
        confidence: number;
    }> {
        const country = this.determineCountry(artifact.location);
        const possibleBirds = birdData[country as keyof typeof birdData] || birdData.US;

        if (possibleBirds.length === 0) {
            return {
                sighting: new Sighting(
                    artifact.id,
                    "Unknown Bird",
                    "Unknown Species",
                    "No birds known in this location",
                    0, 
                    "GeoExpert"
                    
                ),
                confidence: 0
            };
        }

        const selectedBird = possibleBirds[Math.floor(Math.random() * possibleBirds.length)];
        const confidence = Math.min(0.9, 0.5 + (0.4 * (1 - (possibleBirds.length / 50))));
        
        return {
            sighting: new Sighting(
                artifact.id,
                selectedBird.common_name,
                selectedBird.scientific_name,
                `Identified by location (${country})`,
                confidence,
                "GeoExpert"
            ),
            confidence: parseFloat(confidence.toFixed(3))
        };
    }

    private determineCountry(location: { latitude: number; longitude: number }): string {
        if (location.latitude < 24) return "MX";
        if (location.latitude > 49) return "CA";
        return "US";
    }
}