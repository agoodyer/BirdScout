import { Blackboard } from "./blackboard.ts";
import { Expert } from "./Expert.ts";
import { Sighting } from "./sighting.tsx";

export class Controller {
    private experts: { expert: Expert; name: string }[];

    constructor(experts: { expert: Expert; name: string }[]) {
        this.experts = experts;
    }

    async processArtifact(blackboard: Blackboard): Promise<void> {
        await Promise.all(
            this.experts.map(async ({ expert, name }) => {
                try {
                    const result = await expert.identify(blackboard.getArtifact());
                    // Add expert type to the sighting
                    result.sighting.expert_type = name;
                    blackboard.addHypothesis(result.sighting, result.confidence, name);
                } catch (error) {
                    console.error(`${name} expert failed: ${error}`);
                }
            })
        );
        this.makeDecision(blackboard);
    }

    private makeDecision(blackboard: Blackboard): void {
        const hypotheses = blackboard.getHypotheses();
        if (hypotheses.length === 0) throw new Error("No valid hypotheses");

        const speciesScores: Record<string, {
            totalConfidence: number;
            sighting: Sighting;
        }> = {};

        for (const { sighting, confidence } of hypotheses) {
            const key = `${sighting.common_name}|${sighting.species_name}`;
            if (!speciesScores[key]) {
                speciesScores[key] = { totalConfidence: 0, sighting };
            }
            speciesScores[key].totalConfidence += confidence;
        }

        let maxConfidence = 0;
        let finalSighting: Sighting | null = null;
        for (const key in speciesScores) {
            if (speciesScores[key].totalConfidence > maxConfidence) {
                maxConfidence = speciesScores[key].totalConfidence;
                finalSighting = speciesScores[key].sighting;
            }
        }

        if (finalSighting) {
            blackboard.setFinalDecision(finalSighting);
        }
    }
}