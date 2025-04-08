//LLMExpert.ts
import { Artifact } from "./artifact.tsx";
import { Sighting } from "./sighting.tsx";
import { Expert } from "./Expert.ts";

export class LLMExpert implements Expert {
    constructor(private openAIKey: string) { }

    async identify(artifact: Artifact): Promise<{
        sighting: Sighting;
        confidence: number;
    }> {
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
                            content: `You are an expert ornithologist...` // (your existing prompt)
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

            return {
                sighting: new Sighting(
                    artifact.id,
                    content?.species || "Unknown Bird",
                    content?.scientificName || "Unknown Species",
                    content?.description || "This bird was identified by AI",
                    parseFloat((content?.confidence || 0).toFixed(3)),
                    "LLMExpert"
                ),
                confidence: parseFloat((content?.confidence || 0).toFixed(3))
            };
        } catch (err) {
            return {
                sighting: new Sighting(
                    artifact.id,
                    "Unknown Bird",
                    "Unknown Species",
                    "AI identification failed",
                    0,
                    "LLMExpert"
                ),
                confidence: 0
            };
        }
    }
}