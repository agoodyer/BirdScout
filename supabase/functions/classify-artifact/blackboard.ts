import { Artifact } from "./artifact.tsx";
import { Sighting } from "./sighting.tsx";

export class Blackboard {
    private artifact: Artifact;
    private hypotheses: {
        sighting: Sighting;
        confidence: number;
        expert: string;
    }[] = [];
    private finalDecision: Sighting | null = null;

    constructor(artifact: Artifact) {
        this.artifact = artifact;
    }

    addHypothesis(sighting: Sighting, confidence: number, expert: string): void {
        this.hypotheses.push({ sighting, confidence, expert });
    }

    getHypotheses() {
        return this.hypotheses;
    }

    setFinalDecision(sighting: Sighting): void {
        this.finalDecision = sighting;
    }

    getFinalDecision(): Sighting | null {
        return this.finalDecision;
    }

    getArtifact(): Artifact {
        return this.artifact;
    }
}