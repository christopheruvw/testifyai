import { NextResponse } from "next/server";
import { generateTestimonials } from "@/lib/groq";
import { CREATOR_NAME, DESCRIPTOR_WORDS_MAX } from "@/lib/constants";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      relationshipType,
      impactAreas,
      experienceHighlights,
      transformationOutcomes,
      resultsHighlights,
      resultsAmount,
      descriptorWords,
    } = body;

    if (
      !relationshipType ||
      !impactAreas?.length ||
      !experienceHighlights?.length ||
      !transformationOutcomes?.length ||
      descriptorWords?.length !== DESCRIPTOR_WORDS_MAX
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const testimonials = await generateTestimonials({
      relationshipType,
      impactAreas,
      experienceHighlights,
      transformationOutcomes,
      resultsHighlights,
      resultsAmount,
      descriptorWords,
      creatorName: CREATOR_NAME,
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate testimonials" },
      { status: 500 }
    );
  }
}
