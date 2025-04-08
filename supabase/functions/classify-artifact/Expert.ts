//expert.ts
import { Sighting } from "./sighting.tsx";
import { Artifact } from "./artifact.tsx";

export interface Expert {
    identify(artifact: Artifact): Promise<{
        sighting: Sighting;
        confidence: number;
    }>;
}