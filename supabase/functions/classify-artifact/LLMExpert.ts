import { Artifact } from "./artifact";
import { Sighting } from "./sighting";
import { Expert } from "./Expert";

const baseurl = process.env.SUPABASE_STORAGE_URL || '';

export class LLMExpert implements Expert {

    constructor(private openAIKey: string = process.env.OPENAI_KEY || '') { }


    async identify(artifact: Artifact): Promise<Sighting> {

        try {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.openAIKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        {
                            role: "system",
                            content: `You are an expert ornithologist tasked with identifying birds in user-submitted images. Use visual clues to determine the species and provide accurate scientific data.

                                        Always return a JSON object with the following fields:
                                        - species (common name)
                                        - scientificName (Latin name)
                                        - confidence (a number between 0 and 1 indicating how confident you are in the identification)
                                        - description (2–3 sentences describing the bird, its habitat, and notable features)

                                        If **no bird is present** in the image, return this standardized fallback JSON object:

                                        {
                                        "species": "No bird found",
                                        "scientificName": "N/A",
                                        "confidence": 0,
                                        "description": "The image does not appear to contain a recognizable bird. Please try again with a clearer or more relevant photo."
                                        }

                                        Do not include any additional commentary or output outside of the JSON object.`,
                        },
                        {
                            role: "user",
                            content: [
                                { type: "text", text: artifact?.textDescription || "No text description was provided. please identify the bird in the image." },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: artifact.imageUrl,
                                    },
                                },
                            ]
                        }
                    ],
                    response_format: { type: "json_object" },
                })

            });

            const json = await res.json();
            const raw = json.choices?.[0]?.message?.content;
            const content = JSON.parse(raw);

            console.log(content);
            console.log(raw);


            return new Sighting(
                artifact.id,
                content?.species || "Unknown Bird",
                content?.scientificName || "Unknown Species",
                artifact,
                content?.description || "This bird was identified as a " + json?.species
            );

        } catch (err) {
            console.log(err);
        }



    }


}