// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs

// This file defines the cloud function to be executed upon artifact upload

// @ts-ignore: Ignore Deno import since it's not used in this environment
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import "https://deno.land/x/dotenv/load.ts";
import { LLMExpert } from "./LLMExpert";
import { Artifact } from "./artifact";

const supabase = createClient(
  // @ts-ignore: Ignore Deno  since it's not used in this environment
  Deno.env.get("SUPABASE_URL")!,
  // @ts-ignore: Ignore Deno  since it's not used in this environment
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // Use service role for DB writes
);

async function fetchArtifact(artifactId: string): Promise<Artifact> {
  const baseurl =
    "https://silypxhanlxapseqeqtt.supabase.co/storage/v1/object/public/birds/";
  const { data: artifactData, error: fetchError } = await supabase
    .from("artifacts")
    .select("*")
    .eq("id", artifactId)
    .single();

  if (fetchError || !artifactData) {
    throw new Error("Artifact not found");
  }

  return {
    id: artifactData.id.toString(),
    location: {
      latitude: artifactData.latitude,
      longitude: artifactData.longitude,
    },
    date: new Date(artifactData.date.replace(" ", "T")).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    ),

    imageUrl: `${baseurl}${artifactData.image_path}`,
    username: artifactData.username || "anonymous user",
  };
}

// @ts-ignore: Ignore Deno  since it's not used in this environment
Deno.serve(async (req) => {
  const body = await req.json();
  const artifactId = body.artifact_id;

  const artifact = await fetchArtifact(artifactId); //fetch artifact from database

  // @ts-ignore: Ignore Deno  since it's not used in this environment
  const llmExpert = new LLMExpert(Deno.env.get("OPENAI_KEY")!);
  const llm_result = await llmExpert.identify(artifact);

  if (llm_result) {
    const { error: insertError } = await supabase.from("sightings").upsert(
      {
        artifact_id: artifact.id,
        common_name: llm_result.commonName,
        species_name: llm_result.speciesName,
        description: llm_result.description,
      },
      { onConflict: ["artifact_id"] }
    );

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
      });
    }
  }

  return new Response(JSON.stringify({ success: true, llm_result }), {
    headers: { "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. in this directory (IMPORTANT) run: deno run --allow-net --allow-env index.ts
  2. Make an HTTP request:

curl -i --location --request POST 'http://localhost:8000' \
  --header 'Content-Type: application/json' \
  --data '{"artifact_id":"58ba3238-403b-4694-9323-7fdfd1a7cc62"}'

*/

//06ac0c40-957c-48f9-92e1-b6e69cef219f

//58ba3238-403b-4694-9323-7fdfd1a7cc62

// curl -L -X POST 'https://silypxhanlxapseqeqtt.supabase.co/functions/v1/classify-artifact' \
//   -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbHlweGhhbmx4YXBzZXFlcXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MTE2NjEsImV4cCI6MjA1OTI4NzY2MX0.sh-LowT6UUgquGHtMRMtW1uYNvtHV5qm9UFL1pVqBU4' \
//   -H 'Content-Type: application/json' \
//   --data '{"artifact_id":"f938388e-6ef5-4766-9c42-fbd7e525fbe7"}'
