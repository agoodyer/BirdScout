//RuleBasedExpert.ts
import { Artifact } from "./artifact.tsx";
import { Sighting } from "./sighting.tsx";
import { Expert } from "./Expert.ts";
import birdData from "./birdCountries.json" with { type: "json" };

export class RuleBasedExpert implements Expert {
    private keywordToBirds: Record<string, { common_name: string; scientific_name: string }[]> = {
        "red": this.getAllBirds().filter(b => b.common_name.toLowerCase().includes('red')),
        "blue": this.getAllBirds().filter(b => b.common_name.toLowerCase().includes('blue')),
        "small": [
            { common_name: "House Sparrow", scientific_name: "Passer domesticus" },
            { common_name: "Chickadee", scientific_name: "Poecile spp." }
        ],
        "large": [
            { common_name: "Great Blue Heron", scientific_name: "Ardea herodias" },
            { common_name: "Bald Eagle", scientific_name: "Haliaeetus leucocephalus" }
        ],
        "water": [
            { common_name: "Mallard", scientific_name: "Anas platyrhynchos" },
            { common_name: "Canada Goose", scientific_name: "Branta canadensis" }
        ]
    };

    private getAllBirds() {
        return Object.values(birdData).flat();
    }

    async identify(artifact: Artifact): Promise<{
        sighting: Sighting;
        confidence: number;
    }> {
        const text = artifact.textDescription?.toLowerCase() || "";
        const keywords = Object.keys(this.keywordToBirds);
        const matchingKeywords = keywords.filter(k => text.includes(k));

        if (matchingKeywords.length === 0) {
            return {
                sighting: new Sighting(
                    artifact.id,
                    "Unknown Bird",
                    "Unknown Species",
                    "No matching keywords in description", 
                    0, 
                    "RuleBasedExpert"
                ),
                confidence: 0
            };
        }

        let possibleBirds: { common_name: string; scientific_name: string }[] = [];
        matchingKeywords.forEach(k => {
            possibleBirds.push(...this.keywordToBirds[k]);
        });

        const uniqueBirds = possibleBirds.filter(
            (bird, index, self) => index === self.findIndex(
                b => b.common_name === bird.common_name
            )
        );

        if (uniqueBirds.length === 0) {
            return {
                sighting: new Sighting(
                    artifact.id,
                    "Unknown Bird",
                    "Unknown Species",
                    "No birds match the description keywords",
                    0, 
                    "RuleBasedExpert"
                ),
                confidence: 0
            };
        }

        const bestMatch = uniqueBirds.reduce((prev, current) => {
            const prevScore = matchingKeywords.filter(k => 
                prev.common_name.toLowerCase().includes(k)).length;
            const currentScore = matchingKeywords.filter(k => 
                current.common_name.toLowerCase().includes(k)).length;
            return currentScore > prevScore ? current : prev;
        });

        const keywordMatchScore = matchingKeywords.filter(k => 
            bestMatch.common_name.toLowerCase().includes(k)).length / matchingKeywords.length;
        const confidence = parseFloat((0.3 + (keywordMatchScore * 0.5)).toFixed(3));

        return {
            sighting: new Sighting(
                artifact.id,
                bestMatch.common_name,
                bestMatch.scientific_name,
                `Identified by keywords: ${matchingKeywords.join(", ")}`,
                confidence, 
                "RuleBasedExpert"
            ),
            confidence
        };
    }
}