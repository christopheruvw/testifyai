import OpenAI from "openai";
import type { GeneratedTestimonials } from "@/lib/types";
import { CREATOR_NAME } from "@/lib/constants";

const GROQ_MODEL = "llama-3.1-8b-instant";

function getGroq() {
  return new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
    timeout: 12_000,
    maxRetries: 0,
  });
}

interface GenerateInput {
  relationshipType: string;
  impactAreas: string[];
  experienceHighlights: string[];
  transformationOutcomes: string[];
  resultsHighlights?: string[];
  resultsAmount?: string;
  descriptorWords: string[];
  creatorName?: string;
}

function buildPrompt(input: GenerateInput): string {
  const creatorName = input.creatorName ?? CREATOR_NAME;
  const resultsLine =
    input.resultsHighlights?.length || input.resultsAmount
      ? `Measurable results: ${[
          ...(input.resultsHighlights ?? []),
          input.resultsAmount?.trim(),
        ]
          .filter(Boolean)
          .join("; ")}`
      : "";

  return `Write 3 first-person testimonials about ${creatorName}. Use only these selections:

Relationship: ${input.relationshipType}
Impact areas: ${input.impactAreas.join(", ")}
What stood out: ${input.experienceHighlights.join("; ")}
What changed: ${input.transformationOutcomes.join("; ")}
${resultsLine}
Describe as: ${input.descriptorWords.join(", ")}

Rules: natural tone, no hype, max 120 words each.

Return ONLY valid JSON with exactly these string keys (no other keys, no nested objects):
{"short":"...","professional":"...","story":"..."}`;
}

function buildFallback(input: GenerateInput): GeneratedTestimonials {
  const name = input.creatorName ?? CREATOR_NAME;
  const stoodOut = input.experienceHighlights.slice(0, 2).join(" and ");
  const changed = input.transformationOutcomes.slice(0, 2).join(" and ");
  const results = [
    ...(input.resultsHighlights ?? []).slice(0, 2),
    input.resultsAmount?.trim(),
  ]
    .filter(Boolean)
    .join(" and ");
  const words = input.descriptorWords.join(", ");
  const resultsPhrase = results ? ` On the numbers side, ${results.toLowerCase()}.` : "";

  return {
    short: `As a ${input.relationshipType.toLowerCase()}, ${stoodOut.toLowerCase()} really stood out to me. Because of ${name}, I gained ${changed.toLowerCase()}.${resultsPhrase} I'd describe ${name} as ${words.toLowerCase()}.`,
    professional: `My experience with ${name} as a ${input.relationshipType.toLowerCase()} has been genuinely valuable. ${stoodOut}. The result has been ${changed}.${resultsPhrase} ${name} is ${words} — and that shows in the impact made in areas like ${input.impactAreas.slice(0, 2).join(" and ")}.`,
    story: `When I first connected with ${name}, I didn't expect how much would shift. ${stoodOut}. Over time, I noticed real change: ${changed}.${resultsPhrase} Looking back, ${words} are the words that capture who ${name} is to me.`,
  };
}

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

function normalizeTestimonials(raw: unknown): GeneratedTestimonials | null {
  if (!raw || typeof raw !== "object") return null;

  const obj = raw as Record<string, unknown>;

  const fromStandard = {
    short: asString(obj.short),
    professional: asString(obj.professional),
    story: asString(obj.story),
  };
  if (fromStandard.short && fromStandard.professional && fromStandard.story) {
    return fromStandard as GeneratedTestimonials;
  }

  const numbered = [
    asString(obj.testimonial1 ?? obj.testimonial_1),
    asString(obj.testimonial2 ?? obj.testimonial_2),
    asString(obj.testimonial3 ?? obj.testimonial_3),
  ];
  if (numbered.every(Boolean)) {
    return {
      short: numbered[0]!,
      professional: numbered[1]!,
      story: numbered[2]!,
    };
  }

  const nested = obj.testimonials;
  if (nested && typeof nested === "object") {
    return normalizeTestimonials(nested);
  }

  // Model sometimes nests all three under one key as an object
  for (const value of Object.values(obj)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const nestedResult = normalizeTestimonials(value);
      if (nestedResult) return nestedResult;
    }
  }

  return null;
}

function parseResponse(content: string): GeneratedTestimonials {
  const parsed = JSON.parse(content) as unknown;
  const normalized = normalizeTestimonials(parsed);

  if (!normalized) {
    throw new Error("Incomplete JSON response");
  }

  return normalized;
}

async function callGroq(prompt: string): Promise<GeneratedTestimonials> {
  const response = await getGroq().chat.completions.create({
    model: GROQ_MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.6,
    max_tokens: 600,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from Groq");

  return parseResponse(content);
}

export async function generateTestimonials(
  input: GenerateInput
): Promise<GeneratedTestimonials> {
  if (!process.env.GROQ_API_KEY) {
    return buildFallback(input);
  }

  const prompt = buildPrompt(input);

  try {
    return await callGroq(prompt);
  } catch (error) {
    console.warn("Groq generation failed, using instant fallback:", error);
    return buildFallback(input);
  }
}
