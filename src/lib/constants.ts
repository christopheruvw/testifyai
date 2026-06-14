export const RELATIONSHIP_OPTIONS = [
  "Coaching Client",
  "Student",
  "Business Client",
  "Marketing Client",
  "Church Member",
  "Mentorship Recipient",
  "Friend",
  "Social Media Follower",
  "Other",
] as const;

export const IMPACT_AREA_OPTIONS = [
  "Sales",
  "Digital Marketing",
  "Funnel Building",
  "Web Design/Development",
  "Brand Designer",
  "AI Consulting",
  "Business",
  "Personal Development",
  "Leadership",
  "Career",
  "Faith",
  "Productivity",
  "Mindset",
  "Other",
] as const;

export const VISIBILITY_OPTIONS = [
  { value: "full_name", label: "Full Name" },
  { value: "first_name", label: "First Name Only" },
  { value: "anonymous", label: "Anonymous" },
] as const;

export const TESTIMONIAL_VERSIONS = [
  { value: "short", label: "Short" },
  { value: "professional", label: "Professional" },
  { value: "story", label: "Story-Based" },
  { value: "custom", label: "Custom" },
] as const;

export const TOTAL_FORM_STEPS = 12;

export const DESCRIPTOR_WORDS_MAX = 5;

export const CREATOR_NAME = process.env.NEXT_PUBLIC_CREATOR_NAME ?? "Christopher";

export function getSharingConsentText(creatorName: string = CREATOR_NAME): string {
  return `By submitting, you give ${creatorName} permission to use your testimonial, name (as selected below), and photo (if provided) on websites, social media, email, marketing materials, and other promotional content. Your testimonial may be edited for length or clarity while keeping its meaning.`;
}
