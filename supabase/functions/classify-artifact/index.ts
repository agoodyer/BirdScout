// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs

// This file defines the cloud function to be executed upon artifact upload

// @ts-ignore: Ignore Deno import since it's not used in this environment
import { createClient } from "npm:@supabase/supabase-js";
import "https://deno.land/x/dotenv/load.ts";
import { LLMExpert } from "./LLMExpert.ts";
import { RuleBasedExpert } from "./RuleBasedExpert.ts";
import { GeoExpert } from "./GeoExpert.ts";
import { Blackboard } from "./blackboard.ts";
import { Controller } from "./controller.ts";
import { Artifact } from "./artifact.tsx";


const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// fetchArtifact now matches the Artifact interface correctly
async function fetchArtifact(id: string): Promise<Artifact> {
  const { data, error } = await supabase
    .from("artifacts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) throw new Error("Artifact not found");

  return {
    id: data.id,
    location: {
      latitude: data.latitude,
      longitude: data.longitude
    },
    created_at: data.date, // maps to 'created_at' in interface
    imageUrl: data.image_path, // maps to 'imageUrl' in interface
    username: data.username,
    textDescription: typeof data.text_description === "object"
      ? data.text_description.text
      : data.text_description || ""
  };
}

// @ts-ignore: Ignore Deno since it's not used in this environment
Deno.serve(async (req) => {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON payload", success: false }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!body?.artifact_id) {
      return new Response(JSON.stringify({ error: "Missing artifact_id in request body", success: false }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    //Fetch artifact from DB
    let artifact;
    try {
      artifact = await fetchArtifact(body.artifact_id);
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message, success: false }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const llmExpert = new LLMExpert(process.env.OPENAI_KEY!);
    const geoExpert = new GeoExpert();
    const ruleBasedExpert = new RuleBasedExpert();

    const blackboard = new Blackboard(artifact);
    const controller = new Controller([
      { expert: llmExpert, name: "LLM Expert" },
      { expert: geoExpert, name: "Geo Expert" },
      { expert: ruleBasedExpert, name: "Rule Based Expert" }
    ]);

    //Process using controller
    await controller.processArtifact(blackboard);
    const finalDecision = blackboard.getFinalDecision();

    if (!finalDecision) {
      return new Response(JSON.stringify({ error: "Bird identification failed", success: false }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    //Save results to Supabase
    const { error: insertError } = await supabase.from("sightings_duplicate").upsert(
      {
        artifact_id: artifact.id,
        common_name: finalDecision.common_name,
        species_name: finalDecision.species_name,
        description: finalDecision.description,
        confidence: finalDecision.confidence,
        expert_type: finalDecision.expert_type
      },
      { onConflict: ["artifact_id"] }
    );

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message, success: false }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    //Return result
    return new Response(
      JSON.stringify({
        success: true,
        result: {
          commonName: finalDecision.common_name,
          speciesName: finalDecision.species_name,
          description: finalDecision.description,
          confidence: finalDecision.confidence,
          expertType: finalDecision.expert_type
        }
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error", success: false }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});