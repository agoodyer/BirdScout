
import { Sighting } from "./sighting";
import { Artifact } from "./artifact";

export interface Expert {

identify(artifact:Artifact): Promise<Sighting>; 

}