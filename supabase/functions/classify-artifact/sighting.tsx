export class Sighting {
    constructor(
        public artifact_id: string,  // Match database field name
        public common_name: string,  // Match database field name
        public species_name: string, // Match database field name
        public description?: string,
        public confidence?: number,
        public expert_type?: string, 
        public created_at?: string  // Match database field name        
    ) {}
}