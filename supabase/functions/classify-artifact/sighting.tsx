import { Artifact } from "./artifact";

export class Sighting {

    constructor(
        public id: string,
        public commonName: string,
        public speciesName: string,
        public artifact: Artifact, 
        public description?: string //optional description
      ) {}
}