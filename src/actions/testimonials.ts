"use server";

import { createClient } from "@/lib/supabase/server";
import { sendTestimonialNotification, sendWelcomeEmail } from "@/lib/email";
import { selectionsToText } from "@/lib/form-options";
import type { TestimonialFormData } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function submitTestimonial(data: TestimonialFormData) {
  if (data.permissionPublic !== true) {
    return { success: false, error: "Sharing consent is required." };
  }

  if (!data.visibilityType) {
    return { success: false, error: "Name visibility is required." };
  }

  const supabase = await createClient();

  const relationshipType =
    data.relationshipType === "Other" && data.relationshipOther.trim()
      ? `Other: ${data.relationshipOther.trim()}`
      : data.relationshipType;

  const impactAreas = data.impactAreas.map((area) =>
    area === "Other" && data.impactAreaOther.trim()
      ? `Other: ${data.impactAreaOther.trim()}`
      : area
  );

  const { error } = await supabase.from("testimonials").insert({
    full_name: data.fullName,
    email: data.email,
    company: data.company || null,
    role: data.role || null,
    relationship_type: relationshipType,
    relationship_other:
      data.relationshipType === "Other" ? data.relationshipOther.trim() || null : null,
    impact_areas: impactAreas,
    impact_area_other: data.impactAreas.includes("Other")
      ? data.impactAreaOther.trim() || null
      : null,
    experience_text: selectionsToText(data.experienceHighlights),
    transformation_text: selectionsToText(data.transformationOutcomes),
    results_text: selectionsToText(data.resultsHighlights),
    results_amount: data.resultsAmount.trim() || null,
    three_words: selectionsToText(data.descriptorWords),
    generated_short: data.generatedShort,
    generated_professional: data.generatedProfessional,
    generated_story: data.generatedStory,
    selected_version: data.selectedVersion,
    final_testimonial: data.finalTestimonial,
    permission_public: data.permissionPublic ?? false,
    visibility_type: data.visibilityType,
    photo_url: data.photoUrl || null,
    status: "pending",
  });

  if (error) {
    console.error("Failed to submit testimonial:", error);
    const message = error.message ?? "";
    if (/column|schema cache/i.test(message)) {
      return {
        success: false,
        error:
          "Submission failed because the database is missing required columns. Run supabase/migration-form-updates.sql in your Supabase SQL Editor, then try again.",
      };
    }
    return {
      success: false,
      error: "Something went wrong submitting your testimonial. Please try again.",
    };
  }

  await sendTestimonialNotification({
    fullName: data.fullName,
    relationshipType: data.relationshipType,
    finalTestimonial: data.finalTestimonial,
  });

  await sendWelcomeEmail(data.email, data.fullName);

  revalidatePath("/admin");
  return { success: true };
}

export async function updateTestimonial(
  id: string,
  updates: Partial<{
    final_testimonial: string;
    status: string;
    permission_public: boolean;
  }>
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("testimonials")
    .update(updates)
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/testimonials/${id}`);
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}
