// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs


// This file defines the cloud function to be executed upon artifact upload


// @ts-ignore: Ignore Deno import since it's not used in this environment
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import "https://deno.land/x/dotenv/load.ts";


// console.log("Hello from Functions!")

// @ts-ignore: Ignore Deno  since it's not used in this environment
Deno.serve(async (req) => {
  const body = await req.json();
  const artifactId = body.artifact_id;

  console.log(body)

  const supabase = createClient(
    // @ts-ignore: Ignore Deno  since it's not used in this environment
    Deno.env.get("SUPABASE_URL")!,
    // @ts-ignore: Ignore Deno  since it's not used in this environment
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // Use service role for DB writes
  );

  const { data: artifact, error: fetchError } = await supabase
  .from("artifacts")
  .select("*")
  .eq("id", artifactId)
  .single();

  if (fetchError || !artifact) {
    return new Response(
      JSON.stringify({ error: "Artifact not found" }),
      { status: 404 }
    );
  }

  console.log(artifact); 

  const { error: insertError } = await supabase.from("sightings").upsert({
    artifact_id: artifact.id,
    common_name: "Test Bird " + Math.floor(Math.random() * 101), // Replace with real classification logic later
    species_name: "Corvus testicus",
    description: 'Reasoning for chosen classification.'
  }, { onConflict: ["artifact_id"] });

  if (insertError) {
    return new Response(
      JSON.stringify({ error: insertError.message }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({success:true}),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. in this directory (IMPORTANT) run: deno run --allow-net --allow-env index.ts
  2. Make an HTTP request:

curl -i --location --request POST 'http://localhost:8000' \
  --header 'Content-Type: application/json' \
  --data '{"artifact_id":"e8d7abb3-2746-4f61-9aac-b6e660601ff9"}'

*/
